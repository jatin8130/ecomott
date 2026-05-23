"use client";

import { Card, Divider, Empty, Skeleton, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";
import Image from "next/image";

import fetcher from "@/lib/fetcher";
import ErrorMessage from "../shared/ErrorMessage";
import priceCalculate from "@/lib/price-calculate";

interface ProductInterface {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  slug?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderInterface {
  _id: string;
  orderId: string;
  products: ProductInterface[];
  prices: number[];
  discounts: number[];
  quantities: number[];
  grossTotal: number;
  status: "processing" | "dispatched" | "returned";
  createdAt: string;
  updatedAt: string;
}

const Orders = () => {
  const { data, isLoading, error } = useSWR<OrderInterface[]>(
    "/api/order",
    fetcher,
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (data?.length === 0) return <Empty description="No order found !" />;

  const getStatusColor = (status: string) => {
    if (status === "processing") {
      return "#2db7f5";
    }

    if (status === "dispatched") {
      return "#87d068";
    }

    if (status === "returned") {
      return "#f50";
    }

    return "#2db7f5";
  };

  return (
    <div className="flex flex-col gap-12">
      {data?.map((item, index) => (
        <Card
          key={index}
          title={item.orderId}
          extra={
            <label className="text-gray-500">
              {moment(item.createdAt).format("MMM DD, YYYY hh:mm A")}
            </label>
          }
        >
          <div className="flex flex-col gap-8">
            {item.products.map((product, pIndex) => (
              <Card key={pIndex} hoverable>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <Image
                      src={product.image}
                      width={150}
                      height={90}
                      alt={product.title}
                      className="object-cover"
                    />

                    <div>
                      <h1 className="text-lg font-medium capitalize">
                        {product.title}
                      </h1>

                      <div className="mb-2 flex items-center gap-3">
                        <label className="text-base font-medium">
                          ₹
                          {priceCalculate(
                            item.prices[pIndex],
                            item.discounts[pIndex],
                          )}
                        </label>

                        <del className="text-gray-500">
                          ₹{item.prices[pIndex]}
                        </del>

                        <label>({item.discounts[pIndex]}% Off)</label>

                        <label className="font-medium text-gray-500">
                          {item.quantities[pIndex]} PCS
                        </label>
                      </div>

                      <Tag color={getStatusColor(item.status)}>
                        {item.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Divider />

          <h1 className="text-3xl font-bold">
            Total : ₹{item.grossTotal.toLocaleString()}
          </h1>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
