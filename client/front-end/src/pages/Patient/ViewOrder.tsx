import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { format } from "date-fns";
import { Card, Spin, message } from "antd";
import { JwtPayload, config, headers } from "../../Middleware/authMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useForceUpdate } from "@chakra-ui/react";
import { fillPrescriptionApi } from "../../apis/Patient/Prescriptions/FillPrescription";

type OrderItem = {
  medicine: string;
  quantity: number;
};

type MedicineItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const viewOrder: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  let pid = "";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    pid = decodedToken.id as string;
  }
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });
  const fillPrescription = async () => {
    await fillPrescriptionApi(localStorage.getItem("PrescriptionId") + "");
  };

  useEffect(() => {
    fillPrescription();
    api
      .get(`/patient/viewOrder/${id}`, config)
      .then((response) => {
        setOrder(response.data);
        setOrderItems(response.data.Medicines);
        console.log("RES:", response.data.Medicines);

        if (response.data.Medicines.length > 0) {
          const medicineEntries = response.data.Medicines.map(
            (item: { medicine: any; quantity: any }) => ({
              medicine: item.medicine,
              quantity: item.quantity,
            })
          );
          console.log("MEDS: ", medicineEntries);

          setMedicines(medicineEntries);
          setTotal(response.data.TotalPrice);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (axios.isAxiosError(error) && error.response) {
          const apiError = error.response.data;
          setError(apiError);
        } else {
          setError("An error occurred");
        }
      });
  }, [orderItems.length, refreshData]);

  const handleCancel = async () => {
    try {
      if (order.Status == "Shipped") {
        message.error("Order cannot be cancelled after it has been shipped.");
        return;
      }

      setLoading(true);
      await api.put(`/patient/cancelOrder/${id}`, {}, config);
      setRefreshData(!refreshData);
      message.success(
        "Order Cancelled! " +
          (order.PaymentMethod == "Cash On Delivery"
            ? ""
            : "Your money has been refunded to your wallet")
      );
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data;
        setError(apiError);
      } else {
        setError("An error occurred");
      }
    }
    setLoading(false);
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

  return (
    <div className="container">
      <div style={{ textAlign: "center" }}>
        <h2 className="text-center mt-4 mb-4">
          <strong>Thank You, {order.Patient.Name}</strong>
          <br />
        </h2>
        <h4 className="text-center mt-4 mb-4">Order #{id}</h4>
        <h5
          style={{
            color:
              order.Status == "Cancelled"
                ? "red"
                : order.Status == "Shipped"
                ? "green"
                : "black",
          }}
        >
          Your Order Is{" "}
          <span>
            {order.Status == "Shipped" ? "On It's Way!" : order.Status}
          </span>
        </h5>
      </div>

      <Card>
        <table className="table">
          <thead>
            <tr style={{ fontSize: 20 }}>
              <th></th>
              <th>Medicine Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((request: any, index) => {
              return (
                <tr key={request._id} style={{ verticalAlign: "middle" }}>
                  <td>
                    <img
                      src={
                        request.medicine.Image
                          ? `/images/${request.medicine.Image.filename}`
                          : request.medicine.imageURL
                      }
                      width={100}
                      height={100}
                    ></img>
                  </td>
                  <td width={500}>
                    <strong style={{ fontSize: 18 }}>
                      {request.medicine.Name}
                    </strong>
                    <br></br>
                    {request.medicine.Description}
                  </td>
                  <td style={{ fontSize: 16, fontWeight: "bold" }}>
                    {request.medicine.Price} USD
                  </td>
                  <td style={{ fontSize: 16, textAlign: "center" }}>
                    x{request.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <br />

      <Card
        style={{ width: "75%" }}
        title={
          <h4 style={{ marginBottom: -5 }}>
            <b>Order Details</b>
          </h4>
        }
      >
        <Row>
          <Col>
            <h6>
              <b>Contact Information: </b>
            </h6>
            &emsp; <b>Email: </b>
            {order.Patient.Email} <br />
            &emsp; <b>Mobile: </b>
            {order.Patient.Mobile} <br />
            <br />
          </Col>
          <Col>
            <h6>
              <b>Order Status: </b>
              <span
                style={{
                  color:
                    order.Status == "Cancelled"
                      ? "red"
                      : order.Status == "Shipped"
                      ? "green"
                      : "black",
                }}
              >
                <i>{order.Status}</i>
              </span>
            </h6>
            <h6>
              <b>Payment Method: </b>
              {order.PaymentMethod}
            </h6>
            <h6>
              <b>Delivery Address: </b>
              {order.DeliveryAddress}
            </h6>
            <br />
          </Col>
        </Row>
        <div style={{ textAlign: "right" }}>
          <strong style={{ fontSize: 20 }}> Total: {total} USD </strong>
        </div>
      </Card>

      <div style={{ display: "flex" }}>
        <button
          style={{ marginLeft: "auto", marginRight: "20px" }}
          className="btn btn-danger"
          type="button"
          onClick={handleCancel}
          hidden={order.Status == "Cancelled" ? true : false}
        >
          Cancel Order
        </button>
      </div>
      <br />
    </div>
  );
};

export default viewOrder;
