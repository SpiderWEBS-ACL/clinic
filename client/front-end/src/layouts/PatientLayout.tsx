import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatButton, Layout, Menu } from "antd";
import {
  HomeOutlined,
  FileOutlined,
  UserOutlined,
  PoweroffOutlined,
  WalletOutlined,
  CalendarOutlined,
  CommentOutlined,
  VideoCameraOutlined,
  BellOutlined,
  BoxPlotOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import AppRouter from "../AppRouter";
import { IoPeopleOutline } from "react-icons/io5";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";
import { saveVideoSocketId } from "../apis/Patient/Video Chat/SaveVideoSocketId";

export const socket: Socket = io("http://localhost:8000", {
  auth: {
    token: Cookies.get("accessToken"),
  },
});
const { Header, Content, Footer, Sider } = Layout;
const id = localStorage.getItem("id");
const PatientLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [VideoCount, setVideoCount] = useState(0);
  const [MessageCount, setMessageCount] = useState(0);
  const [AuthorId, setAuthorId] = useState("");

  useEffect(() => {
    socket.emit("me");
    socket.on("me", (id: string) => {
      localStorage.setItem("socketId", id);
      saveVideoSocketId(id);
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
      key: "DoctorsParent",
      children: [
        {
          label: "All Doctors",
          key: "/patient/viewalldoctors",
        },
        {
          label: "My Doctors",
          key: "/patient/myDoctors",
        },
      ],
    },
    {
      label: "Health Records",
      icon: <FileOutlined />,
      key: "/patient/viewhealthrecords",
    },
    {
      label: "Prescriptions",
      key: "/patient/viewPrescriptions",
      icon: <FileOutlined />,
    },
    {
      label: "Packages",
      key: "/patient/packages",
      icon: <MedicineBoxOutlined />,
    },
    {
      label: "Wallet",
      key: "/patient/wallet",
      icon: <WalletOutlined />,
    },
    // {
    //   label: "Settings",
    //   key: "/patient/settings",
    //   icon: <SettingOutlined />,
    // },
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
              if (MessageCount > 0) navigate("/patient/chat/" + AuthorId);
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
              if (VideoCount > 0) navigate("/patient/videoChat");
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

export default PatientLayout;
