"use client";
import dataInterface from "@/interfaces/data.interface";
import priceCalculate from "@/lib/price-calculate";
import { Card, Empty } from "antd";
import Image from "next/image";
import { FC } from "react";
import Pay from "./shared/Pay";
import { useRouter } from "next/navigation";

const Slug: FC<dataInterface> = ({ data }) => {
  const router = useRouter();
  if (!data) return <Empty />;

  return (
    <div>
      <Card className="shadow-lg">
        <div className="flex gap-12">
          <Image
            src={data.image}
            width={240}
            height={400}
            alt={data.title}
            className="rounded-lg object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold">{data.title}</h1>
            <p className="text-slate-500 mt-2">{data.description}</p>
            <div className="text-xl font-medium flex gap-4 my-5">
              <h1>₹{priceCalculate(data.price, data.discount)}</h1>
              <del className="text-slate-400">₹{data.price}</del>
              <h1 className="text-rose-500">({data.discount}% discount)</h1>
            </div>

            <div className="w-50">
              <Pay
                product={data}
                title="Buy now"
                onSuccess={() => router.push("/user/orders")}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Slug;
