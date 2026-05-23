"use client";
import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher";
import { Card, Select, Skeleton } from "antd";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import useSWR, { mutate } from "swr";

interface userInterface {
  fullname: string;
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const Users = () => {
  const { data, error, isLoading } = useSWR("/api/user", fetcher);

  const changeRole = async (role: string, userId: string) => {
    try {
      await axios.put(`/api/user/role/${userId}`, { role });
      mutate("/api/user");
    } catch (err) {
      clientCatchError(err);
    }
  };

  if (isLoading) return <Skeleton active className="lg:col-span-4" />;

  if (error)
    return <h1 className="text-rose-500 font-medium">{error.message}</h1>;

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {data.map((item: userInterface, index: number) => (
        <Card key={index} hoverable>
          <div className="flex flex-col justify-center items-center gap-4">
            <Image
              src="/images/avt.jpg"
              width={100}
              height={100}
              alt={`avt-${index}`}
              className="rounded-full object-cover"
            />
            <Card.Meta
              className="text-center"
              title={<label className="capitalize">{item.fullname}</label>}
              description={item.email}
            />
            <Select
              className="w-fit! text-center"
              defaultValue={item.role}
              size="large"
              onChange={(role: string) => changeRole(role, item._id)}
              options={[
                {
                  value: "user",
                  label: "User",
                },
                {
                  value: "admin",
                  label: "Admin",
                },
              ]}
            />
            <label className="text-gray-500 font-medium">
              {moment(item.createdAt).format("MMM DD, YYYY hh:mm A")}
            </label>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Users;
