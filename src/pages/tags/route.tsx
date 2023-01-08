import { CarryOutOutlined } from "@ant-design/icons";
import { lazy } from "react";

const route = {
  path: "/tag",
  label: "Tag",
  icon: <CarryOutOutlined />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
