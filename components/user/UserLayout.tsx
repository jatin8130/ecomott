"use client";
import ChildrenInterface from "@/interfaces/children.interface";
import {
  LogoutOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Card, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { FC } from "react";
import { getBreadCrumbs } from "../admin/AdminLayout";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const UserLayout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();
  const session = useSession();

  const logout = async () => {
    await signOut();
  };

  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/user/carts">Carts</Link>,
      key: "/user/carts",
    },
    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/user/orders">Orders</Link>,
      key: "/user/orders",
    },
    {
      icon: <SettingOutlined />,
      label: <Link href="/user/settings">Settings</Link>,
      key: "/user/settings",
    },
  ];

  return (
    <Layout className="h-screen overflow-hidden">
      {/* Sidebar */}
      <Sider
        width={300}
        theme="light"
        className="border-r border-gray-100 flex flex-col"
      >
        <div className="flex flex-col h-full">
          {/* Menu */}
          <div className="flex-1 overflow-y-auto pt-4">
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["carts"]}
              items={menus}
              selectedKeys={[pathname]}
              className="border-0"
            />
          </div>

          {/* User Profile */}
          {session.data && (
            <div className="p-4 bg-linear-to-r from-indigo-500 to-indigo-600">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-14! h-14! text-lg! font-semibold! bg-white! text-indigo-600!">
                  J
                </Avatar>

                <div>
                  <h1 className="text-white text-base font-semibold leading-5 capitalize">
                    {session.data.user.name}
                  </h1>

                  <p className="text-indigo-100 text-sm">
                    {session.data.user.email}
                  </p>
                </div>
              </div>

              <Button
                onClick={logout}
                icon={<LogoutOutlined />}
                size="large"
                block
                className="h-11 rounded-xl font-medium"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </Sider>

      {/* Main Content */}
      <Layout className="bg-gray-50 overflow-y-auto">
        <Breadcrumb items={getBreadCrumbs(pathname)} className="mt-6!" />
        <Card className="mt-6!">{children}</Card>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
