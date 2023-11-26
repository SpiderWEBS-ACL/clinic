import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import { Card } from "antd";
import { Avatar } from "@mui/material";
import { CreditCardFilled, DeleteOutlined, InfoCircleOutlined, WalletFilled } from "@ant-design/icons";
import { tr } from "date-fns/locale";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { green } from "@mui/material/colors";
import FolderIcon from "@mui/icons-material/Folder";
import { headers } from "../../Middleware/authMiddleware";
const ViewDoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem("accessToken");
  const [SessionPrice, setSessionPrice] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [docInfo, setDocInfo] = useState<any>({});
  const [FamilyMembers, setFamilyMembers] = useState<string[]>([]);
  const [FamilyMember, setFamilyMember] = useState("");
  const [hasFamily, setHasFamily] = useState<boolean>();
  const [WalletMessage, setWalletMessage] = useState("");
  const [DoctorId, setDoctorId] = useState("");
  const [HourlyRate, setHourlyRate] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentFamilyModal, setShowPaymentFamilyModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showDateTimeFamilyModal, setShowDateTimeFamilyModal] = useState(false);
  const [Date, setDate] = useState("");
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [Time, setTime] = useState("");
  const [AppointmentTime, setAppointmentTime] = useState("");
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [DoctorDiscount, setDoctorDiscount] = useState<number>(0);
  const [Message, setMessage] = useState("");
  const navigate = useNavigate();

  const { Option } = Select;


  const { Meta } = Card;

  const timeSlots: string[] = [];

  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const hourStr = hours.toString().padStart(2, "0");
      const minuteStr = minutes.toString().padStart(2, "0");
      timeSlots.push(`${hourStr}:${minuteStr}:00`);

    }
  }
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    getDoctorInfo();
    doctorDiscount();
    getFamilyMembers();

  }, [id]);

  const getDoctorInfo = async () => {
    await api
      .get(`/patient/viewSelectedDoctor/${id}`, config)
      .then((response) => {
        console.log(response.data);
        setDocInfo(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getBalanceApi = async () => {
    api
      .get("patient/getBalance", config)
      .then((response) => {
        setBalance(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
  const doctorDiscount = () => {
    api
      .get("patient/getDoctorDiscount", config)
      .then((response) => {
        setDoctorDiscount(response.data);
        setSessionPrice(
          response.data > 0
            ? `Discounted Sesssion Price (${response.data}% Discount)`
            : "Sesssion Price"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const redirectToStripe = async () => {
    const DoctorId = id;
    try {
      try {
        const response = await api.post(
          "patient/payAppointmentStripe",
          {
            id:  DoctorId,
          },
          { headers: headers }
        );
        sessionStorage.setItem("DoctorId", DoctorId+"");
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
      sessionStorage.setItem("DoctorId", id+"");
      sessionStorage.setItem(
        "AppointmentDate",
        `${AppointmentDate}T${AppointmentTime}:00.000Z`
      );
      if (FamilyMember != "")
        sessionStorage.setItem("FamilyMember", FamilyMember);
      try {
        const response = await api
          .post(
            "patient/payAppointmentWallet",
            {
              id: id,
            },
            { headers: headers }
          )
          .then((response) => {
            setWalletMessage(response.data);
            navigate("/appointment/success");
          });
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
    setTimeSlotsApi(dateString);
    setMessage("");
  };
  const setTimeSlotsApi = (date: string) => {
    api
      .post(
        "patient/getTimeSlotsDoctorDate",
        {
          DoctorId:  id,
          date: date,
        },
        { headers: headers }
      )
      .then((response) => {
        console.log("SLOTS:"+ response.data)
        setTimeSlotsDoctor(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAppointmentTimeSlotChange = (selectedTimeSlot: string) => {
    setAppointmentTime(selectedTimeSlot);
    setMessage("");
  };
  const handleAppointmentFamilyChange = (familyMember: string) => {
    setFamilyMember(familyMember);
    setMessage("");
  };
  const handlePaymentSelection = (paymentMethod: string) => {
    if (paymentMethod === "Card") {
      redirectToStripe();
    } else {
      payWithWallet();
    }
    console.log("Selected payment method: ", paymentMethod);
    setShowPaymentModal(false);
  };

  const getFamilyMembers = () => {
    api
      .get("patient/viewFamilyMembers", config)
      .then((response) => {
        setHasFamily(response.data.length > 0);
        response.data.map((member: any) => {
          FamilyMembers.push(member.Name);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctor Information</strong>
      </h2>

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
            style={{ marginLeft: 200 }}
            className="btn btn-sm btn-primary"
            onClick={() => {
              handleBookAppointment(docInfo._id, docInfo.HourlyRate);
            }}
          >
            Book Appointment
          </button>
          <button
            style={{ marginRight: 200 }}
            className="btn btn-sm btn-primary"
            hidden={!hasFamily}
            onClick={() => {
              handleBookAppointmentFamily(
                docInfo._id,
                docInfo.HourlyRate
              );
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
          setMessage("");
        }}
        footer={null}
      >
        <DatePicker
          onChange={onAppointmentDateChange}
          style={{ width: 150, marginRight: 30 }}
        />
        <label style={{ marginRight: 8 }}></label>
        <Select
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
          setMessage("");
        }}
        footer={null}
      >
        <DatePicker
          onChange={onAppointmentDateChange}
          style={{ width: 207, marginRight: 30 }}
        />
        <label style={{ marginRight: 8 }}></label>
        <Select
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
