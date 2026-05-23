"use client";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Result,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { UploadFile } from "antd/es/upload/interface";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import { debounce } from "lodash";
import priceCalculate from "@/lib/price-calculate";

export interface ProductInterface {
  title: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  image: UploadFile[];
}

export interface FetchedProductInterface {
  _id: string;
  title: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  image: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

const Products = () => {
  const [productForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [editId, setEditId] = useState<string | null>(null);
  const { data, error, isLoading } = useSWR(
    `/api/product?page=${page}&limit=${limit}`,
    fetcher,
  );
  const [products, setProducts] = useState({ data: [], total: 0 });

  useEffect(() => {
    if (data) {
      Promise.resolve().then(() => {
        setProducts(data);
      });
    }
  }, [data]);

  const onSearch = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value.trim();
      const { data } = await axios.get(`/api/product?search=${value}`);
      setProducts(data);
    } catch (err) {
      clientCatchError(err);
    }
  }, 2000);

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    productForm.resetFields();
  };

  const createProduct = async (values: ProductInterface) => {
    try {
      const image = values.image[0].originFileObj;

      const formData = new FormData();

      for (const key in values) {
        if (key !== "image") {
          formData.append(key, String(values[key as keyof ProductInterface]));
        }
      }

      if (image) {
        formData.append("image", image);
      }

      await axios.post("/api/product", formData);
      mutate(`/api/product?page=${page}&limit=${limit}`);
      message.success("Product added successfully !");
      handleClose();
    } catch (err: unknown) {
      clientCatchError(err);
    }
  };

  const onPaginate = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
  };

  const editProduct = (item: FetchedProductInterface) => {
    setEditId(item._id);
    setOpen(true);

    productForm.setFieldsValue({
      title: item.title,
      price: item.price,
      discount: item.discount,
      quantity: item.quantity,
      description: item.description,

      image: [
        {
          uid: item._id,
          name: item.title,
          status: "done",
          url: item.image,
        },
      ],
    });
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/product/${id}`);
      mutate(`/api/product?page=${page}&limit=${limit}`);
    } catch (err) {
      clientCatchError(err);
    }
  };

  const saveProduct = async (values: ProductInterface) => {
    try {
      await axios.put(`/api/product/${editId}`, values);
      handleClose();
      mutate(`/api/product?page=${page}&limit=${limit}`);
    } catch (err) {
      clientCatchError(err);
    }
  };

  const changeImage = (id: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        if (!input.files) return message.error("File not seleted");

        const file = input.files[0];
        input.remove();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("image", file);
        await axios.put("/api/product/change-image", formData);
        mutate(`/api/product?page=${page}&limit=${limit}`);
      };
    } catch (err) {
      clientCatchError(err);
    }
  };

  if (isLoading) return <Skeleton active />;

  if (error) return <Result status="error" title={error.message} />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Input
          placeholder="Search this site"
          className="w-87.5!"
          size="large"
          onChange={onSearch}
        />
        <Button
          onClick={() => setOpen(true)}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="bg-indigo-500!"
        >
          Add product
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {products.data.map((item: FetchedProductInterface, index: number) => (
          <Card
            key={index}
            hoverable
            cover={
              <div className="relative w-full h-45">
                <Popconfirm
                  title="Do you want to change image ?"
                  onConfirm={() => changeImage(item._id)}
                >
                  <Image
                    src={item.image}
                    fill
                    alt={item.title}
                    priority={index === 0}
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Popconfirm>
              </div>
            }
            actions={[
              <EditOutlined
                key="edit"
                className="text-green-400!"
                onClick={() => editProduct(item)}
              />,
              <Popconfirm
                key="delete"
                title="Do you want to delete product ?"
                onConfirm={() => deleteProduct(item._id)}
              >
                <DeleteOutlined className="text-rose-400!" />
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={item.title}
              description={
                <div className="flex gap-2">
                  <label>₹{priceCalculate(item.price, item.discount)}</label>
                  <del>₹{item.price}</del>
                  <label>{item.discount}% Off</label>
                </div>
              }
            />
            <Tag className="mt-5!" color="cyan">
              {item.quantity} PCS
            </Tag>
          </Card>
        ))}
      </div>

      <div className="flex justify-end w-full">
        <Pagination
          total={products.total}
          onChange={onPaginate}
          current={page}
          pageSizeOptions={[16, 32, 64, 100]}
          defaultPageSize={limit}
        />
      </div>

      <Modal
        open={open}
        width={720}
        centered
        footer={null}
        onCancel={handleClose}
        mask={{ closable: false }}
      >
        <h1 className="text-lg font-medium">Add a new product</h1>
        <Divider />
        <Form
          layout="vertical"
          onFinish={editId ? saveProduct : createProduct}
          form={productForm}
        >
          <Form.Item
            label="Product name"
            name="title"
            rules={[{ required: true }]}
          >
            <Input size="large" placeholder="Enter product name" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber
                size="large"
                placeholder="00.00"
                className="w-full!"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber size="large" placeholder="20" className="w-full!" />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber size="large" placeholder="20" className="w-full!" />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            rules={[{ required: true }]}
            name="description"
          >
            <Input.TextArea rows={5} placeholder="Description" />
          </Form.Item>

          {!editId && (
            <Form.Item
              name="image"
              label="Product Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload beforeUpload={() => false}>
                <Button size="large">Upload</Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item>
            {editId ? (
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                danger
                icon={<SaveOutlined />}
              >
                Save changes
              </Button>
            ) : (
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                icon={<ArrowRightOutlined />}
              >
                Add now
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
