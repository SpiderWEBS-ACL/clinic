import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { FloatButton, Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  PoweroffOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  CommentOutlined,
  BellOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";
import { socket } from "./PatientLayout";

const { Content, Sider } = Layout;
const id = localStorage.getItem("id");
const DoctorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [VideoCount, setVideoCount] = useState(0);
  const [MessageCount, setMessageCount] = useState(0);
  const [AuthorId, setAuthorId] = useState("");

  useEffect(() => {
    socket.emit("me");
    socket.on("me", (id: string) => {
      localStorage.setItem("socketId", id);
    });
  }, []);
  socket.on("callUser", (data: any) => {
    console.log("data from: ", data.from, "data.name: ", data.Name);
    setVideoCount(VideoCount + 1);
  });
  socket.on("direct-message", (data: any) => {
    console.log(data);
    setAuthorId(data.newMessage.author._id);
    setMessageCount(MessageCount + 1);
  });
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
          <FloatButton
            style={{
              right: "4vh",
              bottom: "94vh",
            }}
            icon={<BellOutlined />}
          />
          <FloatButton
            onClick={() => {
              if (MessageCount > 0) navigate("/doctor/chat/" + AuthorId);
              setMessageCount(0);
            }}
            style={{
              right: "12vh",
              bottom: "94vh",
            }}
            badge={{ count: MessageCount }}
            icon={<CommentOutlined />}
          />
          <FloatButton
            onClick={() => {
              if (VideoCount > 0) navigate("/doctor/videoChat"); //TODO:
              setVideoCount(0);
            }}
            style={{
              right: "18vh",
              bottom: "94vh",
            }}
            badge={{ count: VideoCount }}
            icon={<VideoCameraOutlined />}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;
