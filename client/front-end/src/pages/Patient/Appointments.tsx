import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import { DatePicker, DatePickerProps, Modal, Select, Spin } from "antd";
import { message } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import { filterAppointmentStatusDateApi } from "../../apis/Patient/Appointments/FilterAppointmentStatusDate";
import { getAllAppointmentsPatientApi } from "../../apis/Patient/Appointments/GetAllAppointments";

const ViewPatientAppointments = () => {
  const { Option } = Select;
  const { id } = useParams();
  const [alertVisible, setAlertVisibility] = useState(false);
  const [alertVisible1, setAlertVisibility1] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointment, setAppointment] = useState<any>(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [status, setStatus] = useState([]);
  const [date, setDate] = useState("");
  const [ShowAppointmentModal, setShowAppointmentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const clearFilters = async () => {
    setAppointments(allAppointments);
    setDate("");
    setStatus([]);
  };
  const handleFilter = async () => {
    try {
      const response = await filterAppointmentStatusDateApi(status, date);
      setAppointments(response.data);
    } catch (error: any) {
      if (error.response.data.error == "No appointments were found")
        setAppointments([]);
      console.error("Error:", error);
      message.error(error.response.data.error);
    }
  };
  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointmentsPatientApi();
      setAppointments(response.data);
      setAllAppointments(response.data);
      setLoading(false);
    } catch (error: any) {
      message.error(`${error.response.data.error}`);
      setLoading(false);
    }
  };
  useEffect(() => {
    sessionStorage.clear();
    fetchAppointments();
  }, [id]);

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

  const onDateChange: DatePickerProps["onChange"] = (
    selectedDate,
    dateString
  ) => {
    setDate(dateString);
  };
  const handleEventClick = (info: any) => {
    setShowAppointmentModal(true);
    setAppointment(info.event._def.extendedProps);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Appointments</h2>

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
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Rescheduled">Rescheduled</Option>
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
      <div>
        <FullCalendar
          stickyHeaderDates
          aspectRatio={1}
          height={"70vh"}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            bootstrap5Plugin,
            interactionPlugin,
          ]}
          events={appointments}
          eventClick={(info: any) => {
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
      </div>
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
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>status</th>
            </tr>
          </thead>

          <tbody>
            <tr key={1}>
              <td>{appointment != null ? appointment.Doctor.Name : ""}</td>
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
