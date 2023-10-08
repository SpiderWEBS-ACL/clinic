import React, { useState } from "react";
import axios from "axios";

interface FormData {
  Name: string;
  SubscriptionPrice: number;
  DoctorDiscount: number;
  PharmacyDiscount: number;
  FamilyDiscount: number;
  [key: string]: string | number;
}

const AddPackage: React.FC = () => {
  const initialFormData: FormData = {
    Name: "",
    SubscriptionPrice: 0,
    DoctorDiscount: 0,
    PharmacyDiscount: 0,
    FamilyDiscount: 0,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Name" ? value : parseFloat(value),
    });
    setFormErrors({ ...formErrors, [name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Partial<FormData> = {};
    for (const key in formData) {
      if (!formData[key]) {
        errors[key] = "This field is required";
      }
    }
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/addPackage",
        formData
      );
      console.log("Response:", response.data);

      // Clear the form
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Add Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Name:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            className="form-control"
            value={formData.Name}
            onChange={handleChange}
            required
          />
          {formErrors.Name && (
            <span className="text-danger">{formErrors.Name}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="SubscriptionPrice">Subscription Price:</label>
          <input
            type="number"
            id="SubscriptionPrice"
            name="SubscriptionPrice"
            className="form-control"
            value={formData.SubscriptionPrice}
            onChange={handleChange}
            required
          />
          {formErrors.SubscriptionPrice && (
            <span className="text-danger">{formErrors.SubscriptionPrice}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="DoctorDiscount">Doctor Discount:</label>
          <input
            type="number"
            id="DoctorDiscount"
            name="DoctorDiscount"
            className="form-control"
            value={formData.DoctorDiscount}
            onChange={handleChange}
            required
          />
          {formErrors.DoctorDiscount && (
            <span className="text-danger">{formErrors.DoctorDiscount}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="PharmacyDiscount">Pharmacy Discount:</label>
          <input
            type="number"
            id="PharmacyDiscount"
            name="PharmacyDiscount"
            className="form-control"
            value={formData.PharmacyDiscount}
            onChange={handleChange}
            required
          />
          {formErrors.PharmacyDiscount && (
            <span className="text-danger">{formErrors.PharmacyDiscount}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="FamilyDiscount">Family Discount:</label>
          <input
            type="number"
            id="FamilyDiscount"
            name="FamilyDiscount"
            className="form-control"
            value={formData.FamilyDiscount}
            onChange={handleChange}
            required
          />
          {formErrors.FamilyDiscount && (
            <span className="text-danger">{formErrors.FamilyDiscount}</span>
          )}
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
