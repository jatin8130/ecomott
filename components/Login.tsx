"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { getSession, signIn } from "next-auth/react";
import clientCatchError from "@/lib/client-catch-error";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const loginData = { ...values };

      delete loginData.remember;

      const payload = {
        ...loginData,
        redirect: false,
      };
      await signIn("credentials", payload);
      const session = await getSession();

      if (!session) throw new Error("Failed to login user");

      if (session.user.role === "user") return router.replace("/user/orders");

      if (session.user.role === "admin") return router.replace("/admin/orders");

      message.success("Login successfully !");
    } catch (error) {
      clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    try {
      const payload = {
        redirect: true,
        callbackUrl: "/",
      };
      await signIn("google", payload);
    } catch (err) {
      clientCatchError(err);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-white to-violet-100 px-4 py-10">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-300/30 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-violet-300/30 blur-3xl" />
      </div>

      {/* Login Card */}
      <Card
        className="relative z-10 w-full max-w-md rounded-4xl border-0 bg-white/80 shadow-2xl backdrop-blur-xl"
        styles={{
          body: {
            padding: "36px 32px",
          },
        }}
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-200">
            <LoginOutlined className="text-3xl text-white!" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <Title level={2} className="mb-2! text-gray-800!">
            Welcome Back
          </Title>

          <Text className="text-base text-gray-500">
            Login to continue your journey ✨
          </Text>
        </div>

        {/* Google Login */}
        <Button
          block
          size="large"
          icon={<GoogleOutlined />}
          onClick={onGoogleLogin}
          className="mb-3 h-12 rounded-2xl border border-gray-200 bg-white font-medium shadow-sm hover:border-rose-600! hover:text-rose-600!"
        >
          Continue with Google
        </Button>

        <Divider className="my-5!">
          <Text className="text-xs uppercase tracking-wide text-gray-400">
            Or continue with email
          </Text>
        </Divider>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onLogin}
          size="large"
          initialValues={{
            remember: true,
          }}
        >
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

          {/* Remember & Forgot */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <Form.Item
              name="remember"
              valuePropName="checked"
              className="mb-0!"
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-indigo-600"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Form.Item className="mb-4!">
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              block
              icon={<LoginOutlined />}
              className="h-12 rounded-2xl border-0 bg-linear-to-r from-blue-500 to-indigo-500 text-base font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-[1.01]"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Text className="text-gray-500">Don&apos;t have an account?</Text>{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 transition-colors hover:text-indigo-600"
          >
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
