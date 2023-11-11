import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import {
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";
import { message } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import { headers } from "../../Middleware/authMiddleware";

const ViewPatientAppointments = () => {
  const { Option } = Select;
  const { id } = useParams();
  const [alertVisible, setAlertVisibility] = useState(false);
  const [alertVisible1, setAlertVisibility1] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointment, setAppointment] = useState<any>(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [hasAppointments, setHasAppointments] = useState(false);
  const [status, setStatus] = useState([]);
  const [date, setDate] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const setTimeoutAl = async () => setAlertVisibility(false);
  const setTimeoutAl1 = async () => setAlertVisibility1(false);
  const [ShowAppointmentModal, setShowAppointmentModal] = useState(false);
  const clearFilters = async () => {
    setAppointments(allAppointments);
    setDate("");
    setStatus([]);
  };
  const handleFilter = async () => {
    // setStatus([]);
    // setDate("");
    try {
      const response = await api.get(`appointment/filterAppointmentDoctor`, {
        params: {
          Status: status,
          AppointmentDate: date,
        },
        headers: headers,
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
    sessionStorage.clear();
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    try {
      api.get(`/doctor/allAppointments`, config).then((response) => {
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
  const handleEventClick = (info: any) => {
    setShowAppointmentModal(true);
    setAppointment(info.event._def.extendedProps);
  };
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Appointments</strong>
      </h2>
      <span>
        <label style={{ marginLeft: devicePixelRatio * 90, marginRight: 8 }}>
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
          style={{ width: 80, marginRight: 20 }}
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

      <FullCalendar
        stickyHeaderDates
        aspectRatio={1}
        height={"75vh"}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          bootstrap5Plugin,
          interactionPlugin,
        ]}
        events={appointments}
        eventClick={(info) => {
          console.log(info);
          handleEventClick(info);
        }}
        themeSystem="bootstrap5"
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
      <Modal
        visible={ShowAppointmentModal}
        onCancel={() => {
          setShowAppointmentModal(false);
        }}
        onOk={() => {
          setShowAppointmentModal(false);
        }}
      >
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>status</th>
            </tr>
          </thead>

          <tbody>
            <tr key={1}>
              <td>{appointment != null ? appointment.Patient.Name : ""}</td>
              <td>
                {appointment != null
                  ? appointment.AppointmentDate.split("T")[0]
                  : ""}
              </td>
              <td>
                {appointment != null
                  ? appointment.AppointmentDate.split("T")[1].split(".")[0]
                  : ""}
              </td>
              <td>{appointment != null ? appointment.Status : ""}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default ViewPatientAppointments;
