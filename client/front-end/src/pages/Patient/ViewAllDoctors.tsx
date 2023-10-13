import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Select,
  DatePicker,
  DatePickerProps,
  TimePicker,
  TimePickerProps,
  Spin,
} from "antd";
const { Option } = Select;

const ViewAllDoctors = () => {
  const [Doctors, setDoctors] = useState([]);
  const [AllDoctors, setAllDoctors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [Name, setName] = useState("");
  const [Specialty, setSpecialty] = useState("");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [loading, setLoading] = useState(true);

  const timeSlots = [];

  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const hourStr = hours.toString().padStart(2, "0");
      const minuteStr = minutes.toString().padStart(2, "0");
      timeSlots.push(`${hourStr}:${minuteStr}:00.000`);
    }
  }

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  useEffect(() => {
    api
      .get("admin/allDoctors")
      .then((response) => {
        setDoctors(response.data);
        setAllDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  }, []);

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
    // console.log(selectedTimeSlot);
    setTime(selectedTimeSlot);
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
            <th>Sesssion Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {Doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Name}</td>
              <td>{request.Specialty}</td>
              <td>{request.HourlyRate}</td>
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
                <th>HourlyRate</th>
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
                <td>{selectedDoctor.Dob}</td>
                <td>{selectedDoctor.HourlyRate}</td>
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
    </div>
  );
};

export default ViewAllDoctors;
