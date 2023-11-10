import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config, headers } from "../../Middleware/authMiddleware";

const SubscriptionSuccess = () => {
  const packageId = localStorage.getItem("packageId");
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    console.log("Here");
    api.post(
      "/subscription/add",
      { packageId: packageId },
      { headers: headers }
    );
    navigate("/patient/packages");
  }, []);
  return <div>SubscriptionSuccess</div>;
};

export default SubscriptionSuccess;
