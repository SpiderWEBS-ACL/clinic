import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllRegReqs: React.FC = () => {
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const navigate = useNavigate();

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

  const handleItemSelect = (item: any) => {

    navigate(`/admin/registrationRequests/${item._id}`);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Registration Requests</h2>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <ul className="list-group">
            {registrationRequests.map((request: any) => (
              <li
                key={request._id}
                className="list-group-item"
                onClick={() => handleItemSelect(request)}
              >
                <strong>Name:</strong> {request.Name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewAllRegReqs;
