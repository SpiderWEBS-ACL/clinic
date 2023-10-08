import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const UpdatePackage = () => {
  const { id } = useParams<{ id: string }>();

  const [Name, setName] = useState<string>("");
  const [SubscriptionPrice, setSubscriptionPrice] = useState<number>(0);
  const [DoctorDiscount, setDoctorDiscount] = useState<number | undefined>();
  const [PharmacyDiscount, setPharmacyDiscount] = useState<
    number | undefined
  >();
  const [familyDiscount, setFamilyDiscount] = useState<number | undefined>();
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/admin/package/${id}`)
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
  }, [id]);

  const handleSubmit = async () => {
    try {
      const data = {
        Name,
        SubscriptionPrice,
        DoctorDiscount,
        PharmacyDiscount,
        familyDiscount,
      };
      const response = await api.put(`/admin/updatePackage/${id}`, data);
      console.log("Response:", response.data);
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Update Package</h1>
          <form>
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
              value={familyDiscount || 0}
              onChange={setFamilyDiscount}
            ></InputField>

            <Button
            onClick={handleSubmit}
            >Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePackage;

