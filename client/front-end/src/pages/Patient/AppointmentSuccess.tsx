import { useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { addAppointmentPatient } from "../../apis/Patient/Appointments/AddAppointment";

const AppointmentSuccess = () => {
  const navigate = useNavigate();
  
  const addAppointment = async () => {
    try {
      var DoctorId = sessionStorage.getItem("DoctorId");
      var AppointmentDate = sessionStorage.getItem("AppointmentDate");
      var FamilyMember = sessionStorage.getItem("FamilyMember");
      await addAppointmentPatient(DoctorId, AppointmentDate, FamilyMember);
      message.success("Appointment added Successfully!");
      navigate("/patient/allAppointments");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    addAppointment();
    return () => {};
  }, []);

  return <></>;
};

export default AppointmentSuccess;
