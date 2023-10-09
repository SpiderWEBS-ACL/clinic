import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ViewAllPatients = () => {
  const { id } = useParams<{ id: string }>();

  const [patients, setPatients] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/doctor/viewPatients/${id}`)
      .then((response) => {
        setPatients(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  const navigate = useNavigate();
  const handleRedirection = (item: any) => {
    navigate(`/doctor/viewPatientInfo/${item}`);
  };
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Patients</h2>
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>View Details</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((member: any, index) => (
            <tr key={index}>
              <td>
                <h4>{index + 1}</h4>
              </td>
              <td>
                <h4>{member.Name}</h4>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleRedirection(member._id)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllPatients;
