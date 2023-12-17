import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  FloatButton,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import { Card } from "antd";
import { Avatar } from "@mui/material";
import {
  CommentOutlined,
  CreditCardFilled,
  WalletFilled,
} from "@ant-design/icons";
import { RangePickerProps } from "antd/es/date-picker";
import { getBalance } from "../../apis/Patient/GetBalance";
import { getDoctorDiscount } from "../../apis/Patient/Doctors/GetDoctorDiscount";
import { payAppointmentStripe } from "../../apis/Patient/Appointments/PayAppointmentStripe";
import { payAppointmentWallet } from "../../apis/Patient/Appointments/PayAppointmentWallet";
import { getTimeSlotsDoctorDate } from "../../apis/Patient/Doctors/GetTimeSlotsDoctorDate";
import { getPatientFamilyMembers } from "../../apis/Patient/Family Members/getFamilyMembers";
import { getSelectedDoctor } from "../../apis/Patient/Doctors/GetSelectedDoctor";
const ViewDoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [loadingList, setLoadingList] = useState(true);
  const [docInfo, setDocInfo] = useState<any>({});
  const [FamilyMembers, setFamilyMembers] = useState<string[]>([]);
  const [FamilyMember, setFamilyMember] = useState("");
  const [hasFamily, setHasFamily] = useState<boolean>();
  const [HourlyRate, setHourlyRate] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentFamilyModal, setShowPaymentFamilyModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showDateTimeFamilyModal, setShowDateTimeFamilyModal] = useState(false);
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [AppointmentTime, setAppointmentTime] = useState("");
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);
  const [DoctorDiscount, setDoctorDiscount] = useState<number>(0);
  const navigate = useNavigate();
  const { Option } = Select;
  const timeSlots: string[] = [];

  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const hourStr = hours.toString().padStart(2, "0");
      const minuteStr = minutes.toString().padStart(2, "0");
      timeSlots.push(`${hourStr}:${minuteStr}:00`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      getDoctorInfo();
      doctorDiscount();
      getFamilyMembers();
    };
    fetchData();
  }, [id]);

  const getDoctorInfo = async () => {
    try {
      const response = await getSelectedDoctor(id);
      setDocInfo(response.data);
      setLoadingList(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getBalanceApi = async () => {
    try {
      const response = await getBalance();
      setBalance(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookAppointment = async (doctor: any, HourlyRate: any) => {
    setHourlyRate(HourlyRate);
    setShowDateTimeModal(true);
    getBalanceApi();
  };
  const handleBookAppointmentFamily = async (doctor: any, HourlyRate: any) => {
    setHourlyRate(HourlyRate);
    setShowDateTimeFamilyModal(true);
    getBalanceApi();
  };
  const doctorDiscount = async () => {
    try {
      const response = await getDoctorDiscount();
      setDoctorDiscount(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const redirectToStripe = async () => {
    try {
      try {
        const response = await payAppointmentStripe(id);
        sessionStorage.setItem("DoctorId", id + "");
        sessionStorage.setItem(
          "AppointmentDate",
          `${AppointmentDate}T${AppointmentTime}:00.000Z`
        );
        if (FamilyMember != "")
          sessionStorage.setItem("FamilyMember", FamilyMember);
        window.location.href = response.data.url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const payWithWallet = async () => {
    try {
      sessionStorage.setItem("DoctorId", id + "");
      sessionStorage.setItem(
        "AppointmentDate",
        `${AppointmentDate}T${AppointmentTime}:00.000Z`
      );
      if (FamilyMember != "")
        sessionStorage.setItem("FamilyMember", FamilyMember);
      try {
        const response = await payAppointmentWallet(id);
        navigate("/appointment/success");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onAppointmentDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setAppointmentDate(dateString);
    setAppointmentTime("");
    setTimeSlotsApi(dateString);
  };
  const setTimeSlotsApi = async (date: string) => {
    try {
      const response = await getTimeSlotsDoctorDate(id, date);
      if (response.data.length == 0)
        message.warning("No slots available on this date");
      setTimeSlotsDoctor(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAppointmentTimeSlotChange = (selectedTimeSlot: string) => {
    setAppointmentTime(selectedTimeSlot);
  };

  const handleAppointmentFamilyChange = (familyMember: string) => {
    setFamilyMember(familyMember);
  };

  const handlePaymentSelection = (paymentMethod: string) => {
    if (paymentMethod === "Card") {
      redirectToStripe();
    } else {
      payWithWallet();
    }
    setShowPaymentModal(false);
  };

  const getFamilyMembers = async () => {
    try {
      const response = await getPatientFamilyMembers();
      setHasFamily(response.data.length > 0);
      response.data.map((member: any) => {
        FamilyMembers.push(member.Name);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Doctor Information</h2>
      <Card
        style={{
          height: "25rem",
          width: "50rem",
          marginTop: "2rem",
          marginLeft: "12rem",
        }}
        loading={loadingList}
        hoverable
        className="hover-card"
      >
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #333",
            paddingBottom: "10px",
          }}
        >
          <Avatar
            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            style={{ width: 100, height: 100 }}
          />
          <div style={{ marginLeft: "20px", flex: 1 }}>
            <div style={{ fontSize: "22px", marginBottom: "10px" }}>
              {docInfo.Name}
            </div>
            <div style={{ fontSize: "15px", lineHeight: "1.5" }}>
              <strong>Email: </strong>
              {docInfo.Email}
              <br></br>
              <br></br>
              <strong>Username: </strong>
              {docInfo.Username}
              <br></br>
              <br></br>
              <strong>Date of birth: </strong>
              {String(docInfo.Dob).substring(0, 10)}
              <br></br>
              <br></br>
              <strong>Affiliation: </strong>
              {docInfo.Affiliation}
              <br></br>
              <br></br>
              <strong>Education: </strong>
              {docInfo.EducationalBackground}
              <br></br>
              <br></br>
              <strong>Session Price: </strong>${docInfo.HourlyRate}
            </div>
          </div>
        </div>

        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 25,
          }}
        >
          <button
            style={{ marginLeft: 0 }}
            className="btn btn-sm btn-primary"
            onClick={() => {
              handleBookAppointment(docInfo._id, docInfo.HourlyRate);
            }}
          >
            Book Appointment
          </button>
          <button
            style={{ marginRight: 20 }}
            className="btn btn-sm btn-primary"
            hidden={!hasFamily}
            onClick={() => {
              handleBookAppointmentFamily(docInfo._id, docInfo.HourlyRate);
            }}
          >
            Book for family member
          </button>
        </Row>
      </Card>
      <Modal
        title="Select Payment Method"
        visible={showPaymentModal}
        onCancel={() => {
          setShowPaymentModal(false);
          setShowDateTimeModal(true);
        }}
        footer={null}
      >
        <Button
          disabled={balance < HourlyRate * (1 - DoctorDiscount / 100)}
          type="primary"
          block
          style={{ marginBottom: "8px" }}
          onClick={() => handlePaymentSelection("Wallet")}
        >
          <Row justify="center" align="middle">
            <Col>
              <WalletFilled />
            </Col>
            <Col style={{ marginLeft: 8, textAlign: "center" }}>
              {" "}
              Wallet (Balance: ${balance})
            </Col>
          </Row>
        </Button>
        <Button
          type="primary"
          block
          onClick={() => handlePaymentSelection("Card")}
        >
          <Row justify="center" align="middle">
            <Col>
              <CreditCardFilled />
            </Col>
            <Col style={{ marginLeft: 8, textAlign: "center" }}>Card</Col>
          </Row>
        </Button>
      </Modal>
      <Modal
        title="Select Payment Method"
        visible={showPaymentFamilyModal}
        onCancel={() => {
          setShowPaymentFamilyModal(false);
          setShowDateTimeFamilyModal(true);
        }}
        footer={null}
      >
        <Button
          disabled={balance < HourlyRate * (1 - DoctorDiscount / 100)}
          type="primary"
          block
          style={{ marginBottom: "8px" }}
          onClick={() => handlePaymentSelection("Wallet")}
        >
          <Row justify="center" align="middle">
            <Col>
              <WalletFilled />
            </Col>
            <Col style={{ marginLeft: 8, textAlign: "center" }}>
              {" "}
              Wallet (Balance: ${balance})
            </Col>
          </Row>
        </Button>
        <Button
          type="primary"
          block
          onClick={() => handlePaymentSelection("Card")}
        >
          <Row justify="center" align="middle">
            <Col>
              <CreditCardFilled />
            </Col>
            <Col style={{ marginLeft: 8, textAlign: "center" }}>Card</Col>
          </Row>
        </Button>
      </Modal>
      <Modal
        title="Select Appointment Time"
        visible={showDateTimeModal}
        onCancel={() => {
          setShowDateTimeModal(false);
          setAppointmentDate("");
          setAppointmentTime("");
        }}
        footer={null}
      >
        <DatePicker
          disabledDate={disabledDate}
          onChange={onAppointmentDateChange}
          style={{ width: 150, marginRight: 30 }}
        />
        <label style={{ marginRight: 8 }}></label>
        <Select
          disabled={AppointmentDate == ""}
          value={AppointmentTime}
          onChange={handleAppointmentTimeSlotChange}
          style={{ width: 150, marginRight: 30 }}
        >
          <Option value="">Select slot</Option>
          {timeSlotsDoctor.map((slot) => (
            <Option key={slot} value={slot}>
              {slot}
            </Option>
          ))}
        </Select>
        <button
          disabled={AppointmentDate == "" || AppointmentTime == ""}
          className="btn btn-sm btn-success"
          style={{
            marginLeft: "1rem",
            marginBlock: "1rem",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
          }}
          onClick={() => {
            setShowDateTimeModal(false);
            setShowPaymentModal(true);
          }}
        >
          <span aria-hidden="true"></span>
          Book
        </button>
      </Modal>
      <Modal
        title="Select Appointment Time"
        visible={showDateTimeFamilyModal}
        onCancel={() => {
          setShowDateTimeFamilyModal(false);
          setAppointmentDate("");
          setAppointmentTime("");
        }}
        footer={null}
      >
        <DatePicker
          disabledDate={disabledDate}
          onChange={onAppointmentDateChange}
          style={{ width: 207, marginRight: 30 }}
        />
        <label style={{ marginRight: 8 }}></label>
        <Select
          disabled={AppointmentDate == ""}
          value={AppointmentTime}
          onChange={handleAppointmentTimeSlotChange}
          style={{ width: 207 }}
        >
          <Option value="">Select slot</Option>
          {timeSlotsDoctor.map((slot) => (
            <Option key={slot} value={slot}>
              {slot}
            </Option>
          ))}
        </Select>
        <Select
          value={FamilyMember}
          onChange={handleAppointmentFamilyChange}
          style={{ width: 250, marginRight: 30 }}
        >
          <Option value="">Choose Family Member</Option>
          {FamilyMembers.map((member) => (
            <Option key={member} value={member}>
              {member}
            </Option>
          ))}
        </Select>
        <button
          disabled={AppointmentDate == "" || AppointmentTime == ""}
          className="btn btn-sm btn-success"
          style={{
            marginLeft: "1rem",
            marginBlock: "1rem",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
          }}
          onClick={() => {
            setShowDateTimeFamilyModal(false);
            setShowPaymentFamilyModal(true);
          }}
        >
          <span aria-hidden="true"></span>
          Book
        </button>
      </Modal>
    </div>
  );
};

export default ViewDoctorDetails;
