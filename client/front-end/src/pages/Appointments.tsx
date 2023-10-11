import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Select } from "antd";

const ViewAppointments = () => {
  const { Option } = Select;
  const { id } = useParams();

  const [appointments, setAppointments] = useState([]);
  const [hasAppointments, setHasAppointments] = useState(false);
  const [status, setStatus] = useState([]);
  const [date, setDate] = useState([]);

  const handleSignUp = async () => {
    setStatus;
    api
      .get(`appointment/filterAppointment`, {params:{Status: status,AppointmentDate:date}}).then((response) => {
        setAppointments(response.data);
        console.log(response.data);
        setHasAppointments(response.data.length > 0);
      })
  };
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/appointment/view/${id}`)
      .then((response) => {
        setAppointments(response.data);
        console.log(response.data);
        setHasAppointments(response.data.length > 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">My Appointments</h2>
      <Select
        value={status}
        style={{ width: 200, margin: "0 20px" }}
        onChange={handleSignUp}
      >
        <Option value="Upcoming">Upcoming</Option>
        <Option value="Attended">Attended</Option>
        <Option value="Cancelled">Cancelled</Option>
        <Option value="Not-Attended">Not-Attended</Option>
      </Select>
      <br></br>
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
                <h4>{index + 1}</h4>
              </td>
              <td>
                <h4>{member.Status}</h4>
              </td>
              <td>
                <h4>{member.AppointmentDate}</h4>
              </td>
              <td>
                <h4>{member.Patient.Name}</h4>
              </td>
              <td>
                <h4>{member.Doctor.Name}</h4>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAppointments;
