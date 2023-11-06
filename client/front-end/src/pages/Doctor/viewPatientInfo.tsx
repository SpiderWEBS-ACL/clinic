import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewPatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem("accessToken");

  const [patientInfo, setPatientInfo] = useState<any>({});

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    getPatientInfo();
  }, [id]);

  const getPatientInfo = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    await api
      .get(`/doctor/viewPatientInfo/${id}`, config)
      .then((response) => {
        setPatientInfo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Patient Information</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {patientInfo.Name}</h5>
          <p className="card-text">
            DOB:{" "}
            {patientInfo.Dob == null
              ? patientInfo.Dob
              : patientInfo.Dob.substring(0, 10)}
          </p>
          <p className="card-text">Gender: {patientInfo.Gender}</p>
          <p className="card-text">Mobile: {patientInfo.Mobile}</p>
          <p className="card-text">
            Emergency Contact Name: {patientInfo.EmergencyContactName}
          </p>
          <p className="card-text">
            Emergency Contact Number: {patientInfo.EmergencyContactMobile}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientInfo;
