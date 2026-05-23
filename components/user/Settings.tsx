"use client";

import React, { useEffect } from "react";
import { Button, Divider, Form, Input, InputNumber, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
}

interface FormValues extends Address {
  fullname: string;
}

const Settings = () => {
  const [userForm] = Form.useForm<FormValues>();
  const session = useSession();

  useEffect(() => {
    const msg = sessionStorage.getItem("message");

    if (msg) {
      message.warning(msg);
      sessionStorage.removeItem("message");
    }
  }, []);

  useEffect(() => {
    if (session.data?.user) {
      const user = session.data.user;

      userForm.setFieldsValue({
        fullname: user.name || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
        pincode: user.address?.pincode || 0,
      });
    }
  }, [session.data, userForm]);

  const saveChanges = async (values: FormValues) => {
    try {
      const payload = {
        fullname: values.fullname,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode,
        },
      };

      await axios.put("/api/user/profile", payload);

      await session.update();

      message.success("Profile info saved !");
    } catch (err) {
      clientCatchError(err);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-medium">Profile Information</h1>

      <Divider />

      <div>
        <Form layout="vertical" form={userForm} onFinish={saveChanges}>
          <div className="grid grid-cols-3 gap-8">
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Street address"
              name="street"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <Form.Item label="State" name="state" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[{ required: true }]}
            >
              <InputNumber size="large" className="w-full!" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              danger
              icon={<SaveOutlined />}
            >
              Save now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
