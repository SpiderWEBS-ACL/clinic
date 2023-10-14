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
const id = localStorage.getItem("id");
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
      label: "My Appointments",
      key: "/appointment/view/" + id,
      icon: <UserOutlined />,
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
      label: "Doctors",
      icon: <UserOutlined />,
      key: "/patient/viewalldoctors",
    },
    {
      label: "Prescriptions",
      key: "/patient/viewPrescriptions/" + id, //TODO: add prescriptions route
      icon: <FileOutlined />,
    },
    {
      label: "Logout",
      key: "/",
      onclick: localStorage.clear(),
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
