"use client";
import dataInterface from "@/interfaces/data.interface";
import { FC } from "react";
import { FetchedProductInterface } from "./admin/Products";
import { Button, Card, message } from "antd";
import Image from "next/image";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import priceCalculate from "@/lib/price-calculate";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const Products: FC<dataInterface> = ({ data }) => {
  const router = useRouter();

  const addToCart = async (id: string) => {
    try {
      const session = await getSession();
      if (!session) return router.push("/login");

      await axios.post("/api/cart", { product: id });
      mutate("/api/cart?count=true");
      message.success("Product added to cart !");
    } catch (err) {
      clientCatchError(err, "you are admin please switch to your user account");
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
      {data.data.map((item: FetchedProductInterface, index: number) => (
        <Card
          key={index}
          hoverable
          cover={
            <div className="relative w-full h-45">
              <Image
                src={item.image}
                fill
                alt={item.title}
                priority={index === 0}
                style={{ objectFit: "cover" }}
                className="rounded-t-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          }
        >
          <Card.Meta
            title={
              <Link
                href={`/products/${item.title.toLowerCase().split(" ").join("-")}`}
                className="text-inherit! hover:underline!"
              >
                {item.title}
              </Link>
            }
            description={
              <div className="flex gap-2">
                <label>₹{priceCalculate(item.price, item.discount)}</label>
                <del>₹{item.price}</del>
                <label>{item.discount}% Off</label>
              </div>
            }
          />

          <div className="space-y-2 mt-5">
            <Button
              key="cart"
              icon={<ShoppingCartOutlined />}
              type="primary"
              className="w-full"
              onClick={() => addToCart(item._id)}
            >
              Add tio cart
            </Button>
            <Link
              href={`/products/${item.title.toLowerCase().split(" ").join("-")}`}
            >
              <Button key="buy" type="primary" danger className="w-full">
                Buy now
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Products;
