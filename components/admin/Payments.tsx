"use client";

import fetcher from "@/lib/fetcher";
import { Avatar, Skeleton, Table, Tag, TableColumnsType } from "antd";
import moment from "moment";
import useSWR from "swr";

interface User {
  fullname: string;
  email: string;
  mobile?: string | number;
  address?: string;
}

interface PaymentInterface {
  _id: string;
  user: User;
  paymentId: string;
  vendor: string;
  amount: number;
  fee?: number;
  tax?: number;
  method: string;
  status: string;
  createdAt: string;
  orderId: string;
}

const Payments = () => {
  const { data, error, isLoading } = useSWR<PaymentInterface[]>(
    "/api/payment",
    fetcher,
  );

  if (isLoading) return <Skeleton active />;

  if (error) {
    return <h1 className="text-rose-500">{error.message}</h1>;
  }

  const columns: TableColumnsType<PaymentInterface> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, item) => (
        <div className="flex gap-3">
          <Avatar size="large" className="bg-orange-500! capitalize">
            {item.user.fullname[0]}
          </Avatar>

          <div className="flex flex-col">
            <h1 className="font-medium capitalize">{item.user.fullname}</h1>

            <label className="text-gray-500">{item.user.email}</label>
          </div>
        </div>
      ),
    },

    {
      title: "Order ID",
      key: "orderId",
      dataIndex: "orderId",
    },

    {
      title: "Payment ID",
      key: "paymentId",
      dataIndex: "paymentId",
    },

    {
      title: "Amount",
      key: "amount",
      render: (_, item) => <label>₹{item.amount.toLocaleString()}</label>,
    },

    {
      title: "Fee",
      key: "fee",
      render: (_, item) => (item.fee ? <label>₹{item.fee}</label> : 0),
    },

    {
      title: "Tax",
      key: "tax",
      render: (_, item) => (item.tax ? <label>₹{item.tax}</label> : 0),
    },

    {
      title: "Date",
      key: "date",
      render: (_, item) =>
        moment(item.createdAt).format("MMM DD, YYYY hh:mm A"),
    },

    {
      title: "Method",
      key: "method",
      render: (_, item) => (
        <Tag className="uppercase" color="cyan-inverse">
          {item.method}
        </Tag>
      ),
    },

    {
      title: "Status",
      key: "status",
      render: (_, item) => (
        <>
          {item.status === "captured" ? (
            <Tag className="uppercase" color="green">
              {item.status}
            </Tag>
          ) : (
            <Tag className="uppercase" color="magenta">
              {item.status}
            </Tag>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Payments;
