import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Layout, message, Button, Input, Select, DatePicker } from "antd";

import Cookies from "js-cookie";
import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import dayjs from "dayjs";

const Register: React.FC = () => {
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>("");
  const [Dob, setDob] = useState<string>("");
  const [Mobile, setMobile] = useState<string>("");
  const [EmergencyContactName, setEmergencyContactName] = useState<string>("");
  const [EmergencyContactMobile, setEmergencyContactMobile] =
    useState<string>("");
  const [EmergencyContactRelation, setEmergencyContactRelation] =
    useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });
  const { Option } = Select;

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });


  const validateEmail = (email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      message.error("Invalid email address");
      return false;
    }
    return true;
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      message.error("Password should contain at least 1 capital letter, 1 small letter, 1 number, and be at least 6 characters long");
      return false;
    }
    return true;
  };

  const validateDOB = (dob: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 16) {
      message.error("You must be at least 16 years old");
      return false;
    }
    return true;
  };
  const handleSignUp = async () => {
    // Placeholder validation, replace with your actual validation logic
    if (
      !Name ||
      !Email ||
      !Password ||
      !Username ||
      !Gender ||
      !Dob ||
      !Mobile
    ) {
      message.error("Please Fill In All Requirements");
      return;
    }
    if (
      validateEmail(Email) &&
      validatePassword(Password) &&
      validateDOB(Dob)){

    try {
      // Your sign-up logic here
      const data = {
        Name,
        Email,
        Password,
        Username,
        Dob,
        Gender,
        Mobile,
        EmergencyContact: {
          Name: EmergencyContactName,
          Mobile: EmergencyContactMobile,
          relationToPatient: EmergencyContactRelation,
        },
      };

      const response = await api.post(`/patient/register`, data);
      console.log("Response:", response.data);
      message.success("Congrats, you are in!");
      navigate(`http://localhost:5174/regLog`);
      window.location.reload();
    } catch (error: any) {
      console.error("Error:", error);
      message.error(`${error.response.data.error}`);
    }
  }
  };

  const handleRegisterDoctor = () => {
    navigate("/doctor/register");
    window.location.reload();
  };

  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    navigate(`http://localhost:5174/regLog`);
    window.location.reload();
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleDobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue.trim() === "") {
      setError("Date of Birth is required");
    } else {
      setError(null);
    }
    setDob(inputValue);
  };

  const prefixSelector = (
    <Select style={{ width: 70 }}
    defaultValue={"+20"}>
      <Option value="20">+20</Option>
    </Select>
  );

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          {/* Left Column */}
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <img src="/2.png" alt="ren" width="740vh" />
          </div>
        </MDBCol>
        <MDBCol col="6" className="mb-5">
          {/* Right Column */}
          <div className="d-flex flex-column ms-4" style={{ width: "80%" }}>
            <div className="text-center">
              <img src="/logo.png" style={{ width: "90px" }} alt="logo" />
            </div>
            <h3 style={{ alignSelf: "center" }}>Time to feel like home</h3>
            <br />

            {/* Input Fields */}
            <div className="d-flex flex-row flex-wrap">
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="name"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  onBlur={() => handleBlur("name")}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  onBlur={() => handleBlur("email")}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Password
                </label>
                <Input.Password
                  id="password"
                  type="password"
                  onBlur={() => handleBlur("password")}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="username"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  onBlur={() => handleBlur("username")}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="gender"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Gender
                </label>
                <Select
                  style={{ width: "12.8rem" }}
                  onChange={(value) => setGender(value)}
                  placeholder="select your gender"
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="dob"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Date of Birth
                </label>
                <DatePicker
                  value={Dob ? dayjs(Dob) : undefined}
                  onChange={(date, dateString) => {
                    if (dateString) {
                      setDob(dateString);
                    }
                  }}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="mobile"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Mobile
                </label>

                <Input
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="emergencyContactName"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Emergency Contact Name
                </label>
                <Input
                  id="emergencyContactName"
                  type="text"
                  onBlur={() => handleBlur("emergencyContactName")}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="emergencyContactMobile"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Emergency Contact Mobile
                </label>
                <Input
                  addonBefore={prefixSelector}
                  id="emergencyContactMobile"
                  type="text"
                  onBlur={() => handleBlur("emergencyContactMobile")}
                  onChange={(e) => setEmergencyContactMobile(e.target.value)}
                />
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="emergencyContactRelation"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Emergency Contact Relation
                </label>
                <Select
                  style={{ width: "12.8rem" }}
                  onChange={(value) => setGender(value)}
                  placeholder="select your gender"
                >
                  <Option value="Male">Husband</Option>
                  <Option value="Female">Wife</Option>
                  <Option value="Male">Son</Option>
                  <Option value="Female">Daughter</Option>
                </Select>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center pt-1 mb-1 pb-1">
              <Button
                className="mb-3 w-100"
                onClick={handleSignUp}
                type="primary"
              >
                Register
              </Button>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-3 mb-3">
              <p className="mb-0">Doctor?</p>
              <Button
                type="dashed"
                danger
                style={{ marginLeft: "10px" }}
                onClick={handleRegisterDoctor}
              >
                Register as Doctor
              </Button>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center pb-3 mb-3">
              <label style={{ marginRight: 5 }}>Already Registered? </label>
              <a href="/"> Login</a>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
