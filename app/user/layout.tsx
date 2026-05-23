import UserLayout from "@/components/user/UserLayout";
import ChildrenInterface from "@/interfaces/children.interface";
import { FC } from "react";

const UserLayoutRouter: FC<ChildrenInterface> = async ({ children }) => {
  return <UserLayout>{children}</UserLayout>;
};

export default UserLayoutRouter;
