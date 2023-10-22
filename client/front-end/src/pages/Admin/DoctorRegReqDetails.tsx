import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import Button from "../../components/Button";

const RegistrationRequestDetails = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [registrationDetails, setRegistrationDetails] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:8000",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    api
      .get("/admin/registrationRequest/" + id, { headers })
      .then((response) => {
        setRegistrationDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  console.log(registrationDetails);

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
  const handleBack = async () => {
    navigate("/admin/registrationRequests");
  };

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
            <th>Accept</th>
            <th>Reject</th>
          </tr>
        </thead>

        <tbody>
          <tr key={registrationDetails._id}>
            <td>{registrationDetails.Name}</td>
            <td>{registrationDetails.Affiliation}</td>
            <td>{registrationDetails.Email}</td>
            <td>
              {registrationDetails.Dob == null
                ? registrationDetails.Dob
                : registrationDetails.Dob.substring(0, 10)}
            </td>
            <td>{registrationDetails.HourlyRate}</td>
            <td>{registrationDetails.Affiliation}</td>
            <td>{registrationDetails.Specialty}</td>
            <td>{registrationDetails.EducationalBackground}</td>
            <td>
              <button
                className="btn btn-sm btn-success"
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                }}
              >
                <span aria-hidden="true" style={{ color: "white" }}>
                  &#10003;
                </span>
              </button>
            </td>

            <td>
              <button
                className="btn btn-sm btn-danger"
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                }}
                //TODO onClick in sprint 2 this is just a view
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Button
        style={{ marginRight: "10px", marginTop: "10px" }}
        color="primary"
        onClick={handleBack}
      >
        Back
      </Button>
    </div>
  );
};

export default RegistrationRequestDetails;
