import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { message } from "antd";

const AddPackage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [Name, setName] = useState<string>("");
  const [SubscriptionPrice, setSubscriptionPrice] = useState<
    number | undefined
  >();
  const [DoctorDiscount, setDoctorDiscount] = useState<number | undefined>();
  const [PharmacyDiscount, setPharmacyDiscount] = useState<
    number | undefined
  >();
  const [FamilyDiscount, setFamilyDiscount] = useState<number | undefined>();
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        Name,
        SubscriptionPrice,
        DoctorDiscount,
        PharmacyDiscount,
        FamilyDiscount,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await api.post(`/admin/addPackage`, data, { headers });
      message.success("Package added Successfully");
    } catch (error) {
      console.error("Error:", error);
      message.success("Something happened please try again!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Add Package</h1>
          <form>
            <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
              required={true}
            ></InputField>

            <InputField
              id="SubscriptionPrice"
              label="Subscription Price"
              type="number"
              value={SubscriptionPrice}
              onChange={setSubscriptionPrice}
              required={true}
            ></InputField>

            <InputField
              id="DoctorDiscount"
              label="Doctor Discount"
              type="number"
              value={DoctorDiscount}
              onChange={setDoctorDiscount}
              required={true}
            ></InputField>

            <InputField
              id="PharmacyDiscount"
              label="Pharmacy Discount"
              type="number"
              value={PharmacyDiscount}
              onChange={setPharmacyDiscount}
              required={true}
            ></InputField>

            <InputField
              id="FamilyDiscount"
              label="Family Discount"
              type="number"
              value={FamilyDiscount}
              onChange={setFamilyDiscount}
              required={true}
            ></InputField>

            <button
              className="btn btn-primary"
              style={{ marginRight: "10px", marginTop: "10px" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
