import React, { useState } from "react";
import {
  HomeOutlined,
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import AppRouter from "./AppRouter";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Home", "Home", <HomeOutlined />),
  getItem("Admin", "Admin", <UserOutlined />, [
    getItem("All Admins", "AllAdmin"),
    getItem("Add Admin", "AddAdmin"),
  ]),
  getItem("Doctor", "Doctors", <UserOutlined />),
  getItem("Patient", "Patients", <UserOutlined />),
  getItem("Health Packages", "Health Packages", <FileOutlined />, [
    getItem("All Packages", "AllPackages"),
    getItem("Add Package", "AddPackage"),
  ]),
  getItem("logout", "LogOut", <LogoutOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <AppRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
