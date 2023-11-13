import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  validateMobile,
  validatePassword,
  validateUsername,
} from "../utils/ValidationUtils";
import InputField2 from "../components/InputField2";
import Cookies from "js-cookie";

const RegLog: React.FC = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>();
  const [Dob, setDob] = useState<Date>();
  const [Mobile, setMobile] = useState<number>();
  const [EmergencyContactName, setEmergencyContactName] = useState<string>();
  const [EmergencyContactMobile, setEmergencyContactMobile] =
    useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const handleSignUp = async () => {
    if (
      !Name ||
      !Email ||
      !Password ||
      !Username ||
      !Dob ||
      !Gender ||
      !Mobile ||
      !EmergencyContactName ||
      !EmergencyContactMobile
    ) {
      message.error("Please fill in all the required fields.");
      return;
    } else {
      try {
        const data = {
          Name,
          Email,
          Password,
          Username,
          Dob,
          Gender,
          Mobile,
          EmergencyContactName,
          EmergencyContactMobile,
        };

        const response = await api.post(`/patient/register`, data);
        message.success("Congrats, you are in");
        setTimeout(toggleSignUp, 1500);
      } catch (error: any) {
        console.error("Error:", error);
        message.error(`${error.response.data.error}`);
      }
    }
  };

  const handleSignIn = async () => {
    if (!Password || !Username) {
      message.warning(" Please fill in all the required fields.");
      return;
    }
    try {
      const data = {
        Password,
        Username,
      };
      const response = await api.post(`/login`, data);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("type", response.data.type);
      localStorage.setItem("accessToken", response.data.accessToken);
      Cookies.set("accessToken", response.data.accessToken);
      handleRedirection(response.data);
      window.location.reload();
    } catch (error: any) {
      console.error("Error:", error);
      message.error(`${error.response.data.error}`);
    }
  };

  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    if (item.type == "Patient") {
      navigate(`/patient/Home`);
    } else if (item.type == "Doctor" && item.user.FirstTime == true) {
      navigate(`/doctor/timeSlots`);
    } else if (item.type == "Doctor" && item.user.FirstTime != true) {
      navigate(`/doctor/Home`);
    } else if (item.type == "Admin") {
      navigate(`/admin/Home`);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleDobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Assuming the input format is "YYYY-MM-DD"
    const date = new Date(inputValue);

    if (!isNaN(date.getTime())) {
      setDob(date);
    } else {
      setDob(undefined); // Invalid input, clear the date
    }
  };

  const toggleSignUp = () => {
    setAlertVisibility(false);
    setIsSignUp(!isSignUp);
  };

  const handleRegAsDoctor = () => {
    navigate("/doctor/register");
    window.location.reload();
  };

  return (
    <div
      style={{
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Add shadow
        border: "1px solid #ccc", // Add border
      }}
      className={`cont ${isSignUp ? "s--signup" : ""}`}
    >
      <div className="form sign-in ">
        <h2 className="h2">Welcome Back</h2>

        <InputField2
          id="Username"
          label="Username"
          type="text"
          value={Username}
          onChange={setUsername}
          onBlur={() => handleBlur("username")}
          required={true}
        />

        <InputField2
          id="Password"
          label="Password"
          type="password"
          value={Password}
          onChange={setPassword}
          required={true}
          onBlur={() => handleBlur("password")}
        />

        <a
          href="/forgotPassword"
          className="forgot-pass text-right"
          style={{ display: "block", textAlign: "center" }}
        >
          Forgot Password?
        </a>
        {/* <Link to= "/forgotPassword" onClick={() => { }} className="forgot-pass text-right" style={{display: "block", textAlign:"center"}}>Forgot Password?</Link> */}

        <button onClick={handleSignIn} type="button" className="submit button">
          Sign In
        </button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <button
          onClick={handleRegAsDoctor}
          type="button"
          className="submit button"
        >
          Register As Doctor
        </button>
      </div>

      <div className="sub-cont">
        <div className="img">
          <div className={`img__text m--up ${isSignUp ? "" : ""}`}>
            <h2 className="h2">New here?</h2>
            <p>Sign up and discover a great amount of new opportunities!</p>
          </div>
          <div className={`img__text m--in ${isSignUp ? "" : "m--up"}`}>
            <h2 className="h2">One of us?</h2>
            <p className="p">
              If you already have an account, just sign in. We've missed you!
            </p>
          </div>
          <div className="img__btn" onClick={toggleSignUp}>
            <span className={`span m--up ${isSignUp ? "m--in" : ""}`}>
              Sign Up
            </span>
            <span className={`span m--in ${isSignUp ? "" : "m--up"}`}>
              Sign In
            </span>
          </div>
        </div>
        <div className="form sign-up">
          <h2 className="h2">Time to feel like home</h2>

          <div className="input_wrap">
            <InputField2
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

          <div className="input_wrap">
            <InputField2
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

          <div className="input_wrap">
            <InputField2
              id="Email"
              label="Email"
              type="text"
              value={Email}
              onChange={setEmail}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <label className="label">
              <span className="span">Date Of Birth</span>
              <input
                className="input"
                value={Dob !== undefined ? Dob.toISOString().split("T")[0] : ""}
                onChange={handleDobChange}
                type="date"
              />
            </label>
          </div>

          <div className="input_wrap">
            <InputField2
              id="Gender"
              label="Gender"
              type="select"
              options={["Male", "Female"]}
              value={Gender}
              onChange={setGender}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="MobileNo"
              label="Mobile Number"
              type="tel"
              value={Mobile !== undefined ? Mobile.toString() : ""}
              onChange={setMobile}
              isValid={Mobile !== undefined ? validateMobile(Mobile) : true}
              errorMessage="Invalid Mobile Number! Accepted Format: +201234567890 OR 0123456789"
              touched={true}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="EmergencyContName"
              label="Emergency Contact Name"
              type="text"
              value={EmergencyContactName}
              onChange={setEmergencyContactName}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="EmergencyContMobile"
              label="Emergency Contact Mobile"
              type="tel"
              value={
                EmergencyContactMobile !== undefined
                  ? EmergencyContactMobile.toString()
                  : ""
              }
              onChange={setEmergencyContactMobile}
              isValid={validateMobile(EmergencyContactMobile)}
              errorMessage="Invalid Mobile Number! Accepted Format: +201234567890 OR 0123456789"
              touched={true}
              required={true}
            />
          </div>

          <button
            onClick={handleSignUp}
            type="button"
            className=" button submit"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegLog;
