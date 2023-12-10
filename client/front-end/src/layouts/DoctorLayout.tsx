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
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";

const { Header, Content, Footer, Sider } = Layout;
const id = localStorage.getItem("id");
const DoctorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      key: "/doctor/Home",
      icon: <HomeOutlined />,
    },
    {
      label: "Patients",
      icon: <UserOutlined />,
      key: "parent1",
      children: [
        {
          label: "My Patients",
          key: "/doctor/viewPatients",
        },
      ],
    },
    {
      label: "Appointments",
      key: "/doctor/allAppointments",
      icon: <CalendarOutlined />,
    },
    {
      label: "Update Info",
      key: "/doctor/update",
      icon: <UserOutlined />,
    },
    {
      label: "Time Slots",
      key: "/doctor/timeSlots",
      icon: <ClockCircleOutlined />,
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
        <Content style={{ margin: "0 16px", overflow: "hidden" }}>
          <div style={{ overflowY: "auto", maxHeight: "100vh" }}>
            <AppRouter />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;
