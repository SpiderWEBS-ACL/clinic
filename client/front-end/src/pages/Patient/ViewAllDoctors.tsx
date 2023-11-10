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
} from "antd";
import { config, headers } from "../../Middleware/authMiddleware";
import { CreditCardFilled, WalletFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const ViewAllDoctors = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [Doctors, setDoctors] = useState([]);
  const [AllDoctors, setAllDoctors] = useState([]);
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
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
  const navigate = useNavigate();

  const timeSlots = [];

  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const hourStr = hours.toString().padStart(2, "0");
      const minuteStr = minutes.toString().padStart(2, "0");
      timeSlots.push(`${hourStr}:${minuteStr}:00`);
    }
  }

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const handleCheckAvailability = () => {
    api
      .post(
        "patient/checkDoctor",
        {
          Date: AppointmentDate,
          Time: AppointmentTime,
          DoctorId: DoctorId,
        },
        { headers: headers }
      )
      .then((response) => {
        setMessage(response.data.message);
        if (response.data.message === "available") message.success("Available");
        else message.error("Doctor is not available at this time");
      });
  };
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    api
      .get("patient/allDoctors", config)
      .then((response) => {
        setDoctors(response.data);
        setAllDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    api
      .get("patient/getDoctorDiscount", config)
      .then((response) => {
        setDoctorDiscount(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  }, []);

  const redirectToStripe = async () => {
    try {
      try {
        const response = await api.post(
          "patient/payAppointmentStripe",
          {
            id: DoctorId,
          },
          { headers: headers }
        );
        sessionStorage.setItem("DoctorId", DoctorId);
        sessionStorage.setItem(
          "AppointmentDate",
          `${AppointmentDate}T${AppointmentTime}.000Z`
        );
        window.location.href = response.data.url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addAppointment = async () => {
    const response = await api
      .post(
        "appointment/add",
        {
          Doctor: DoctorId,
          AppointmentDate: `${AppointmentDate}T${AppointmentTime}.000Z`,
        },
        { headers: headers }
      )
      .then((response) => {
        console.log(response.data);
        message.success("Appointment added Successfully!");
        navigate("/patient/allAppointments");
      });
  };
  const payWithWallet = async () => {
    try {
      try {
        const response = await api
          .post(
            "patient/payAppointmentWallet",
            {
              id: DoctorId,
            },
            { headers: headers }
          )
          .then((response) => {
            setWalletMessage(response.data);
            addAppointment();
          });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const viewDetails = (doctor: []) => {
    setShowPopup(true);
    setSelectedDoctor(doctor);
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };
  const onAppointmentDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setAppointmentDate(dateString);
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
  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await api.get("patient/filterDoctorsCriteria", {
        params: {
          Name: Name,
          Specialty: Specialty,
          date: Date,
          Time: Time,
        },
        headers: headers,
      });

      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
    setName("");
    setSpecialty("");
    setDate("");
    setTime("");
  };

  const handleClearFilters = async () => {
    setName("");
    setSpecialty("");
    setDate("");
    setTime("");
    setDoctors(AllDoctors);
  };
  const handleBookAppointment = (doctor: any, HourlyRate: any) => {
    setDoctorId(doctor);
    setHourlyRate(HourlyRate);
    setShowDateTimeModal(true);
    api
      .get("/patient/doctorTimeSlots/" + doctor, config)
      .then((response) => {
        setTimeSlotsDoctor(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .get("patient/getBalance", config)
      .then((response) => {
        setBalance(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>
              {DoctorDiscount > 0
                ? `Discounted Sesssion Price (${DoctorDiscount}% Discount)`
                : "Sesssion Price"}
            </th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
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
            </tr>
          ))}
        </tbody>
      </table>
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
                <th>
                  {DoctorDiscount > 0
                    ? `Discounted Sesssion Price (${DoctorDiscount}% Discount)`
                    : "Sesssion Price"}
                </th>
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
          className="btn btn-sm btn-primary"
          style={{
            marginBlock: "1rem",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
          }}
          onClick={() => handleCheckAvailability()}
        >
          <span aria-hidden="true"></span>
          Check Availability
        </button>
        <button
          className="btn btn-sm btn-success"
          style={{
            marginLeft: "1rem",
            marginBlock: "1rem",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
          }}
          disabled={Message === "available" ? false : true}
          onClick={() => {
            setShowDateTimeModal(false);
            setShowPaymentModal(true);
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
