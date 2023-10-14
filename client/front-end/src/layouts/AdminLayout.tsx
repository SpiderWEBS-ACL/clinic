import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  FileOutlined,
  UserOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const id = localStorage.getItem("id");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload;
  };
  const items = [
    {
      label: "Home",
      key: "/admin/",
      icon: <HomeOutlined />,
    },
    {
      label: "Admin",
      icon: <UserOutlined />,
      key: "parent1",
      children: [
        { label: "Admins", key: "/admin/Admins" },
        { label: "Add Admin", key: "/admin/add" },
      ],
    },
    {
      label: "Patients",
      key: "/admin/Patients",
      icon: <UserOutlined />,
    },
    {
      label: "Doctor",
      icon: <UserOutlined />,
      key: "parent",
      children: [
        {
          label: "Doctors",
          key: "/admin/Doctors",
        },
        {
          label: "Registration Reqs",
          key: "/admin/registrationRequests",
        },
      ],
    },
    {
      label: "Health Package",
      key: "/admin/Packages",
      icon: <FileOutlined />,
      children: [
        {
          label: "HealthPackages",
          key: "/admin/Packages",
        },
        {
          label: "Add Package",
          key: "/admin/addPackage",
        },
      ],
    },
    {
      label: "Logout",
      key: "/",
      icon: <PoweroffOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          onClick={({ key }) => {
            if (key === "/") {
              //TODO signout feature here
              localStorage.clear();
              navigate(key);
              window.location.reload();
            }
            navigate(key);
          }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        ></Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <AppRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
