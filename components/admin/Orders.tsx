"use client";

import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher";
import priceCalculate from "@/lib/price-calculate";
import { Avatar, Card, message, Select, Skeleton, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import useSWR, { mutate } from "swr";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
}

interface UserInterface {
  fullname: string;
  email: string;
  mobile?: string | number;
  address?: Address;
}

interface Product {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  discount: number;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  user: UserInterface;
  products: Product[];
  prices: number[];
  discounts: number[];
  quantities: number[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const Orders = () => {
  const { data, error, isLoading } = useSWR<Order[]>("/api/order", fetcher);

  if (isLoading) return <Skeleton active />;

  if (error)
    return <h1 className="text-rose-500 font-medium">{error.message}</h1>;

  const changeStatus = async (value: string, id: string) => {
    try {
      await axios.put(`/api/order/${id}`, { status: value });

      message.success(`Product status changed to ${value}`);

      mutate("/api/order");
    } catch (err) {
      clientCatchError(err);
    }
  };

  const getTotalSales = (item: Order) => {
    let sum = 0;

    for (let i = 0; i < item.prices.length; i++) {
      const price = item.prices[i];
      const discount = item.discounts[i];
      const qnt = item.quantities[i];

      const total = priceCalculate(price, discount) * qnt;

      sum = sum + total;
    }

    return <label>₹{sum.toLocaleString()}</label>;
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      key: "orderId",
      dataIndex: "orderId",
    },

    {
      title: "Customer",
      key: "customer",

      render: (item: Order) => (
        <div className="flex gap-3">
          <Avatar size="large" className="bg-orange-500!">
            {item.user.fullname[0].toUpperCase()}
          </Avatar>

          <div className="flex flex-col">
            <h1 className="font-medium capitalize">{item.user.fullname}</h1>

            <label className="text-gray-500 text-xs">{item.user.email}</label>
          </div>
        </div>
      ),
    },

    {
      title: "Total sales",
      key: "totalSales",
      render: getTotalSales,
    },

    {
      title: "Total products",
      key: "totalProducts",
      render: (item: Order) => item.products.length,
    },

    {
      title: "Address",
      key: "address",

      render: (item: Order) => {
        const address = item.user.address;

        return (
          <div>
            {address?.pincode ? (
              <div>
                {address.street}, {address.city}, {address.state},{" "}
                {address.country} {address.pincode}
              </div>
            ) : (
              "Address not found"
            )}
          </div>
        );
      },
    },

    {
      title: "Status",
      key: "status",

      render: (item: Order) =>
        item.status === "processing" ? (
          <Select
            style={{ width: 150 }}
            defaultValue={item.status}
            onChange={(status) => changeStatus(status, item._id)}
            options={[
              {
                value: "processing",
                label: "Processing",
              },
              {
                value: "dispatched",
                label: "Dispatched",
              },
              {
                value: "returned",
                label: "Returned",
              },
            ]}
          />
        ) : (
          <Tag
            color={
              item.status === "dispatched" ? "green-inverse" : "magenta-inverse"
            }
            className="capitalize"
          >
            {item.status}
          </Tag>
        ),
    },

    {
      title: "Created",
      key: "created",

      render: (item: Order) =>
        moment(item.createdAt).format("MMM DD, YYYY hh:mm  A"),
    },
  ];

  const browseProducts = (item: Order) => {
    return (
      <div className="grid grid-cols-4 gap-8">
        {item.products.map((p: Product, pIndex: number) => (
          <Card
            key={p._id}
            cover={
              <div className="w-full h-37.5 relative">
                <Image
                  src={p.image || ""}
                  fill
                  alt={p.title || "product"}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            }
          >
            <Card.Meta
              className="capitalize"
              title={p.title}
              description={
                <div className="flex gap-2 flex-wrap">
                  <label>
                    ₹
                    {priceCalculate(
                      item.prices[pIndex],
                      item.discounts[pIndex],
                    )}
                  </label>

                  <del>₹{item.prices[pIndex]}</del>

                  <label>({item.discounts[pIndex]}% Off)</label>

                  <label>{item.quantities[pIndex]} PCS</label>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Table<Order>
        columns={columns}
        dataSource={data}
        rowKey="_id"
        expandable={{
          expandedRowRender: browseProducts,
          rowExpandable: (record: Order) => record.products.length > 0,
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Orders;
