"use client";
import fetcher from "@/lib/fetcher";
import { Button, Card, Empty, Skeleton, Space } from "antd";
import useSWR, { mutate } from "swr";
import ErrorMessage from "../shared/ErrorMessage";
import Image from "next/image";
import priceCalculate from "@/lib/price-calculate";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { FetchedProductInterface } from "../admin/Products";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";
import { useState } from "react";
import Pay from "../shared/Pay";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartInterface {
  _id: string;
  user: string;
  product: FetchedProductInterface;
  qnt: number;
  createdAt: string;
  updatedAt: string;
}

const Carts = () => {
  const { data, error, isLoading } = useSWR("/api/cart", fetcher);
  const [loading, setLoading] = useState({
    state: false,
    index: 0,
    buttonIndex: 0,
  });
  const router = useRouter();

  if (isLoading) return <Skeleton active />;

  if (error) return <ErrorMessage />;

  const updateQnt = async (
    num: number,
    id: string,
    index: number,
    buttonIndex: number,
  ) => {
    try {
      setLoading({ state: true, index, buttonIndex });
      await axios.put(`/api/cart/${id}`, { qnt: num });
      mutate("/api/cart");
    } catch (err) {
      clientCatchError(err);
    } finally {
      setLoading({
        state: false,
        index: 0,
        buttonIndex: 0,
      });
    }
  };

  const removeCart = async (id: string, index: number, buttonIndex: number) => {
    try {
      setLoading({ state: true, index, buttonIndex });
      await axios.delete(`/api/cart/${id}`);
      mutate("/api/cart");
    } catch (err) {
      clientCatchError(err);
    } finally {
      setLoading({
        state: false,
        index: 0,
        buttonIndex: 0,
      });
    }
  };

  const getTotalAmount = () => {
    let sum = 0;
    for (const item of data) {
      const amount =
        priceCalculate(item.product.price, item.product.discount) * item.qnt;
      sum = sum + amount;
    }
    return sum;
  };

  if (data.length === 0)
    return (
      <div className="flex flex-col items-center gap-4">
        <Empty description="Your cart is empty" />
        <Link href="/">
          <Button type="primary" icon={<ShopOutlined />} size="large">
            Shop now
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="space-y-12">
      {data.map((item: CartInterface, index: number) => {
        <Card key={index} hoverable>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <Image
                src={item.product.image}
                width={150}
                height={90}
                alt={item.product.title}
              />
              <div>
                <h1 className="text-lg font-medium capitalize">
                  {item.product.title}
                </h1>
                <div>
                  <label className="font-medium text-base">
                    ₹{priceCalculate(item.product.price, item.product.discount)}
                  </label>
                  <del className="text-gray-500">₹{item.product.price}</del>
                  <label>({item.product.discount}%Off)</label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Space.Compact block>
                <Button
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 0
                  }
                  icon={<MinusOutlined />}
                  size="large"
                  onClick={() => updateQnt(item.qnt - 1, item._id, index, 0)}
                />
                <Button size="large">{item.qnt}</Button>
                <Button
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 1
                  }
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => updateQnt(item.qnt + 1, item._id, index, 1)}
                />
                <Button
                  className="ml-2"
                  type="primary"
                  danger
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 1
                  }
                  icon={<DeleteOutlined />}
                  size="large"
                  onClick={() => removeCart(item._id, index, 2)}
                />
              </Space.Compact>
            </div>
          </div>
        </Card>;
      })}

      <div className="flex justify-end items-center gap-6">
        <h1 className="text-2xl font-semibold">
          Total payable amount - ₹{getTotalAmount().toLocaleString()}
        </h1>

        <div className="w-75">
          <Pay
            product={data}
            title="Buy now"
            onSuccess={() => router.push("/user/orders")}
          />
        </div>
      </div>
    </div>
  );
};

export default Carts;
