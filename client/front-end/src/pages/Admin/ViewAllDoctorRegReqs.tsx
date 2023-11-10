import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";

const AllDoctors = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:8000/admin",
  });

  useEffect(() => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    api
      .get("/registrationRequests", { headers })
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/admin/registrationRequests/" + id);
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

  const headers = {
    Authorization: "Bearer " + accessToken,
  };
  const handleAccept = (id: string) => {
    setLoading(true);
    try {
      api
        .get("/acceptRequest/" + id, { headers })
        .then(message.success("Registration Request Accepted!"));
    } catch (error) {
      message.error("An Error has occurred");
    }
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    api
      .delete("/rejectRequest/" + id, { headers })
      .then(message.success("Registration Request Rejected!"))
      .catch((error) => {
        message.error("An Error has occurred");
      });
    setLoading(false);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctors Registration Requests</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Accept</th>
            <th>Reject</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>
                <strong>{request.Name}</strong>
              </td>
              <td>
                {request.AdminAccept? 
                  request.DoctorReject? (<i style={{color: "red"}}>Employment Contract Rejected</i>) :
                  (<i style={{color: "green"}}>Employment Contract Sent. Pending Doctor Approval</i>) : 
                  (<i>Pending</i>) }
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  disabled={request.AdminAccept? true : false}
                  onClick={() => handleAccept(request._id)}
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
                  disabled={request.AdminAccept? true : false}
                  onClick={() => handleReject(request._id)}
                  //TODO onClick in sprint 2 this is just a view
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleViewDetails(request._id)}
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

export default AllDoctors;
