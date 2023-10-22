import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { Spin } from "antd";
import { message } from "antd";
import { Navigate } from "react-router-dom";

const PackageView = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [Name, setName] = useState<string>("");
  const [SubscriptionPrice, setSubscriptionPrice] = useState<number>(0);
  const [DoctorDiscount, setDoctorDiscount] = useState<number | undefined>();
  const [PharmacyDiscount, setPharmacyDiscount] = useState<
    number | undefined
  >();
  const [FamilyDiscount, setFamilyDiscount] = useState<number | undefined>();
  const [Message, setMessage] = useState("");
  const [Alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    api
      .get(`/admin/package/${id}`, { headers })
      .then((response) => {
        setName(response.data.Name);
        setSubscriptionPrice(response.data.SubscriptionPrice);
        setDoctorDiscount(response.data.DoctorDiscount);
        setPharmacyDiscount(response.data.PharmacyDiscount);
        setFamilyDiscount(response.data.FamilyDiscount);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    event.preventDefault();
    try {
      const data = {
        Name,
        SubscriptionPrice,
        DoctorDiscount,
        PharmacyDiscount,
        FamilyDiscount,
      };
      const response = await api.put(`/admin/updatePackage/${id}`, data, {
        headers,
      });
      console.log("Response:", response.data);
      message.success("Package updated successfully");
      setAlert(true);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update package");
    }
  };

  const handleDelete = async () => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    try {
      const response = await api.delete(`/admin/deletePackage/${id}`, {
        headers,
      });
      console.log("Response:", response.data);
      message.success("Package deleted successfully");
      navigate("/admin/packages");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to delete package");
    }
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

  const handleBack = async () => {
    await navigate("/admin/Packages");
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Edit/Delete Package</h1>
          <form onSubmit={handleSubmit}>
            <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
            ></InputField>

            <InputField
              id="SubscriptionPrice"
              label="Subscription Price"
              type="number"
              value={SubscriptionPrice}
              onChange={setSubscriptionPrice}
            ></InputField>

            <InputField
              id="DoctorDiscount"
              label="Doctor Discount"
              type="number"
              value={DoctorDiscount || 0}
              onChange={setDoctorDiscount}
            ></InputField>

            <InputField
              id="PharmacyDiscount"
              label="Pharmacy Discount"
              type="number"
              value={PharmacyDiscount || 0}
              onChange={setPharmacyDiscount}
            ></InputField>

            <InputField
              id="FamilyDiscount"
              label="Family Discount"
              type="number"
              value={FamilyDiscount || 0}
              onChange={setFamilyDiscount}
            ></InputField>

            <button
              className="btn btn-primary"
              style={{ marginRight: "317px", marginTop: "10px" }}
              type="submit"
            >
              Submit
            </button>
            <button
              className="btn btn-primary"
              style={{ marginRight: "10px", marginTop: "10px" }}
              onClick={handleBack}
            >
              Back to All Packages
            </button>
          </form>
          <Button
            style={{ marginRight: "10px", marginTop: "10px" }}
            color="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageView;
