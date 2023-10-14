import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import { DatePicker, DatePickerProps, Input, Select, TimePicker } from "antd";
import { message } from "antd";

const ViewAppointments = () => {
  const { Option } = Select;
  const { id } = useParams();
  const [alertVisible, setAlertVisibility] = useState(false);
  const [alertVisible1, setAlertVisibility1] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [hasAppointments, setHasAppointments] = useState(false);
  const [status, setStatus] = useState([]);
  const [date, setDate] = useState("");

  const setTimeoutAl = async () => setAlertVisibility(false);
  const setTimeoutAl1 = async () => setAlertVisibility1(false);
  const clearFilters = async () => {
    setAppointments(allAppointments);
    setDate("");
    setStatus([]);
  };
  const handleFilter = async () => {
    // setStatus([]);
    // setDate("");
    try {
      const response = await api.get(`appointment/filterAppointment`, {
        params: {
          id: id,
          Status: status,
          AppointmentDate: date,
        },
      });
      setAppointments(response.data);
      setHasAppointments(response.data.length > 0);
    } catch (error: any) {
      if (error.response.data.error == "No appointments were found")
        setAppointments([]);
      console.error("Error:", error);
      message.error(error.response.data.error);
    }
  };
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    try {
      api.get(`/appointment/view/${id}`).then((response) => {
        setAppointments(response.data);
        setAllAppointments(response.data);
        setHasAppointments(response.data.length > 0);
      });
    } catch (error: any) {
      message.error(`${error.response.data.error}`);
    }
  }, [id]);

  const onDateChange: DatePickerProps["onChange"] = (
    selectedDate,
    dateString
  ) => {
    const jsDate = selectedDate ? selectedDate.toDate() : null;
    setDate(dateString);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>My Appointments</strong>
      </h2>

      <span>
        <label style={{ marginRight: 8 }}>
          <strong>Status:</strong>
        </label>
        <Select
          value={status}
          style={{ width: 200, margin: "0 20px" }}
          onChange={setStatus}
        >
          <Option value="Upcoming">Upcoming</Option>
          <Option value="Attended">Attended</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Not-Attended">Not-Attended</Option>
        </Select>
        <label style={{ marginRight: 8 }}>
          <strong>Date:</strong>
        </label>
        <DatePicker
          onChange={onDateChange}
          style={{ width: 150, marginRight: 80 }}
        />

        <button
          onClick={handleFilter}
          style={{ width: 80, marginRight: 40 }}
          className="btn btn-sm btn-primary"
        >
          filter
        </button>
        <button
          onClick={clearFilters}
          style={{ width: 80 }}
          className="btn btn-sm btn-primary"
        >
          clear
        </button>
      </span>
      <br></br>
      <br></br>
      {alertVisible && (
        <Alert type={"warning"} onClose={() => setAlertVisibility(false)}>
          {"Please enter value for filteration"}
        </Alert>
      )}
      {alertVisible1 && (
        <Alert type={"info"} onClose={() => setAlertVisibility1(false)}>
          {"No Appointments were found!"}
        </Alert>
      )}
      <br></br>

      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>status</th>
            <th>Appointment Date</th>
            <th>Patient</th>
            <th>Doctor</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((member: any, index) => (
            <tr key={index}>
              <td>
                <h6>{index + 1}</h6>
              </td>
              <td>
                <h6>{member.Status}</h6>
              </td>
              <td>
                <h6>{member.AppointmentDate.split("T")[0]}</h6>
              </td>
              <td>
                <h6>{member.Patient.Name}</h6>
              </td>
              <td>
                <h6>{member.Doctor.Name}</h6>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAppointments;
