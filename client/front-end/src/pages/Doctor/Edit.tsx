import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { Spin } from "antd";
import { message } from "antd";

const EditDoctor = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [Username, setUsername] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Name, setName] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Dob, setDob] = useState(new Date());
  const [HourlyRate, setHourlyRate] = useState<number>(0);
  const [Affiliation, setAffiliation] = useState<string>("");
  const [EducationalBackground, setEducationalBackground] =
    useState<string>("");
  const [Specialty, setSpecialty] = useState<string>("");
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    api
      .get(`/doctor/getDoctor/`, config)
      .then((response) => {
        setUsername(response.data.Username);
        setName(response.data.Name);
        setEmail(response.data.Email);
        setPassword(response.data.Password);
        setDob(new Date(response.data.Dob));
        setHourlyRate(response.data.HourlyRate);
        setAffiliation(response.data.Affiliation);
        setEducationalBackground(response.data.EducationalBackground);
        setSpecialty(response.data.Specialty);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = {
        Email,
        HourlyRate,
        Affiliation,
      };
      const response = await api.put(`/doctor/update/${id}`, data);
      message.success("Your info was updated successfully");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update your info");
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Update Info</h1>
          <form onSubmit={handleSubmit}>
            <InputField
              id="Username"
              label="Username"
              type="text"
              value={Username}
              onChange={setUsername}
              disabled={true}
            ></InputField>

            <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
              disabled={true}
            ></InputField>
            <InputField
              id="Email"
              label="Email"
              type="text"
              value={Email}
              onChange={setEmail}
            ></InputField>
            <InputField
              id="Dob"
              label="Dob"
              type="Text"
              value={Dob}
              onChange={setDob}
              disabled={true}
            ></InputField>
            <InputField
              id="HourlyRate"
              label="HourlyRate"
              type="number"
              value={HourlyRate}
              onChange={setHourlyRate}
            ></InputField>
            <InputField
              id="Affiliation"
              label="Affiliation"
              type="Text"
              value={Affiliation}
              onChange={setAffiliation}
            ></InputField>
            <InputField
              id="EducationalBackground"
              label="Educational Background"
              type="Text"
              value={EducationalBackground}
              onChange={setEducationalBackground}
              disabled={true}
            ></InputField>
            <InputField
              id="Specialty"
              label="Specialty"
              type="Text"
              value={Specialty}
              onChange={setAffiliation}
              disabled={true}
            ></InputField>

            <button
              className="btn btn-primary"
              style={{ marginRight: "10px", marginTop: "10px" }}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;
