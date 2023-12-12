import { useState, useEffect } from "react";
import {
  Popconfirm,
  Button,
  Card,
  List,
  Row,
  Col,
  Modal,
  message,
  Badge,
} from "antd";
import { useNavigate } from "react-router-dom";

import {
  CheckCircleOutlined,
  CreditCardFilled,
  WalletFilled,
} from "@ant-design/icons";
import { Avatar } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { green } from "@mui/material/colors";
import { subscribeWithStripeApi } from "../../apis/Patient/Packages/SubscribeWithStripe";
import { subscribeWithWalletApi } from "../../apis/Patient/Packages/SubscribeWithWallet";
import { getAllPackages } from "../../apis/Patient/Packages/GetAllPackages";
import { getSubscribedPackage } from "../../apis/Patient/Packages/GetSubscribedPackage";
import { getSubscription } from "../../apis/Patient/Packages/GetSubscription";
import { getBalance } from "../../apis/Patient/GetBalance";
import { cancelSubscription } from "../../apis/Patient/Packages/CancelSubscription";

const AllPackagesPatient = () => {
  const [Packages, setPackages] = useState<any[]>([]);
  const [SubscribedPackageId, setSubscribedPackageId] = useState("");
  const [SubscriptionPrice, setSubscriptionPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [PackageId, setPackageId] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { Meta } = Card;
  const [subscribedPackage, setSubscribedPackage] = useState<any>([]);

  const redirectToStripe = async (id: string) => {
    try {
      try {
        const response = await subscribeWithStripeApi(id);
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
        await subscribeWithWalletApi(id);
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
    setShowPaymentModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const packages = await getAllPackages();
      setPackages(packages);
      setLoading(false);

      const subscribedPackage = await getSubscribedPackage();
      setSubscribedPackageId(subscribedPackage);
      setLoading(false);

      const subscription = await getSubscription();
      setSubscribedPackage(subscription);

      const currentBalance = await getBalance();
      setBalance(currentBalance.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleSubscribe = async (id: string, SubscriptionPrice: number) => {
    localStorage.setItem("packageId", id);
    setShowPaymentModal(true);
    setPackageId(id);
    setSubscriptionPrice(SubscriptionPrice);
  };
  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      handleUnsubscribe();
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleUnsubscribe = async () => {
    await cancelSubscription();
    setLoading(true);
    window.location.reload();
  };
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Health Package</h2>

      <tbody>
        {Packages.map(
          (request, index) =>
            index % 4 === 0 && (
              <Row gutter={16} key={index}>
                {Packages.slice(index, index + 4).map((request, subIndex) => (
                  <Col span={8} key={subIndex}>
                    <div>
                      {/* <Badge.Ribbon  text = "Best Value" color="red"> */}
                      <Card
                        style={{
                          height: "23rem",
                          width: "24rem",
                          marginTop: 16,
                          marginLeft:16
                        }}
                        loading={loading}
                        hoverable
                        className="hover-card"
                      >
                        <Meta
                          avatar={
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: green[500]
                              }}
                            >
                              {" "}
                              <AssignmentIcon />
                            </Avatar>
                          }
                          title={
                            <div style={{ fontSize: "20px" }}>
                              {request.Name}
                            </div>
                          }
                          description={
                            <div>
                              <strong>Subscription Price:</strong>{" "}
                              {request.SubscriptionPrice}
                              <br></br>
                              <br></br>
                              <strong>Doctor Discount:</strong>{" "}
                              {request.DoctorDiscount}%<br></br>
                              <br></br>
                              <strong>Pharmacy Discount:</strong>{" "}
                              {request.PharmacyDiscount}%<br></br>
                              <br></br>
                              <strong>Family Discount:</strong>{" "}
                              {request.FamilyDiscount}%<br></br>
                              <br></br>
                              {request._id == SubscribedPackageId
                                ? `Status:
                                  ${subscribedPackage.Status}`
                                : "Status: Unsubscribed"}
                              <br></br>
                              <br></br>
                              {request._id == SubscribedPackageId &&
                              subscribedPackage.Status == "Subscribed"
                                ? `Renewal Date:${
                                    subscribedPackage.Date.split("T")[0]
                                  }`
                                : request._id == SubscribedPackageId &&
                                  subscribedPackage.Status == "Cancelled"
                                ? `End Date:${
                                    subscribedPackage.Date.split("T")[0]
                                  }`
                                : ""}
                            </div>
                          }
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className={
                              (request._id === SubscribedPackageId &&
                                subscribedPackage.Status == "Subscribed") ||
                              SubscribedPackageId === ""
                                ? "btn btn-sm btn-success"
                                : "btn btn-sm btn-secondary"
                            }
                            disabled={
                              SubscribedPackageId != "" ||
                              (subscribedPackage.Status == "Cancelled" &&
                                request._id == SubscribedPackageId)
                            }
                            onClick={() =>
                              handleSubscribe(
                                request._id,
                                request.SubscriptionPrice
                              )
                            }
                          >
                            {request._id == SubscribedPackageId &&
                            subscribedPackage.Status == "Subscribed" ? (
                              <CheckCircleOutlined />
                            ) : (
                              "Subscribe"
                            )}
                          </button>

                          <Popconfirm
                            title="ALERT"
                            description="Are you sure you want to unsubscribe?"
                            open={open}
                            onConfirm={handleOk}
                            okButtonProps={{ loading: confirmLoading }}
                            onCancel={handleCancel}
                          >
                            <button
                              className="btn btn-sm btn-danger"
                              hidden={
                                request._id != SubscribedPackageId ||
                                subscribedPackage.Status == "Cancelled"
                              }
                              onClick={showPopconfirm}
                            >
                              Cancel Subscription
                            </button>
                          </Popconfirm>
                        </div>
                      </Card>
                      {/* </Badge.Ribbon>  */}
                    </div>
                  </Col>
                ))}
              </Row>
            )
        )}
      </tbody>

      <Modal
        title="Select Payment Method"
        open={showPaymentModal}
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
