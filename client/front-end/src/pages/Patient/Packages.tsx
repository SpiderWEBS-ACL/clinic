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
  Spin,
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
import Package from "../../components/Package";

const AllPackagesPatient = () => {
  const [Packages, setPackages] = useState<any[]>([]);
  const [SubscribedPackageId, setSubscribedPackageId] = useState("");
  const [SubscriptionPrice, setSubscriptionPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [PackageId, setPackageId] = useState("");
  const [loading, setLoading] = useState(true);
  const { Meta } = Card;
  const [subscribedPackage, setSubscribedPackage] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);


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
      console.log(subscribedPackage);
      setLoading(false);
      
    const subscription = await getSubscription();
    setSubscribedPackage(subscription);

      const currentBalance = await getBalance();
      setBalance(currentBalance.data);
      setLoading(false);
      console.log("PACKAGES", Packages);
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
  const handleUnsubscribe = async () => {
    await cancelSubscription();
    setLoading(true);
    window.location.reload();
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
      <h2 className="text-center mt-4 mb-4">Health Package</h2>

      <tbody
        style={{ display: "flex", justifyContent: "center", marginTop: 60 }}
      >
        {Packages.map(
          (request, index) =>
            index % 4 === 0 && (
              <Row gutter={16} key={index}>
                {Packages.slice(index, index + 4).map((request, subIndex) => (
                  <Col span={8} key={subIndex}>
                    <div style={{ marginRight: 50 }}>
                      <Package
                        packageName={request.Name}
                        packageDescription={
                          "This plan is for those who have a team already and running a large business."
                        }
                        subscriptionPrice={request?.SubscriptionPrice + "$"}
                        doctorDiscount={`${request.DoctorDiscount}%`}
                        pharmacyDiscount={`${request.PharmacyDiscount}%`}
                        familyDiscount={`${request.FamilyDiscount}%`}
                        status={
                          request._id == SubscribedPackageId
                            ? `
                            ${subscribedPackage.Status}`
                            : "Unsubscribed"
                        }
                        btnSubscribeText={
                          request._id == SubscribedPackageId &&
                          subscribedPackage.Status == "Subscribed" ? (
                            <CheckCircleOutlined />
                          ) : (
                            "Subscribe"
                          )
                        }
                        statusColor={
                          request._id == SubscribedPackageId
                            ? "#008000"
                            : "#ff0000"
                        }
                        onClickBtn={function (): void {
                          handleSubscribe(
                            request._id,
                            request.SubscriptionPrice
                          );
                        }}
                        disabledBtn={
                          SubscribedPackageId != "" ||
                          (subscribedPackage.Status == "Cancelled" &&
                            request._id == SubscribedPackageId)
                        }
                        onClickCancel={showPopconfirm}
                        extraInfo={
                          request._id == SubscribedPackageId &&
                          subscribedPackage.Status == "Subscribed"
                            ? `Renewal Date: ${
                                subscribedPackage.Date.split("T")[0]
                              }`
                            : request._id == SubscribedPackageId &&
                              subscribedPackage.Status == "Cancelled"
                            ? `End Date: ${
                                subscribedPackage.Date.split("T")[0]
                              }`
                            : ""
                        }
                      ></Package>


                      {/* </Badge.Ribbon>  */}
                    </div>
                  </Col>
                ))}
              </Row>
            )
        )}
      </tbody>
      <Modal
              title="ALERT"
              open={open}
              okButtonProps={{ loading: confirmLoading }}
              onCancel={handleCancel}
              footer = {
                <div>
                  <Button
                  
                  type="primary"
                  onClick={()=>{handleOk}
                }
                  >
                    Confirm
                  </Button>
                 
                </div>
              }
            >
             <h4> Are you sure you want to Cancel?</h4>
            </Modal>
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
