import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const RegistrationRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [registrationDetails, setRegistrationDetails] = useState<any>("");
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/admin/registrationRequest/${id}`)
      .then((response) => {
        setRegistrationDetails(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  console.log(registrationDetails);

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Registration Request Details</h2>
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
          </tr>
        </thead>

        <tbody>
          <tr key={registrationDetails._id}>
            <td>{registrationDetails.Name}</td>
            <td>{registrationDetails.Affiliation}</td>
            <td>{registrationDetails.Email}</td>
            <td>{registrationDetails.Dob}</td>
            <td>{registrationDetails.HourlyRate}</td>
            <td>{registrationDetails.Affiliation}</td>
            <td>{registrationDetails.Specialty}</td>
            <td>{registrationDetails.EducationalBackground}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationRequestDetails;
