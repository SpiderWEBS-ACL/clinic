import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spin, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { JwtPayload } from "../../AppRouter";
import jwt_decode from "jwt-decode";
import { config } from "../../Middleware/authMiddleware";

const AllPackagesPatient = () => {
  const [Packages, setPackages] = useState([]);
  const [SubscribedPackageId, setSubscribedPackageId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [PackageId, setPackageId] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  const accessToken = Cookies.get("accessToken");

  let patientId = "";

  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    patientId = decodedToken.role as string;
  }

  const redirectToStripe = async (id: string) => {
    try {
      try {
        const response = await api.post("subscription/subscribe/" + patientId, {
          packageId: id,
        });
        window.location.href = response.data.url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handlePaymentSelection = (paymentMethod: string) => {
    if (paymentMethod === "Card") {
      redirectToStripe(PackageId);
    }
    console.log("Selected payment method: ", paymentMethod);
    setShowPaymentModal(false);
  };

  useEffect(() => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    api
      .get("patient/allPackages", { headers })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    api.get("patient/subscribedPackage", config).then((response) => {
      setSubscribedPackageId(response.data);
      setLoading(false);
      console.log(response.data);
    });
  }, []);
  const navigate = useNavigate();
  const handleRedirect = async (id: string) => {
    navigate("/admin/editPackage/" + id);
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
  const handleSubscribe = async (id: string) => {
    localStorage.setItem("packageId", id);
    setShowPaymentModal(true);
    setPackageId(id);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Health Packages</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>Doctor Discount</th>
            <th>Pharmacy Discount</th>
            <th>Family Discount</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {Packages.map((request: any, index) => (
            <tr key={request._id}>
              <td>
                <strong>{request.Name}</strong>
              </td>
              <td>{request.SubscriptionPrice / 100}</td>
              <td>{request.DoctorDiscount}%</td>
              <td>{request.PharmacyDiscount}%</td>
              <td>{request.FamilyDiscount}%</td>
              <td>
                <button
                  className={
                    request._id == SubscribedPackageId
                      ? "btn btn-sm btn-success"
                      : "btn btn-sm btn-secondary"
                  }
                  disabled={SubscribedPackageId != ""}
                  onClick={() => handleSubscribe(request._id)}
                >
                  {request._id == SubscribedPackageId
                    ? "Subscribed"
                    : "Subscribe "}
                </button>
                <button
                  style={{ marginLeft: "1rem" }}
                  className="btn btn-sm btn-danger"
                  hidden={request._id != SubscribedPackageId}
                >
                  Cancel Subscription
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title="Select Payment Method"
        visible={showPaymentModal}
        onCancel={() => {
          setShowPaymentModal(false);
        }}
        footer={null}
      >
        <Button
          type="primary"
          block
          style={{ marginBottom: "8px" }}
          onClick={() => handlePaymentSelection("Wallet")}
        >
          Wallet
        </Button>
        <Button
          type="primary"
          block
          onClick={() => handlePaymentSelection("Card")}
        >
          Card
        </Button>
      </Modal>
    </div>
  );
};

export default AllPackagesPatient;
