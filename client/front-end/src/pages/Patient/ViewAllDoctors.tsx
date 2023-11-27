import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Select,
  DatePicker,
  DatePickerProps,
  TimePickerProps,
  Spin,
  Modal,
  Button,
  message,
  Row,
  Col,
  Card,
  Avatar,
} from "antd";

import { headers } from "../../Middleware/authMiddleware";
import {
  ArrowRightOutlined,
  CreditCardFilled,
  WalletFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../apis/Patient/Doctors/GetAllDoctors";
import { getDoctorDiscount } from "../../apis/Patient/Doctors/GetDoctorDiscount";
import { getPatientFamilyMembers } from "../../apis/Patient/Family Members/getFamilyMembers";
import { payAppointmentStripe } from "../../apis/Patient/Appointments/PayAppointmentStripe";
import { payAppointmentWallet } from "../../apis/Patient/Appointments/PayAppointmentWallet";
import { getBalance } from "../../apis/Patient/GetBalance";
import { filterDoctorsCriteria } from "../../apis/Patient/Doctors/FilterDoctorsCriteria";
import { getTimeSlotsDoctorDate } from "../../apis/Patient/Doctors/GetTimeSlotsDoctorDate";
const { Option } = Select;

const ViewAllDoctors = () => {
  const [Doctors, setDoctors] = useState<any[]>([])
  const [AllDoctors, setAllDoctors] = useState([]);
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentFamilyModal, setShowPaymentFamilyModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showDateTimeFamilyModal, setShowDateTimeFamilyModal] = useState(false);
  const [Name, setName] = useState("");
  const [Specialty, setSpecialty] = useState("");
  const [Date, setDate] = useState("");
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [Time, setTime] = useState("");
  const [AppointmentTime, setAppointmentTime] = useState("");
  const [DoctorId, setDoctorId] = useState("");
  const [Message, setMessage] = useState("");
  const [WalletMessage, setWalletMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [HourlyRate, setHourlyRate] = useState<number>(0);
  const [DoctorDiscount, setDoctorDiscount] = useState<number>(0);
  const [FamilyMembers, setFamilyMembers] = useState<string[]>([]);
  const [FamilyMember, setFamilyMember] = useState("");
  const [SessionPrice, setSessionPrice] = useState("");
  const [hasFamily, setHasFamily] = useState<boolean>();
  const navigate = useNavigate();
  const [loadingList, setLoadingList] = useState(true);
  const { Meta } = Card;
  const [expanded, setExpanded] = useState(false);
  const [expIndex, setExpIndex] = useState<number>(0);

  const timeSlots = [];

  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const hourStr = hours.toString().padStart(2, "0");
      const minuteStr = minutes.toString().padStart(2, "0");
      timeSlots.push(`${hourStr}:${minuteStr}:00`);
    }
  }

  const getAllDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data);
      setAllDoctors(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRedirection = (item: any) => {
    navigate(`/patient/doctordetails/${item}`);
  };

  const doctorDiscount = async () => {
    try {
      const response = await getDoctorDiscount();
      setDoctorDiscount(response.data);
      setSessionPrice(
        response.data > 0
          ? `Discounted Sesssion Price (${response.data}% Discount)`
          : "Sesssion Price"
      );
    } catch (error) {
      console.error("Error:", error);
    }
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

  useEffect(() => {

    const fetchData = async () => {
      getFamilyMembers();
      getAllDoctors();
      doctorDiscount();
    };
    fetchData();
    setLoadingList(false);
  }, []);
  
  const redirectToStripe = async () => {
    try {
      try {
        const response = await payAppointmentStripe(DoctorId);
        sessionStorage.setItem("DoctorId", DoctorId);
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
      sessionStorage.setItem("DoctorId", DoctorId);
      sessionStorage.setItem(
        "AppointmentDate",
        `${AppointmentDate}T${AppointmentTime}:00.000Z`
      );
      if (FamilyMember != "")
        sessionStorage.setItem("FamilyMember", FamilyMember);
      try {
        const response = await payAppointmentWallet(DoctorId);
        setWalletMessage(response.data);
        navigate("/appointment/success");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const viewDetails = (doctor: []) => {
    setShowPopup(true);
    setSelectedDoctor(doctor);
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };

  const setTimeSlotsApi = async (date: string) => {
    try {
      const response = await getTimeSlotsDoctorDate(DoctorId, date);
      setTimeSlotsDoctor(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const onAppointmentDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setAppointmentDate(dateString);
    setTimeSlotsApi(dateString);
    setMessage("");
    console.log(dateString);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialty(e.target.value);
  };
  const onTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
    setTime(timeString);
  };
  const handleTimeSlotChange = (selectedTimeSlot: string) => {
    setTime(selectedTimeSlot);
  };
  const handleAppointmentTimeSlotChange = (selectedTimeSlot: string) => {
    setAppointmentTime(selectedTimeSlot);
    setMessage("");
    console.log(selectedTimeSlot);
  };
  const handleAppointmentFamilyChange = (familyMember: string) => {
    setFamilyMember(familyMember);
    setMessage("");
    console.log(familyMember);
  };
  const handleFilter = async () => {
    setLoadingList(true);
    try {
      const response = await filterDoctorsCriteria(Name, Specialty, Date, Time);
      setDoctors(response.data);
      setLoadingList(false);
    } catch (error) {
      console.error(error);
    }
    setName("");
    setSpecialty("");
    setDate("");
    setTime("");
  };

  const handleClearFilters = async () => {
    setLoadingList(true);
    setName("");
    setSpecialty("");
    setDate("");
    setTime("");
    setDoctors(AllDoctors);
    setLoadingList(false);

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
    setDoctorId(doctor);
    setHourlyRate(HourlyRate);
    setShowDateTimeModal(true);
    getBalanceApi();
  };
  const handleBookAppointmentFamily = async (doctor: any, HourlyRate: any) => {
    setDoctorId(doctor);
    setHourlyRate(HourlyRate);
    setShowDateTimeFamilyModal(true);
    getBalanceApi();
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


  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctors</strong>
      </h2>
      <div className="mb-3">
        <span>
          <label style={{ marginRight: 8, marginLeft: 10 }}>
            <strong>Name:</strong>
          </label>
          <Input
            type="text"
            value={Name}
            onChange={onNameChange}
            style={{ width: 150, marginRight: 30 }}
          />
          <label style={{ marginRight: 8 }}>
            <strong>Specialty:</strong>
          </label>
          <Input
            type="text"
            value={Specialty}
            onChange={onSpecialtyChange}
            style={{ width: 150, marginRight: 30 }}
          />
          <label style={{ marginRight: 8 }}>
            <strong>Date:</strong>
          </label>
          <DatePicker
            onChange={onDateChange}
            style={{ width: 150, marginRight: 30 }}
          />
          <label style={{ marginRight: 8 }}>
            <strong>Time:</strong>
          </label>
          <Select
            value={Time}
            onChange={handleTimeSlotChange}
            style={{ width: 150, marginRight: 30 }}
          >
            <Option value="">Select a time slot</Option>
            {timeSlots.map((slot) => (
              <Option key={slot} value={slot}>
                {slot}
              </Option>
            ))}
          </Select>
          <button
            onClick={handleFilter}
            style={{ width: 100, marginRight: 20 }}
            className="btn btn-sm btn-primary"
          >
            Apply filters
          </button>
          <button
            onClick={handleClearFilters}
            style={{ width: 100 }}
            className="btn btn-sm btn-primary"
          >
            Clear filters
          </button>
        </span>
      </div>
      <tbody>
        {Doctors.map(
          (request, index) =>
            index % 3 === 0 && (
              <Row gutter={16} key={index}>
                {Doctors.slice(index, index + 3).map((request, subIndex) => (
                  <Col span={8} key={subIndex} style={{ maxWidth: "27rem" }}>
                    <div>
                      <Card
                        style={{
                          width: "25rem",
                          marginTop: "3rem",
                          height: "12rem",
                        }}
                        loading={loadingList}
                        hoverable
                        className="hover-card"
                        onClick={() => handleRedirection(request._id)}
                      >
                        <Meta
                          avatar={
                            <Avatar
                              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                              style={{ width: 75, height: 75 }}
                            />
                          }
                          title={
                            <div style={{ fontSize: "20px" }}>
                              {request.Name}
                            </div>
                          }
                          description={
                            <div>
                              <strong>Specialty: </strong> {request.Specialty}
                              <br></br>
                              <br></br>
                              <strong>Affiliation: </strong>{" "}
                              {request.Affiliation}
                              <br></br>
                              <br></br>
                              <ArrowRightOutlined
                                style={{ marginLeft: "13rem" }}
                              ></ArrowRightOutlined>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  </Col>
                ))}
              </Row>
            )
        )}
      </tbody>

      {/* <tbody>
          {Doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Name}</td>
              <td>{request.Specialty}</td>
              <td>
                {Math.round((1 - DoctorDiscount / 100) * request.HourlyRate)}
              </td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-primary"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => viewDetails(request)}
                >
                  <span aria-hidden="true"></span>
                  Details
                </button>
              </td>
              <td>
                <button
                  key={request._id}
                  className="btn btn-sm btn-success"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    handleBookAppointment(request._id, request.HourlyRate);
                  }}
                >
                  <span aria-hidden="true"></span>
                  Book Appointment
                </button>
              </td>
              <td>
                <button
                  key={request._id}
                  className="btn btn-sm btn-success"
                  hidden={!hasFamily}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    handleBookAppointmentFamily(
                      request._id,
                      request.HourlyRate
                    );
                  }}
                >
                  <span aria-hidden="true"></span>
                  Book for family member
                </button>
              </td>
            </tr>
          ))}
        </tbody> */}
      {showPopup && selectedDoctor && (
        <div className="popup">
          <h3>Doctor Details</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Dob</th>
                <th>{SessionPrice}</th>
                <th>Affiliation</th>
                <th>Specialty</th>
                <th>Education</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedDoctor.Username}</td>
                <td>{selectedDoctor.Name}</td>
                <td>{selectedDoctor.Email}</td>
                <td>{selectedDoctor.Dob.split("T")[0]}</td>
                <td>
                  {Math.round(
                    (1 - DoctorDiscount / 100) * selectedDoctor.HourlyRate
                  )}
                </td>
                <td>{selectedDoctor.Affiliation}</td>
                <td>{selectedDoctor.Specialty}</td>
                <td>{selectedDoctor.EducationalBackground}</td>
              </tr>
            </tbody>
          </table>
          <button
            className="btn btn-sm btn-danger"
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
            onClick={() => setShowPopup(false)}
          >
            <span aria-hidden="true"></span>
            Hide
          </button>
        </div>
      )}
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

export default ViewAllDoctors;
