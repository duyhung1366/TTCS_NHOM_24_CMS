import { CommentOutlined } from "@ant-design/icons";
import { lazy } from "react";

const route = {
  path: "/feedback",
  label: "Phản hồi",
  icon: <CommentOutlined />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
