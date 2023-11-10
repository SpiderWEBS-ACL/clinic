import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spin, Modal, Row, Col, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { JwtPayload } from "../../AppRouter";
import jwt_decode from "jwt-decode";
import { config, headers } from "../../Middleware/authMiddleware";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  CreditCardFilled,
  WalletFilled,
} from "@ant-design/icons";
import { Avatar } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green } from '@mui/material/colors';


const AllPackagesPatient = () => {
  const [Packages, setPackages] = useState<any[]>([]);
  const [SubscribedPackageId, setSubscribedPackageId] = useState("");
  const [SubscriptionPrice, setSubscriptionPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [PackageId, setPackageId] = useState("");
  const { Meta } = Card;

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
  const payWithWallet = async (id: string) => {
    try {
      try {
        const response = await api.post(
          "subscription/subscribeWallet/" + patientId,
          {
            packageId: id,
          },
          { headers: headers }
        );
        navigate("/subscription/success");
        message.success("Subscribed Successfully!");
        window.location.reload();
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
    } else {
      payWithWallet(PackageId);
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
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    api.get("patient/subscribedPackage", config).then((response) => {
      setSubscribedPackageId(response.data);
      setLoading(false);
      console.log(response.data);
    });
    api
      .get("patient/getBalance", config)
      .then((response) => {
        setBalance(response.data);
        setLoading(false)

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const navigate = useNavigate();
  const handleRedirect = async (id: string) => {
    navigate("/admin/editPackage/" + id);
  };


  const handleSubscribe = async (id: string, SubscriptionPrice: number) => {
    localStorage.setItem("packageId", id);
    setShowPaymentModal(true);
    setPackageId(id);
    setSubscriptionPrice(SubscriptionPrice);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Health Packages</strong>
      </h2>
     

        <tbody>
           {Packages.map((request, index) => (
      index % 3 === 0  && (
        <Row gutter={16} key={index}>
          {Packages.slice(index, index + 3).map((request, subIndex) => (
            <Col span={8} key={subIndex}>
              <div>
              <Card
                style={{ height: 270, width: 400, marginTop: 16 }}
                loading={loading}
                hoverable
                className="hover-card"
              >
                <Meta
                  avatar={<Avatar sx={{ width: 50, height: 50, bgcolor: green[500] }}> <AssignmentIcon /></Avatar>}
                  title={<div style={{ fontSize: '20px' }}>{request.Name}</div>}
                  description={  <div>
                    <p><strong>Subscription Price:</strong> {request.SubscriptionPrice}</p>
                    <p><strong>Doctor Discount:</strong> {request.DoctorDiscount}</p>
                    <p><strong>Pharmacy Discount:</strong> {request.PharmacyDiscount}</p>
                    <p><strong>Family Discount:</strong> {request.FamilyDiscount}</p>
                  </div>}
                  
                  />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button
                  className="btn btn-sm btn-danger"
                  hidden={request._id != SubscribedPackageId}
                >
                  Cancel Subscription
                </button> 
                  <button
                  className={
                    request._id == SubscribedPackageId ||
                    SubscribedPackageId === ""
                      ? "btn btn-sm btn-success"
                      : "btn btn-sm btn-secondary"
                  }
                  disabled={SubscribedPackageId != ""}
                  onClick={() =>
                    handleSubscribe(request._id, request.SubscriptionPrice)
                  }
                >
                  {request._id == SubscribedPackageId ? (
                    <CheckCircleOutlined />
                  ) : (
                    "Subscribe "
                  )}
                </button>
               
                </div>
              </Card>
              </div>

            </Col>
          ))}
        </Row>
      )
    ))}
    </tbody>
      
             
        
      <Modal
        title="Select Payment Method"
        visible={showPaymentModal}
        onCancel={() => {
          setShowPaymentModal(false);
        }}
        footer={null}
      >
        <Button
          disabled={balance < SubscriptionPrice / 100}
          type="primary"
          block
          style={{ marginBottom: "8px" }}
          onClick={() => handlePaymentSelection("Wallet")}
        >
          <Row justify="center" align="middle">
            <Col>
              <WalletFilled />
            </Col>
            <Col style={{ marginLeft: 8, textAlign: "center" }}>
              {" "}
              Wallet (Balance: ${balance})
            </Col>
          </Row>
        </Button>
        <Button
          type="primary"
          block
          onClick={() => handlePaymentSelection("Card")}
        >
          <Row justify="center" align="middle">
            <Col>
              <CreditCardFilled />
            </Col>
            <Col style={{ marginLeft: 8, textAlign: "center" }}>Card</Col>
          </Row>
        </Button>
      </Modal>
    </div>
  
    );
};


export default AllPackagesPatient;
