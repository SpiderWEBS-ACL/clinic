import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import "./StyleDoctor.css";
import { getDoctor } from "../../apis/Doctor/GetDoctor";
import {
  Avatar,
  Breadcrumb,
  Divider,
  Card,
  Col,
  Layout,
  List,
  Modal,
  Row,
  Spin,
  Typography,
  Table,
  Button,
  Space,
  Tag,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { differenceInYears } from "date-fns";
import { Content } from "antd/es/layout/layout";
import { filterAppointmentsDoctor } from "../../apis/Doctor/Appointments/FilterAppointmentsDoctor";
const { Title } = Typography;
const DoctorHome = () => {
  const { id } = useParams<{ id: string }>();
  const [doctorInfo, setDoctorInfo] = useState<any>({});
  const [loadingCard, setLoadingCard] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const fetchDoctor = async () => {
    await getDoctor()
      .then((response) => {
        setDoctorInfo(response.data);
        localStorage.setItem("DoctorName", response.data.Name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    try {
      const response = await filterAppointmentsDoctor("Upcoming", "");
      setAppointments(response.data);
    } catch (error: any) {
      if (error.response.data.error == "No appointments were found")
        setAppointments([]);
    }

    setLoading(false);
    setLoadingCard(false);
  };
  useEffect(() => {
    fetchDoctor();
    localStorage.setItem("Name", doctorInfo.Name);
  }, [id]);

  const navigate = useNavigate();

  if (loading) {
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

  const openModal = () => {
    setShowPopup(true);
  };
  const closeModal = () => {
    setShowPopup(false);
  };

  let dob = doctorInfo.Dob + "";
  let date = dob.split("T")[0];

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "Patient",
      key: "Patient",
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (AppointmentDate: any) => (
        <span>{new Date(AppointmentDate).toDateString()}</span>
      ),
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      render: (start: any) => <span>{start.split("T")[1].split(".")[0]}</span>,
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      render: (end: any) => <span>{end.split("T")[1].split(".")[0]}</span>,
    },
  ];

  return (
    <Layout style={{ maxHeight: "86vh" }}>
      <Layout className="site-layout">
        <Content style={{ margin: "0  16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Doctor</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          <Modal
            style={{ top: 10 }}
            open={showPopup}
            footer={null}
            onCancel={closeModal}
          >
            <Card title="My Details">
              <List>
                <List.Item>
                  <Title level={5}>Name: &nbsp;{doctorInfo.Name}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Username: &nbsp;{doctorInfo.Username}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Password: &nbsp;***********</Title>
                  <Button
                    danger
                    type="primary"
                    onClick={() => {
                      navigate("/doctor/changePassword");
                    }}
                  >
                    Change Password
                  </Button>
                </List.Item>
                <List.Item>
                  <Title level={5}>Date of birth: &nbsp;{date}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Email: &nbsp;{doctorInfo.Email}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    Affiliation: &nbsp;{doctorInfo.Affiliation}
                  </Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    EducationalBackground: &nbsp;
                    {doctorInfo.EducationalBackground}
                  </Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    HourlyRate: &nbsp;
                    {doctorInfo.HourlyRate}
                  </Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    Specialty: &nbsp;
                    {doctorInfo.Specialty}
                  </Title>
                </List.Item>
              </List>
            </Card>
          </Modal>

          <Row gutter={2} style={{ height: "80vh", minWidth: 800 }}>
            <Card
              hoverable
              title={"My Details"}
              loading={loadingCard}
              extra={
                <SettingOutlined
                  style={{ justifyContent: "right", width: 50, height: 50 }}
                  onClick={openModal}
                />
              }
              style={{ marginRight: "2rem", height: "100%", width: "20vw" }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  style={{ width: 200, height: 200 }}
                />
              </div>
              <Divider>
                <h3>
                  <b>Dr. {doctorInfo.Name}</b>
                </h3>{" "}
              </Divider>
              <Col>
                <Title style={{ textAlign: "center" }} level={4}>
                  <h4>
                    Affiliation: <h6>{doctorInfo.Affiliation}</h6>{" "}
                  </h4>
                </Title>
                <Title level={4}>{doctorInfo.Gender}</Title>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <Tag color="processing">Patients: </Tag>
                  <Tag color="processing">Appointments: </Tag>
                </Row>
              </Col>
            </Card>

            <Col md={30}>
              <Row style={{ height: " 13vh" }}>
                <Card
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    marginBottom: "2rem",
                  }}
                ></Card>
              </Row>

              <Row>
                <Card
                  hoverable
                  title="Upcoming Appointments"
                  loading={loadingCard}
                  style={{ height: "57vh" }}
                >
                  <Table
                    style={{ width: "55vw" }}
                    columns={columns}
                    dataSource={appointments}
                    size="middle"
                  />
                </Card>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorHome;
