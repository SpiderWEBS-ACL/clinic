import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import {
  Button,
  DatePicker,
  Popconfirm,
  DatePickerProps,
  Modal,
  Select,
  Spin,
} from "antd";
import { message } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import { allAppoimtmentsDoctor } from "../../apis/Doctor/Appointments/AllAppointmentsDoctor";
import { filterAppointmentsDoctor } from "../../apis/Doctor/Appointments/FilterAppointmentsDoctor";
import { cancelAppointmentDoctor } from "../../apis/Doctor/Appointments/cancelAppointment";
import { getTimeSlotsDoctorDate } from "../../apis/Patient/Doctors/GetTimeSlotsDoctorDate";
import { handleReschedule } from "../../apis/Patient/Appointments/RescheduleAppointment";

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
  const accessToken = localStorage.getItem("accessToken");
  const [ShowAppointmentModal, setShowAppointmentModal] = useState(false);
  const [ShowRescheduleModal, setShowRescheduleModal] = useState(false);
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [AppointmentTime, setAppointmentTime] = useState("");
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const navigate = useNavigate();
  const clearFilters = async () => {
    setAppointments(allAppointments);
    setDate("");
    setStatus([]);
  };
  const handleFilter = async () => {
    try {
      const response = await filterAppointmentsDoctor(status, date);
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
      await allAppoimtmentsDoctor().then((response) => {
        setAppointments(response.data);
        setAllAppointments(response.data);
        setLoading(false);
      });
    } catch (error: any) {
      setLoading(false);
      message.error(`${error.response.data.error}`);
      setLoading(false);
    }
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
      setLoading(false);
      message.error(`${error.response.data.error}`);
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
    const jsDate = selectedDate ? selectedDate.toDate() : null;
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
  const checkStatus = () => {
    if (appointment) {
      if (appointment.Status != "Upcoming") {
        return true;
      } else return false;
    } else return false;
  };

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

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Appointments</h2>
      <span>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <label
            style={{
              marginRight: "1rem",
              marginTop: "0.4rem",
            }}
          >
            <strong>Status</strong>
          </label>
          <Select
            value={status}
            style={{ width: 150, marginRight: "1rem" }}
            onChange={setStatus}
          >
            <Option value="Upcoming">Upcoming</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="Rescheduled">Rescheduled</Option>
          </Select>
          <label style={{ marginRight: "1rem", marginTop: "0.4rem" }}>
            <strong>Date</strong>
          </label>
          <DatePicker
            onChange={onDateChange}
            style={{ width: 150, marginRight: 20 }}
          />

          <Button
            type="primary"
            onClick={handleFilter}
            style={{ width: 80, marginRight: 20 }}
          >
            filter
          </Button>
          <Button onClick={clearFilters} style={{ width: 80 }}>
            clear
          </Button>
        </div>
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
            <Popconfirm
              title="ALERT"
              description="Are you sure you want to Cancel?"
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
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>status</th>
            </tr>
          </thead>

          <tbody>
            <tr key={1}>
              <td
                onClick={() => {
                  if (appointment) {
                    navigate(
                      `/doctor/viewPatientInfo/${appointment.Patient?._id}`
                    );
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                  e.currentTarget.style.color = "#007BFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.cursor = "auto";
                  e.currentTarget.style.color = "";
                }}
              >
                {appointment ? appointment.Patient?.Name : ""}
              </td>
              <td>
                {appointment != null
                  ? appointment.AppointmentDate?.split("T")[0]
                  : ""}
              </td>
              <td>
                {appointment != null
                  ? appointment.AppointmentDate?.split("T")[1].split(".")[0]
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
