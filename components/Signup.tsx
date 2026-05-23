"use client";

import Link from "next/link";
import { Button, Card, Form, Input, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface SignupFormValues {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onSignup = async (values: SignupFormValues) => {
    try {
      await axios.post("/api/user/signup", values);
      message.success("You register successfully !");
      router.push("/login");
    } catch (err) {
      clientCatchError(err);
    }
  };

  return (
    <div className="h-screen overflow-hidden relative flex items-center justify-center bg-linear-to-br from-[#dbeafe] via-white to-[#ede9fe] px-4">
      {/* Background Blur Effects */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-25 -right-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-30" />

      {/* Card */}
      <Card
        className="w-full max-w-md border-0 rounded-4xl backdrop-blur-xl bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.12)] z-10"
        styles={{
          body: {
            padding: "36px 32px",
          },
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
            <UserOutlined className="text-white! text-3xl!" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-7">
          <Title level={2} className="mb-1! font-bold! text-gray-800!">
            Create Account
          </Title>

          <Text className="text-gray-500 text-base">
            Join us and start your journey today ✨
          </Text>
        </div>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={onSignup} size="large">
          {/* Name */}
          <Form.Item
            name="fullname"
            rules={[
              {
                required: true,
                message: "Please enter your full name",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Full Name"
              className="h-12 rounded-2xl border-gray-200 hover:border-blue-400"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Enter a valid email",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email Address"
              className="h-12 rounded-2xl border-gray-200 hover:border-blue-400"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="h-12 rounded-2xl border-gray-200 hover:border-blue-400"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm Password"
              className="h-12 rounded-2xl border-gray-200 hover:border-blue-400"
            />
          </Form.Item>

          {/* Button */}
          <Form.Item className="mb-4 mt-2">
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<ArrowRightOutlined />}
              className="h-12 rounded-2xl text-base font-semibold bg-linear-to-r from-blue-500 to-indigo-500 border-0 shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider className="my-5!">
          <Text className="text-gray-400 text-sm">Secure Registration</Text>
        </Divider>

        {/* Footer */}
        <div className="text-center">
          <Text className="text-gray-500">Already have an account? </Text>

          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
