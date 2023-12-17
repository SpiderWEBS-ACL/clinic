import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  message,
  Button,
  Input
} from "antd";

import { MDBContainer, MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";

import Cookies from "js-cookie";

const RegLog: React.FC = () => {
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission

    if (!Username || !Password) {
      message.warning("Please Fill In All Fields");
      return;
    }

    try {
      const data = {
        Username,
        Password,
      };
      const response = await api.post(`/login`, data);
      console.log(response.data);
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(event as any); // Manually trigger the form submission
    }
  };

  const handleSignIn = async () => {
    if (!Password || !Username) {
      message.warning(" Please fill in all the required fields.");
      return;
    }

    try {
      const data = {
        Password: Password, 
        Username: Username, 
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

  const handleRegister = () => {
    navigate("/register");
    window.location.reload();
  };

  const handleRegAsDoctor = () => {
    navigate("/doctor/register");
    window.location.reload();
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="/logo.png"
                style={{ width: "150px", marginTop: "5rem" }}
                alt="logo"
              />
            </div>

            <h3 style={{ alignSelf: "center" }}>Login to your account</h3>
            <br></br>
            <div className="mb-4">
              <label>Username</label>
              <Input
                id="form1"
                type="username"
                onChange={handleUsernameChange}
                value={Username}
              />
            </div>
            <div className="mb-4">
              <label>Password</label>
              <Input.Password
                id="form2"
                type="password"
                onChange={handlePasswordChange}
                value={Password}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="text-center pt-1 mb-5 pb-1">
              <Button
                className="mb-4 w-100"
                onClick={handleSignIn}
                type="primary"
                style= {{color:"white"}}
              >
                Sign in
              </Button>
              <a className="text-muted" href="/forgotPassword">
                Forgot password?
              </a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <Button
                type="dashed"
                danger
                style={{ marginLeft: "10px" }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>
          </div>
        </MDBCol>

        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
            <img
              style={{ marginLeft: "0rem" }}
              src="/2.png"
              alt="ren"
              width="740vh"
            />
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default RegLog;
