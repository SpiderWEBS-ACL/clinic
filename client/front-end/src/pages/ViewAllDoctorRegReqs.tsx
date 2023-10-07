import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewAllRegReqs: React.FC = () => {
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get("/admin/registrationRequests")
      .then((response) => {
        setRegistrationRequests(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Registration Requests</h2>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <ul className="list-group">
            {registrationRequests.map((request: any) => (
              <li key={request._id} className="list-group-item">
                <strong>Username:</strong> {request.Username}
                <br />
                <strong>Name:</strong> {request.Name}
                <br />
                <strong>Email:</strong> {request.Email}
                <br />
                <strong>Date of Birth:</strong>{" "}
                {new Date(request.Dob).toLocaleDateString()}
                <br />
                <strong>Hourly Rate:</strong> ${request.HourlyRate}
                <br />
                <strong>Affiliation:</strong> {request.Affiliation}
                <br />
                <strong>Educational Background:</strong>{" "}
                {request.EducationalBackground}
                <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewAllRegReqs;
