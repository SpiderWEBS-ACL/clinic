import { useState, useEffect } from "react";
import {
  Layout,
  Breadcrumb,
  Card,
  Typography,
  List,
  Row,
  Col,
  Spin,
  Modal,
  Avatar,
  message,Table,
} from "antd";
import { InfoCircleTwoTone, SettingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { differenceInYears } from "date-fns";
import "./StylePatient.css";
import { getSubscription } from "../../apis/Patient/Packages/GetSubscription";
import { getPatient } from "../../apis/Patient/GetPatient";
import { getAllAppointmentsPatientApi } from "../../apis/Patient/Appointments/GetAllAppointments";
import Wallet from "../../components/Wallet";
import { filterAppointmentStatusDateApi } from "../../apis/Patient/Appointments/FilterAppointmentStatusDate";
const { Content, Footer } = Layout;
const { Title } = Typography;
import { getBalance } from "../../apis/Patient/GetBalance";

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
  const [balance, setBalance] = useState<number>(0);
  const [dateOf, setDateOf] = useState(String);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      setBalance(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
   
    fetchBalance();
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        Status: "Upcoming",
      },
    };

    const fetchData = async () => {
     
      try {
        const patient = await getPatient();
        setPatientInfo(patient);

        const subscription = await getSubscription();
        if (subscription) setDateOf(subscription.Date + "");

        await api
        .get("patient/showSubscribedPackage", config)   
        .then((response) => {
          if (response.data) setSubscription(response.data);
        });
        
        try {


          const response = await filterAppointmentStatusDateApi("Upcoming", "");
          setAppointments(response.data);
        } catch (error: any) {
          if (error.response.data.error == "No appointments were found")
            setAppointments([]);
        }
        setLoading(false) 
        setLoadingCard(false)
    }
    catch(error:any){
      message.error(`${error.response.data.error}`)
    }
  };
    fetchData();
  }, [id]);

  var title = "";
  if (patientInfo.Gender == "Male") title = "Mr.";
  else if (patientInfo.Gender == "Male") title = "Ms.";

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
  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "Doctor",
      key: "Doctor",
      render: (Doctor: any) => (<span>{Doctor.Name}</span>)

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
      title: "Start Time",
      dataIndex: "start",
      key: "start",
      render: (start: any) => <span>{start.split("T")[1].split(".")[0]}</span>,
    },

  ];
  const columns2 = [
    {
      title: "Package Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Expiry Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: () => (
        <span>{dateOf.split("T")[0]}</span>
      ),
    },
   
    
  ];
  const columns3 = [
    {
      title: "Medication",
      dataIndex: "Medication",
      key: "Medication",
    },
    {
      title: "Dose",
      dataIndex: "Dosage",
      key: "Dosage",
      
    },
    {
      title: "Instruction",
      dataIndex: "Instruction",
      key: "Instruction",
    },
   
    
  ];
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

          <Row >
            <Col md={24} >
              <Card
                hoverable
                title="My Details"
                loading={loadingCard}
                extra={
                  <SettingOutlined
                    style={{ width: 50, height: 50, justifyContent: "right" }}
                    onClick={openModal}
                  />
                }
                style={{ marginBottom: 16,height: "37vh"  }}
              >
                <Row>
                  <Avatar
                    src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                    style={{ width: 150, height: 150 }}
                  />
                  <Col>
                    <Title level={4}>
                      {title} {patientInfo.Name}
                    </Title>
                    <Title level={4}>
                      {calculateAge(patientInfo.Dob)} years old
                    </Title>
                    <Title level={4}>{patientInfo.Gender}</Title>
                  </Col>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginLeft: "auto",
                      marginTop: "25px",
                    }}
                  >
                    <Wallet walletBalance={balance}></Wallet>
                  </div>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row style={{ height:"45vh" }} gutter={30}>
            <Col md={9}>
              <Card
                hoverable
                title="Upcoming Appointments"
                loading={loadingCard}
                style={{ height:"45vh" }}
              >
                <Row>
                <Table
          style={{ width: "55vw", height:"30vh"}}
          columns={columns}
          dataSource={appointments}
          size="middle"
        />
                </Row>
              </Card>
            </Col>
            <Col md={6}>
              <Card
                hoverable
                title="My Subscriptions"
                loading={loadingCard}
                style={{  height:"45vh" }}              >
                <Row>
                <Table
          style={{ width: "55vw", height:"30vh"}}
          columns={columns2}
          dataSource={subscription}
          size="middle"
        />
                </Row>
              </Card>
            </Col>
            <Col md={9}>
              <Card
                hoverable
                title="My Prescriptions"
                loading={loadingCard}
                style={{  height:"45vh" }}              >
                <Row>
                <Table
          style={{ width: "55vw", height:"30vh"}}
          columns={columns3}
          dataSource={prescriptions}
          size="middle"
        />
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientHome;
