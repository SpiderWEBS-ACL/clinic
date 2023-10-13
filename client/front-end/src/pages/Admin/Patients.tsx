import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:8000/admin",
  });

  useEffect(() => {
    api
      .get("/allPatients")
      .then((response) => {
        setPatients(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [deleted]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/removePatient/${id}`);
      setDeleted(!deleted);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
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

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Patients</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dob</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Emergency Contact</th>
            <th>Emergency Mobile No.</th>
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Username}</td>
              <td>{request.Name}</td>
              <td>{request.Email}</td>
              <td>
                {request.Dob == null
                  ? request.Dob
                  : request.Dob.substring(0, 10)}
              </td>
              <td>{request.Gender}</td>
              <td>{request.Mobile}</td>
              <td>{request.EmergencyContactName}</td>
              <td>{request.EmergencyContactMobile}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => handleDelete(request._id)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
