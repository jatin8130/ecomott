"use client";
import ChildrenInterface from "@/interfaces/children.interface";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FC } from "react";
import Logo from "./shared/Logo";
import Link from "next/link";
import {
  LoginOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { Avatar, Badge, Dropdown, Tooltip } from "antd";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const menus = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Carts",
    href: "/carts",
  },
];

const Layout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();
  const session = useSession();
  const { data } = useSWR(
    session?.data?.user.role === "user" ? "/api/cart?count=true" : null,
    session?.data?.user.role === "user" ? fetcher : null,
  );

  const UserMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: (
          <Link href="/user/order" className="capitalize">
            {session && session.data?.user.name}
          </Link>
        ),
        key: "fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <Link href="/user/setting">Settings</Link>,
        key: "setting",
      },
      {
        icon: <LoginOutlined />,
        label: <a onClick={() => signOut()}>Logout</a>,
        key: "logout",
      },
    ],
  };

  const AdminMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: (
          <Link href="/user/order" className="capitalize">
            {session && session.data?.user.name}
          </Link>
        ),
        key: "fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <Link href="/user/setting">Settings</Link>,
        key: "setting",
      },
      {
        icon: <LoginOutlined />,
        label: <a onClick={() => signOut()}>Logout</a>,
        key: "logout",
      },
    ],
  };

  const blacklist = ["/admin", "/login", "/signup", "/user"];

  const isBlackList = blacklist.some((path) => pathname.startsWith(path));

  const getMenu = (role: string) => {
    if (role === "user") return UserMenu;

    if (role === "admin") return AdminMenu;

    signOut();
  };

  if (isBlackList) return <AntdRegistry>{children}</AntdRegistry>;

  return (
    <AntdRegistry>
      <nav className="bg-white shadow-lg px-10 z-20 sticky top-0 left-0 flex justify-between items-center">
        <Logo />

        <div className="flex gap-4 items-center">
          {menus.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="py-2 px-6 rounded-lg hover:bg-blue-500 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {!session.data && (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="py-2 px-6 rounded-lg hover:bg-blue-500 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="py-2 px-6 rounded-lg hover:bg-blue-700 bg-blue-500 font-medium  text-white flex gap-2"
              >
                <UserAddOutlined />
                Sign up
              </Link>
            </div>
          )}
        </div>

        {session.data && (
          <div className="flex items-center gap-8">
            {session.data.user.role === "user" && (
              <Tooltip title="Your Carts">
                <Link href="/user/carts">
                  <Badge count={data && data.count}>
                    <ShoppingCartOutlined className="text-3xl text-slate-400" />
                  </Badge>
                </Link>
              </Tooltip>
            )}
            <Dropdown menu={getMenu(session.data.user.role || "")}>
              <Avatar size="large" src="/images/avt.jpg" />
            </Dropdown>
          </div>
        )}
      </nav>

      <div className="w-8/12 mx-auto py-24">{children}</div>

      <footer className="bg-zinc-900 h-112 flex items-center justify-center text-white text-4xl">
        <h1>My Footer</h1>
      </footer>
    </AntdRegistry>
  );
};

export default Layout;
