import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { config, headers } from "../../Middleware/authMiddleware";
import { Spin, message } from "antd";

const Success: React.FC = () => {
  const api = axios.create({
    baseURL: "http://localhost:5000/cart",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const shipping = searchParams.get("shipping");

  // const shipping = session.metadata.shipping;

  useEffect(() => {
    try {
      api
        .post("/placeOrder", { shipping, paymentMethod: "Card" }, config)
        .then((response) => {
          window.location.href = `http://localhost:5174/patient/viewOrder/${response.data._id}`;
          //   window.location.href = response.data.url;
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

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
};

export default Success;
