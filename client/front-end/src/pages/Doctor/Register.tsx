import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoChevronBackCircle,
  IoChevronForwardCircle,
  IoCheckmarkDoneCircleSharp,
  IoAlertCircle,
  IoClose,
} from "react-icons/io5";
import { DatePicker, DatePickerProps, message, Button } from "antd";
import InputField from "../../components/InputField";
import {
  validatePassword,
  validateUsername,
} from "../../utils/ValidationUtils";

const steps = [
  { id: 1, title: "Account Info", fields: ["Username", "Password", "Email"] },
  {
    id: 2,
    title: "Personal Info",
    fields: ["Name", "Date of Birth", "Specialty"],
  },
  {
    id: 3,
    title: "Professional Info",
    fields: ["Hourly Rate", "Affiliation", "Educational Background"],
  },
];

function RegisterDoctor() {
  const [activeForm, setActiveForm] = useState(1);
  const [modalActive, setModalActive] = useState(false);
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [HourlyRate, setHourlyRate] = useState<number>();
  const [Dob, setDob] = useState<string>("");
  const [Affiliation, setAffiliation] = useState<string>("");
  const [EducationalBackground, setEducation] = useState<string>("");
  const [Specialty, setSpecialty] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://localhost:8000",
  });

  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault;

    if (activeForm == 3) {
      if (!HourlyRate || !Affiliation || !EducationalBackground) {
        message.error("Please Fill In All Requirements");
        return;
      }
    }

    try {
      const data = {
        Name,
        Email,
        Password,
        Username,
        Dob,
        HourlyRate,
        Affiliation,
        EducationalBackground,
        Specialty,
      };

      const response = await api.post(`/doctor/register`, data);
      console.log("Response:", response.data);
      setError(null);
      setModalActive(true);
      setTimeout(closeModal, 1500);
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        setError(apiError);
      } else {
        setError("An error occurred");
      }
      setModalActive(true);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDob(dateString);
  };

  const handleNext = () => {
    if (activeForm == 1) {
      if (!Username || !Password || !Email) {
        message.error("Please Fill In All Requirements");
        return;
      }

      const isUsernameValid = validateUsername(Username);
      const isPasswordValid = validatePassword(Password);

      if (!isUsernameValid || !isPasswordValid) {
        message.error(
          "Username and Password must meet the minimum requirements."
        );
        return;
      }
    }

    if (activeForm == 2) {
      if (!Name || !Dob) {
        message.error("Please Fill In All Requirements");
        return;
      }
    }

    if (activeForm < steps.length) {
      setActiveForm(activeForm + 1);
    }
  };

  const handleBack = () => {
    if (activeForm > 1) {
      setActiveForm(activeForm - 1);
    }
  };

  const closeModal = () => {
    setModalActive(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      className="wrapper"
      style={{
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Add shadow
        border: "1px solid #ccc", // Add border
      }}
    >
      <div className="header" style={{ marginBottom: -30 }}>
        <h1>
          <strong>Apply to become a Doctor</strong>
        </h1>
      </div>

      <div className="wrapper">
        <div className="header">
          <ul>
            <li
              key={1}
              className={`form_${1}_progessbar ${
                activeForm >= 1 ? "active" : ""
              }`}
            >
              <div>
                <p>{1}</p>
              </div>
            </li>
          </ul>

          <ul>
            <li
              key={2}
              className={`form_${2}_progessbar ${
                activeForm >= 2 ? "active" : ""
              }`}
            >
              <div>
                <p>{2}</p>
              </div>
            </li>
          </ul>

          <ul>
            <li
              key={3}
              className={`form_${3}_progessbar ${
                activeForm >= 3 ? "active" : ""
              }`}
            >
              <div>
                <p>{3}</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="form_wrap">
          <div
            key={1}
            className={`form_2 data_info`}
            style={{ display: activeForm === 1 ? "block" : "none" }}
          >
            <h2>{"Account Info"}</h2>
            <form>
              <div className="form_container">
                <div key="1" className="input_wrap">
                  <InputField
                    id="Username"
                    label="Username"
                    type="text"
                    value={Username}
                    onChange={setUsername}
                    onBlur={() => handleBlur("username")}
                    isValid={validateUsername(Username)}
                    errorMessage="Username must be at least 3 characters long."
                    touched={touchedFields.username}
                    required={true}
                  />
                </div>

                <div key="2" className="input_wrap">
                  <InputField
                    id="Password"
                    label="Password"
                    type="password"
                    value={Password}
                    onChange={setPassword}
                    onBlur={() => handleBlur("password")}
                    isValid={validatePassword(Password)}
                    errorMessage="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit."
                    touched={touchedFields.password}
                    required={true}
                  />
                </div>

                <div key="3 " className="input_wrap">
                  <InputField
                    id="Email"
                    label="Email"
                    type="text"
                    value={Email}
                    onChange={setEmail}
                    required={true}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="form_wrap">
          <div
            key={2}
            className={`form_1 data_info`}
            style={{ display: activeForm === 2 ? "block" : "none" }}
          >
            <h2>{"Personal Info"}</h2>
            <form>
              <div className="form_container">
                <div key="1" className="input_wrap">
                  <InputField
                    id="Name"
                    label="Name"
                    type="text"
                    value={Name}
                    onChange={setName}
                    required={true}
                  />
                </div>

                <div key="2" className="input_wrap">
                  <label htmlFor="Dob">
                    <strong>Date of Birth:</strong>
                  </label>
                  <DatePicker
                    onChange={onDateChange}
                    style={{
                      width: 350,
                      height: 35,
                      marginRight: 30,
                    }}
                  />
                </div>

                <div key="3" className="input_wrap">
                  <InputField
                    id="Specialty"
                    label="Specialty"
                    type="text"
                    value={Specialty}
                    onChange={setSpecialty}
                    required={true}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="form_wrap">
          <div
            key={3}
            className={`form_3 data_info`}
            style={{ display: activeForm === 3 ? "block" : "none" }}
          >
            <h2>{"Professional Info"}</h2>
            <form>
              <div className="form_container">
                <div key="1" className="input_wrap">
                  <InputField
                    id="HourRate"
                    label="Hourly Rate"
                    type="number"
                    value={HourlyRate}
                    onChange={setHourlyRate}
                    required={true}
                  />
                </div>

                <div key="2" className="input_wrap">
                  <InputField
                    id="Affiliation"
                    label="Affilliation"
                    type="text"
                    value={Affiliation}
                    onChange={setAffiliation}
                    required={true}
                  />
                </div>

                <div key="3 " className="input_wrap">
                  <InputField
                    id="Education"
                    label="Educational Background"
                    type="text"
                    value={EducationalBackground}
                    onChange={setEducation}
                    required={true}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="btns_wrap" style={{ marginTop: 20 }}>
          <div className={`common_btns form_${activeForm}_btns`}>
            {activeForm !== 1 && (
              <Button
                className="btn_back"
                onClick={handleBack}
                style={{
                  width: 90,
                  height: 35,
                  textAlign: "left",
                  backgroundColor: "crimson",
                }}
              >
                <span className="icon">
                  <IoChevronBackCircle />
                </span>
                Back
              </Button>
            )}
            {activeForm !== steps.length ? (
              <Button
                className="btn_next"
                onClick={handleNext}
                style={{ width: 90, height: 35, textAlign: "right" }}
              >
                Next
                <span className="icon">
                  <IoChevronForwardCircle />
                </span>
              </Button>
            ) : (
              <Button
                className="btn_next"
                onClick={handleSignUp}
                style={{
                  width: 90,
                  height: 35,
                  textAlign: "right",
                  backgroundColor: "green",
                }}
              >
                Submit
                <span className="icon">
                  <IoCheckmarkDoneCircleSharp />
                </span>
              </Button>
            )}
          </div>
        </div>
        <div
          className={`modal_wrapper ${modalActive ? "active" : ""}`}
          style={{ color: error ? "red" : "green" }}
        >
          <div className="shadow"></div>
          <div className="success_wrap" style={{ position: "absolute" }}>
            <div style={{ position: "absolute", top: 10, right: 20 }}>
              <IoClose
                name="close-outline"
                style={{ fontSize: 20, color: "black" }}
                onClick={closeModal}
              ></IoClose>
            </div>

            <span
              className="modal_icon"
              style={{ backgroundColor: "transparent", marginBottom: 10 }}
            >
              {!error && (
                <IoCheckmarkDoneCircleSharp style={{ color: "green" }} />
              )}
              {error && <IoAlertCircle style={{ color: "red" }} />}
            </span>
            <h6>
              {error ? error : "Registration Request Submitted Successfully."}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterDoctor;
