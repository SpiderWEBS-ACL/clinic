import React, { useEffect } from "react";
import axios from "axios";
import { headers } from "../../Middleware/authMiddleware";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AppointmentSuccess = () => {
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const addAppointment = async () => {
    try {
      const response = await api.post(
        "appointment/add",
        {
          Doctor: sessionStorage.getItem("DoctorId"),
          AppointmentDate: sessionStorage.getItem("AppointmentDate"),
          FamilyMember: sessionStorage.getItem("FamilyMember")
        },
        { headers: headers }
      );

      console.log(response.data);
      message.success("Appointment added Successfully!");
      navigate("/patient/allAppointments");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("useEffect ran");
    addAppointment();   
    return () => {
      console.log("Cleanup logic (useEffect cleanup)");
    };
  }, []);

  console.log("Component rendered");

  return <div>AppointmentSuccess</div>;
};

export default AppointmentSuccess;
