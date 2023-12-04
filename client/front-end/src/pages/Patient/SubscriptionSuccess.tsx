import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config, headers } from "../../Middleware/authMiddleware";
import { addSubscriptionPatient } from "../../apis/Patient/Packages/AddSubscription";

const SubscriptionSuccess = () => {
  const packageId = localStorage.getItem("packageId");
  const navigate = useNavigate();

  const addSubscription = async () => {
    try {
      await addSubscriptionPatient(packageId);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    addSubscription();    
    navigate("/patient/packages");
    window.location.reload();
  }, []);
  return <div></div>;
};

export default SubscriptionSuccess;
