import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { set, setDate } from "date-fns";
import { useParams } from "react-router-dom";
import { DatePicker, DatePickerProps, Input, Select } from "antd";
import "./error-box.css";

const ViewPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setError] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(
    null
  );

  const { Option } = Select;
  const api = axios.create({
    baseURL: "http://localhost:8000/patient",
  });
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api
      .get(`/viewMyPrescriptions/${id}`)
      .then((response) => {
        setPrescriptions(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  const [Doctor, setDoctor] = useState("");
  const [Date, setDate] = useState("");
  const [Filled, setFilled] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDoctor(event.target.value);
  };
  const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };

  const filter = async () => {
    try {
      const response = await api.get("/filterPrescriptions", {
        params: {
          Doctor: Doctor,
          Filled: Filled,
          Date: Date,
          Patient: id,
        },
      });
      const data = response.data;
      if (data.length == 0) {
        console.log("no data");
        setError(true);
      } else {
        setError(false);
        setPrescriptions(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearFilter = async () => {
    try {
      const response = await api.get(`/viewMyPrescriptions/${id}`);
      setDoctor("");
      setFilled("");
      setError(false);
      setPrescriptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const viewDetails = async (prescId: String) => {
    try {
      const response = await api.get(`/selectPrescription/${prescId}`);
      setShowPopup(true);
      setSelectedPrescription(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Prescriptions</strong>
      </h2>
      <span>
        <label style={{ marginRight: 4, marginBottom: 20 }}>
          <strong>Doctor Name:</strong>
        </label>
        <Input
          type="text"
          value={Doctor}
          onChange={handleNameChange}
          style={{ width: 150, marginRight: 80 }}
        />
        <label style={{ marginRight: 8 }}>
          <strong>Filled/Unfilled:</strong>
        </label>
        <Select
          style={{ width: 150, marginRight: "50px" }}
          onChange={setFilled}
          value={Filled}
        >
          <Option value="Filled">Filled</Option>
          <Option value="Unfilled">Unfilled</Option>
                 
        </Select>
        <label style={{ marginLeft: 10 }}>
          <strong>Date:</strong>
        </label>
        <DatePicker
          onChange={handleDateChange}
          style={{ width: 150, marginLeft: "8px" }}
          allowClear
        />
        <button
          onClick={filter}
          style={{ width: 100, marginRight: 20, marginLeft: 180 }}
          className="btn btn-sm btn-primary"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilter}
          style={{ width: 150 }}
          className="btn btn-sm btn-primary"
        >
          Clear Filters
        </button>
                
      </span>

      {showError == true ? (
        <div className="error-box">
          <h2>Error!</h2>
          <p>No prescriptions found with the given criteria.</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Prescription ID</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {prescriptions.map((prescription: any, index) => (
              <tr key={prescription._id}>
                <td>Prescription #{index + 1}</td>
                <td className="text-end">
                  <button
                    onClick={() => viewDetails(prescription._id)}
                    style={{ width: 100 }}
                    className="btn btn-sm btn-primary"
                  >
                    <span aria-hidden="true"></span>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showPopup && selectedPrescription && (
        <div className="popup">
          <h3>Prescription Details</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Instruction</th>
                <th>Date</th>
                <th>Filled</th>
                <th>Doctor Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedPrescription.Medication}</td>
                <td>{selectedPrescription.Dosage}</td>
                <td>{selectedPrescription.Instructions}</td>
                <td>{selectedPrescription.Date.split("T")[0]}</td>
                <td>{selectedPrescription.Filled == "Filled"? "Yes":"No"}</td>
                <td>{selectedPrescription.DoctorName}</td>
              </tr>
            </tbody>
          </table>

          <button
            className="btn btn-sm btn-danger"
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
            onClick={() => setShowPopup(false)}
          >
            <span aria-hidden="true"></span>
            Hide
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewPrescriptions;
