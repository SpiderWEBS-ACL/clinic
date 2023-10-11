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
const id = "652590b962e3b13a6c7834bf";
const PatientLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      key: "/patient/patientHome/" + id,
      icon: <HomeOutlined />,
    },
    {
      label: "Family",
      icon: <UserOutlined />,
      key: "parent1",
      children: [
        {
          label: "Family Members",
          key: "/patient/viewfamilyMembers/" + id,
        },
        { label: "Add Family Member", key: "/patient/addFamilyMember/" + id },
      ],
    },
    {
      label: "Patients",
      key: "/admin/Patients",
      icon: <UserOutlined />,
    },
    {
      label: "Doctors",
      icon: <UserOutlined />,
      key: "/patient/viewalldoctors",
    },
    {
      label: "Prescriptions",
      key: "/admin/Packages", //TODO: add prescriptions route
      icon: <FileOutlined />,
    },
    {
      label: "Logout",
      key: "/admin/logout",
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
