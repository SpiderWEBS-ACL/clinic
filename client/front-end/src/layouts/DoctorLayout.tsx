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
const id = "6526d0fefd3682ea939a2471";
const PatientLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      key: "/doctor/Home/" + id,
      icon: <HomeOutlined />,
    },
    {
      label: "Patients",
      icon: <UserOutlined />,
      key: "parent1",
      children: [
        {
          label: "View Patients",
          key: "/doctor/viewPatients/" + id,
        },
      ],
    },
    {
      label: "Edit my info",
      key: "/doctor/update/" + id,
      icon: <UserOutlined />,
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
            if (key === "signout") {
              //TODO signout feature here
            } else {
              navigate(key);
            }
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

export default PatientLayout;
