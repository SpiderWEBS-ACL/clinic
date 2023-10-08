import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
// Username
// "Doctor1"
// Name
// "Doctor"
// Email
// "Doctor@Doctor.com"
// Password
// "pass"
// Dob
// 2012-04-23T18:25:43.511+00:00
// HourlyRate
// 300
// Affiliation
// "Affiliation"
// EducationalBackground
// "Harvard"

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
  const navigate = useNavigate();

  const handleItemSelect = (item: any) => {
    navigate(`/admin/allDoctors/${item._id}`);
  };
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
      <h2 className="text-center mt-4 mb-4">Doctors</h2>
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
                  className="btn btn-danger"
                  style={{
                    padding: "5px",
                    width: "30px",
                    height: "30px",
                    fontSize: "14px",
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
