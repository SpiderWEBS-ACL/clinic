import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Card,
  Typography,
  List,
  Row,
  Col,
  Spin,
  Modal,
  message,
  Switch,
} from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  InfoCircleTwoTone,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { format, differenceInYears } from "date-fns";
import "./StylePatient.css";
import moment from "moment";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const { Title } = Typography;

const PatientHome = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [loadingCard, setLoadingCard] = useState(true);
  const [patientInfo, setPatientInfo] = useState<any>({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [dateOf, setDateOf] = useState(String);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        Status: "Upcoming",
      },
    };
    api
      .get(`/patient/getPatient`, config)
      .then((response) => {
        setPatientInfo(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    api.get("/subscription/getSubscription", config).then((response) => {
     setDateOf(response.data.Date+"")
    });

    api.get("patient/showSubscribedPackage", config).then((response) => {
      if (response.data) setSubscription(response.data);
    });

    api
      .get(`appointment/filterAppointment`, config)
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error: any) => {});
    setLoading(false);
    setLoadingCard(false);
  }, [id]);

  var pron = "";
  if (patientInfo.Gender == "Male") pron = "Mr.";
  else if (patientInfo.Gender == "Male") pron = "Ms.";

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

  let dob = patientInfo.Dob + "";
  let date = dob.split("T")[0];

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const dob = new Date(birthDate);
    return differenceInYears(today, dob);
  };

  const appointmentsRedirect = () => {
    navigate("/patient/allAppointments", { replace: true });
  };
  const prescriptionsRedirect = () => {
    navigate("/patient/viewPrescriptions", { replace: true });
  };
  const subscriptionsRedirect = () => {
    navigate("/patient/packages", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          <Modal
            style={{ top: 25 }}
            open={showPopup}
            footer={null}
            onCancel={closeModal}
          >
            <Card title="My Details" style={{ marginBottom: 0 }}>
              <List>
                <List.Item>
                  <Title level={5}>Name: {patientInfo.Name}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Username: {patientInfo.Username}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Password: **********</Title>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => {
                      navigate("/patient/changePassword");
                    }}
                  >
                    Change Password
                  </button>
                </List.Item>
                <List.Item>
                  <Title level={5}>Date of birth: {date}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Gender: {patientInfo.Gender}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Mobile: {patientInfo.Mobile}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>Email: {patientInfo.Email}</Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    Emergency Contact Name: {patientInfo.EmergencyContactName}
                  </Title>
                </List.Item>
                <List.Item>
                  <Title level={5}>
                    Emergency Contact Mobile:{" "}
                    {patientInfo.EmergencyContactMobile}
                  </Title>
                </List.Item>
              </List>
            </Card>
          </Modal>

          <Row gutter={35}>
            <Col xs={30} sm={30} md={24} lg={30} xl={30}>
              <Card
                hoverable
                title="My Details"
                loading={loadingCard}
                extra={
                  <InfoCircleTwoTone
                    style={{ width: 50, height: 50 }}
                    onClick={openModal}
                  />
                }
                style={{ marginBottom: 16 }}
              >
                <Title level={4}>
                  Name: {pron}
                  {patientInfo.Name}
                </Title>
                <Title level={4}>Age: {calculateAge(patientInfo.Dob)}</Title>
                <Title level={4}>Gender {patientInfo.Gender}</Title>
              </Card>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col xs={9}>
              <Card
                hoverable
                title="Upcoming Appointments"
                loading={loadingCard}
                extra={
                  <InfoCircleTwoTone
                    style={{ width: 50, height: 50 }}
                    onClick={appointmentsRedirect}
                  />
                }
                style={{ marginBottom: 16 }}
              >
                <Row>
                  <Col>
                    <List
                      header={<Title level={4}>Doctor: </Title>}
                      dataSource={appointments}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>{item.Doctor.Name}</Title>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col style={{ marginLeft: 30 }}>
                    <List
                      header={<Title level={4}>Date: </Title>}
                      dataSource={appointments}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>
                            {item.AppointmentDate.split("T")[0]}
                          </Title>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col style={{ marginLeft: 30 }}>
                    <List
                      header={<Title level={4}>Time: </Title>}
                      dataSource={appointments}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>
                            {item.AppointmentDate.split("T")[1].split(".")[0]}
                          </Title>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={6}>
              <Card
                hoverable
                title="My Subscriptions"
                loading={loadingCard}
                extra={
                  <InfoCircleTwoTone
                    style={{ width: 50, height: 50 }}
                    onClick={subscriptionsRedirect}
                  />
                }
                style={{ marginBottom: 16 }}
              >
                <Row>
                  <Col>
                    <List
                      header={<Title level={4}>Name: </Title>}
                      dataSource={subscription}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>{item.Name}</Title>
                        </List.Item>
                      )}
                    />
                  </Col>

                  <Col style={{ marginLeft: 40 }}>
                    <List header = {<Title level={4}>Expiry: </Title>}>
                      
                      <List.Item>
                        <Title level={5}>
                          {dateOf.split("T")[0]}
                        </Title>
                      </List.Item>
                    </List>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={9}>
              <Card
                hoverable
                title="My Prescriptions"
                loading={loadingCard}
                extra={
                  <InfoCircleTwoTone
                    style={{ width: 50, height: 50 }}
                    onClick={prescriptionsRedirect}
                  />
                }
                style={{ marginBottom: 16 }}
              >
                <Row>
                  <Col>
                    <List
                      dataSource={prescriptions}
                      header={<Title level={4}>Medication: </Title>}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>{item.Medication}</Title>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col style={{ marginLeft: 30 }}>
                    <List
                      dataSource={prescriptions}
                      header={
                        <Title style={{ marginLeft: 15 }} level={4}>
                          Dose:{" "}
                        </Title>
                      }
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>{item.Dosage}</Title>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col style={{ marginLeft: 30 }}>
                    <List
                      header={<Title level={4}>Instruction: </Title>}
                      dataSource={prescriptions}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Title level={5}>{item.Instruction}</Title>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          spiderWEBS ©2023 Created by AHIH
        </Footer>
      </Layout>
    </Layout>
  );
};

export default PatientHome;
