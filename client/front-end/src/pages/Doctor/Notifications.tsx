import { Button, Card, Col, Modal, Row, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config, headers } from "../../Middleware/authMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";

const Notifications: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/doctor/notifications`, config)
      .then((response) => {
        setNotifications(response.data);
        console.log("RES:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const openNotification = async (id: any) => {


    api.put(`/doctor/openNotification/${id}`, config)
    .then((response) => {
        console.log("Notification Opened!");
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
      // Sort by date if both orders have the same status
      return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (loading) {
    //loading screen
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Your Notifications
        {/* <strong>Your Notifications</strong> */}
      </h2>

      {sortedNotifications.map((notification: any) => (
        <div key={notification._id}>
          <Card
            title={notification.title}
            style={{ textAlign: "left" , backgroundColor: notification.opened? "white": "#e3ecfa" }}
            onClick={() => {
              openNotification(notification._id);
              location.reload();
              navigate(`/doctor/allAppointments`);
            }}
            hoverable={true}
          >
           

            <Row>
              <Col span={18}>
              {notification.opened ? (
                notification.message
                ) : (
                <b> {notification.message}</b>
                )}
              </Col>
              <Col
                span={6}
                style={{
                  float: "right",
                  textAlign: "right",
                  verticalAlign: "middle",
                }}
              >
                {/* {notification.date} */}
               {moment.utc(notification.date).local().startOf('seconds').fromNow()}
              </Col>
            </Row>
          </Card>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
