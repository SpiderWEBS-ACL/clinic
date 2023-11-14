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
  WalletOutlined,
  CalendarOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";
import {
  IoPeople,
  IoPeopleCircleOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const { Header, Content, Footer, Sider } = Layout;
const id = localStorage.getItem("id");
const PatientLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      key: "/patient/Home",
      icon: <HomeOutlined />,
    },
    {
      label: "Appointments",
      key: "/patient/allAppointments",
      icon: <CalendarOutlined />,
    },
    {
      label: "Family",
      icon: <IoPeopleOutline />,
      key: "parent1",
      children: [
        {
          label: "Family Members",
          key: "/patient/viewfamilyMembers",
        },
        { label: "Add Family Member", key: "/patient/addFamilyMember" },
      ],
    },
    {
      label: "Doctors",
      icon: <UserOutlined />,
      key: "/patient/viewalldoctors",
    },
    {
      label: "Prescriptions",
      key: "/patient/viewPrescriptions",
      icon: <FileOutlined />,
    },
    {
      label: "Packages",
      key: "/patient/packages",
      icon: <FileOutlined />,
    },
    {
      label: "Wallet",
      key: "/patient/wallet",
      icon: <WalletOutlined />,
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
        theme="light"
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
          theme="light"
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
