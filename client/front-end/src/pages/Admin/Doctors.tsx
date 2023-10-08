import React, { useState, useEffect } from "react";
import axios from "axios";

const AllDoctors = () => {
  const [Doctors, setDoctors] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const api = axios.create({
    baseURL: "http://localhost:8000/admin",
  });

  useEffect(() => {
    api
      .get("/allDoctors")
      .then((response) => {
        setDoctors(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [deleted]);

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/removeDoctor/${id}`);
      setDeleted(!deleted);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctors</strong>
      </h2>
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
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {Doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Username}</td>
              <td>{request.Name}</td>
              <td>{request.Email}</td>
              <td>{request.Dob}</td>
              <td>{request.HourlyRate}</td>
              <td>{request.Affiliation}</td>
              <td>{request.Speciality}</td>
              <td>{request.EducationalBackground}</td>
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

export default AllDoctors;