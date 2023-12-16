import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import {
  Button,
  Card,
  DatePicker,
  DatePickerProps,
  Modal,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import { message } from "antd";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { RangePickerProps } from "antd/es/date-picker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import { filterAppointmentStatusDateApi } from "../../apis/Patient/Appointments/FilterAppointmentStatusDate";
import { getAllAppointmentsPatientApi } from "../../apis/Patient/Appointments/GetAllAppointments";
import { getTimeSlotsDoctorDate } from "../../apis/Patient/Doctors/GetTimeSlotsDoctorDate";
import { handleReschedule } from "../../apis/Patient/Appointments/RescheduleAppointment";
import { cancelAppointmentDoctor } from "../../apis/Doctor/Appointments/cancelAppointment";
import { s } from "@fullcalendar/core/internal-common";
import { scheduleFollowUp } from "../../apis/Patient/Appointments/RequestFollowUp";

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
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [ShowAppointmentModal, setShowAppointmentModal] = useState(false);
  const [ShowRescheduleModal, setShowRescheduleModal] = useState(false);
  const [ShowFollowUpModal, setShowFollowUpModal] = useState(false);
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [AppointmentTime, setAppointmentTime] = useState("");
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      handleCancelAppointment(appointment._id);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
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
      const response = await getTimeSlotsDoctorDate(appointment.Doctor, date);
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

  const handleRequestClick = () => {
    try {
      const date = new Date(`${AppointmentDate}T${AppointmentTime}:00.000Z`);
      scheduleFollowUp(date, appointment);
      setShowFollowUpModal(false);
      setAppointmentDate("");
    setAppointmentTime("");
      message.success("Request Sent");
    } catch (error: any) {
      message.error(`${error.response.data.error}`);
    }
  };

  const handleRescheduleClick = async () => {
    console.log(appointment.Status);
    if (appointment.Status == "Upcoming") {
      await handleReschedule(
        appointment._id,
        `${AppointmentDate}T${AppointmentTime}:00.000Z`
      );
      setLoading(true);
      await fetchAppointments();
      setShowAppointmentModal(false);
      message.success("appointment rescheduled");
    } else {
      message.error("this appointment can not be rescheduled");
    }
    setAppointmentDate("");
    setAppointmentTime("");
    setShowRescheduleModal(false);
  };
  const handleCancelAppointment = async (id: string) => {
    try {
      await cancelAppointmentDoctor(id).then((response) => {
        setLoading(true);
        fetchAppointments();
        setShowAppointmentModal(false);
        message.success(response.data);
      });
    } catch (error: any) {
      message.error(`${error.response.data.error}`);
    }
  };

  const checkStatus = () => {
    if (appointment) {
      if (appointment.Status != "Upcoming") {
        return true;
      } else return false;
    }
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
          height={"75vh"}
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
        //onOk={() => {
        // setShowAppointmentModal(false);
        ///}}
        footer={
          <div>
            <Button
              style={{ justifySelf: "left" }}
              type="primary"
              hidden={!checkStatus()}
              onClick={() => {
                setShowFollowUpModal(true);
              }}
            >
              Schedule FollowUp
            </Button>
            <Modal
              title="Select FollowUp Time"
              visible={ShowFollowUpModal}
              onCancel={() => {
                setShowFollowUpModal(false);
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
              <Button
                style={{ justifySelf: "left" }}
                type="primary"
                hidden={!checkStatus()}
                onClick={async () => {
                  await handleRequestClick();
                  setShowAppointmentModal(false);
                }}
              >
                <span aria-hidden="true"></span>
                Request
              </Button>
            </Modal>
            <Popconfirm
              title="ALERT"
              description="Are you sure you want to unsubscribe?"
              open={open}
              onConfirm={handleOk}
              okButtonProps={{ loading: confirmLoading }}
              onCancel={handleCancel}
            >
              <Button
                type="primary"
                danger
                disabled={checkStatus()}
                onClick={() => {
                  showPopconfirm();
                }}
              >
                Cancel Appointment
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              disabled={checkStatus()}
              onClick={() => {
                setShowRescheduleModal(true);
              }}
            >
              Reschedule
            </Button>
                 
          </div>
        }
      >
        <Modal
          title="Select Appointment Time"
          visible={ShowRescheduleModal}
          onCancel={() => {
            setShowRescheduleModal(false);
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
              handleRescheduleClick();
            }}
          >
            <span aria-hidden="true"></span>
            Reschedule
          </button>
        </Modal>
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
