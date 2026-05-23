"use client";

import ChildrenInterface from "@/interfaces/children.interface";
import {
  CreditCardOutlined,
  LoginOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from "antd";
import Link from "next/link";
import React, { FC } from "react";
import Logo from "../shared/Logo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const { Sider, Content, Header } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const logout = async () => {
  await signOut();
};

const menus = [
  {
    icon: <ShoppingCartOutlined />,
    label: <Link href="/admin/products">Products</Link>,
    key: "products",
  },
  {
    icon: <ReconciliationOutlined />,
    label: <Link href="/admin/orders">Orders</Link>,
    key: "orders",
  },
  {
    icon: <CreditCardOutlined />,
    label: <Link href="/admin/payments">Payments</Link>,
    key: "payments",
  },
  {
    icon: <UserOutlined />,
    label: <Link href="/admin/users">Users</Link>,
    key: "users",
  },
];

const accountMenu = {
  items: [
    {
      icon: <ProfileOutlined />,
      label: <a>Jatin Mehra</a>,
      key: "fullname",
    },
    {
      icon: <LoginOutlined />,
      label: <a onClick={logout}>Logout</a>,
      key: "logout",
    },
  ],
};

export const getBreadCrumbs = (pathname: string) => {
  const arr = pathname.split("/");
  const bread = arr.map((item) => ({
    title: item,
  }));
  return bread;
};

const AdminLayout: FC<ChildrenInterface> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathname = usePathname();

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={menus}
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex items-center"
        >
          <div className="px-8 flex justify-between items-center w-full">
            <Logo />

            <div>
              <Dropdown menu={accountMenu}>
                <Avatar size="large" src="/images/avt.jpg" />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{ margin: "24px 16px 0", overflow: "initial" }}
          className="px-8 flex flex-col gap-8"
        >
          <Breadcrumb items={getBreadCrumbs(pathname)} />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
