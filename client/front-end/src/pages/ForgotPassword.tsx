import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Button, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { config, headers } from "../Middleware/authMiddleware";
import { validatePassword } from "../utils/ValidationUtils";
import Alert from "../components/Alert";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import { Grid, Button } from "@mui/material";

import ImportedFooter from "../layouts/footer";
import { Layout, Menu } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const ForgotPassword = () => {
  const accessToken = localStorage.getItem("accessToken");
  // const id = localStorage.getItem("id");
  const [email, setEmail] = useState<string>("");
  const [otp, setOTP] = useState<string>("");

  const [otpVisible, setOTPVisible] = useState(false);
  const [passVisible, setPassVisible] = useState(false);

  const [newPass, setNewPass] = useState<string>("");
  const [newPassConfirm, setNewPassConfirm] = useState<string>("");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showNewPassConfirm, setShowNewPassConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please Enter Your Email.");
      setAlertVisibility(true);
      return;
    }

    try {
      const response = await api.post(
        "/forgotPassword",
        { email },
        {
          headers: headers,
        }
      );
      console.log("Response:", response.data);
      setError(null);
      setOTPVisible(true);
      setAlertVisibility(false);
    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        setError(apiError);
      } else {
        setError("An error occurred");
      }

      setAlertVisibility(true);
    }
  };

  const handleOTP = async () => {
    if (!otp) {
      setError("Please Enter Your OTP.");
      setAlertVisibility(true);
      return;
    }

    try {
      const response = await api.post(
        "/verifyOTP",
        { email, otp },
        {
          headers: headers,
        }
      );
      console.log("Response:", response.data);
      setError(null);
      setMessage("OTP Verified!");
      setAlertVisibility(true);
      setTimeout(() => {
        setPassVisible(true);
        setAlertVisibility(false);
      }, 1000);

    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        setError(apiError);
      } else {
        setError("An error occurred");
      }
      setAlertVisibility(true);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(newPass && newPassConfirm)) {
      setError("Please fill in all required fields");
      setAlertVisibility(true);
      return;
    }

    const isPasswordValid = validatePassword(newPass);

    if (!isPasswordValid) {
      setError("Password must meet the minimum requirements.");
      setAlertVisibility(true);
      return;
    }

    if(newPass !== newPassConfirm){
      setError("The Passwords Do Not Match");
      setAlertVisibility(true);
      return;
    }

    const data = {
      email,
      newPass,
      newPassConfirm,
    };

    try {
      const response = await api.put("/resetPassword", data, {
        headers: headers,
      });
      console.log("Response:", response.data);
      setError(null);
      setMessage("Password Updated Successfully.");

      //logout
      localStorage.clear();
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        setError(apiError);
      } else {
        setError("An error occurred");
      }
    }
    setAlertVisibility(true);
  };


  return (
    <Layout>
    <Content style={{ margin: "39px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        //alignItems: "center",
        height: "80vh",
      }}
    >
      <div>
        <h1 className="text-center mt-4 mb-4">Forgot Password?</h1>
        <br />
        <form onSubmit={handleReset}>
          {!passVisible ? (
            <div id="EmailOTP">
              <div className="form-group">
                <div className="input-container">
                  <h5>
                    Enter the email you're registered with and we'll send you an
                    OTP to reset your password
                  </h5>
                  <br />
                  <InputLabel htmlFor="standard-adornment-password">
                    Email
                  </InputLabel>
                  <Grid container={true}>
                    <Input
                      type={"text"}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      value={email}
                      style={{ width: "400px", marginRight: 30 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendOTP}
                    >
                      Send OTP
                    </Button>
                  </Grid>
                </div>
              </div>

              <br />
              <br />

              <div style={{ visibility: otpVisible ? "visible" : "hidden" }}>
                <div className="form-group">
                  <div className="input-container">
                    <InputLabel htmlFor="standard-adornment-password">
                      <h6>
                        An OTP has been sent to{" "}
                        <b>
                          <i>{email}</i>
                        </b>
                        . Kindly, check your inbox and enter it below.
                      </h6>
                    </InputLabel>
                    <Grid container={true}>
                      <Input
                        type={"text"}
                        onChange={(e) => {
                          setOTP(e.target.value);
                        }}
                        value={otp}
                        style={{ marginRight: 30 }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        style={{ height: 30, width: 70 }}
                        onClick={handleOTP}
                      >
                        Verify
                      </Button>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <br />
              <br />
              <h5>Enter Your New Password Below to Reset. </h5>
              <br /><br />
                <div className="form-group">
                  <div className="input-container">
                    <InputLabel htmlFor="standard-adornment-password">
                      New Password
                    </InputLabel>
                    <Input
                      type={showNewPass ? "text" : "password"}
                      onChange={(e) => {
                        setNewPass(e.target.value);
                      }}
                      value={newPass}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              setShowNewPass(!showNewPass);
                            }}
                          >
                            {showNewPass ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      style={{ width: "350px" }}
                    />
                    {!validatePassword(newPass) && (
                      <div
                        className="text-danger"
                        style={{ textAlign: "left" }}
                      >
                        <small>
                          Password must be at least 6 characters long and
                          contain at least{" "}
                        </small>
                        <br />
                        <small>
                          <b>
                            one uppercase letter, one lowercase letter, and one
                            digit
                          </b>{" "}
                        </small>
                        <br />
                      </div>
                    )}
                  </div>
                </div>
                <br />

                  <div className="form-group" >
                    <div className="input-container">
                      <InputLabel htmlFor="standard-adornment-password">
                        Confirm New Password
                      </InputLabel>
                      <Input
                        type={showNewPassConfirm ? "text" : "password"}
                        onChange={(e) => {
                          setNewPassConfirm(e.target.value);
                        }}
                        value={newPassConfirm}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setShowNewPassConfirm(!showNewPassConfirm);
                              }}
                            >
                              {showNewPassConfirm ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        style={{ width: "350px" }}
                      />
                    </div>
                  </div>

                  <br />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="btn btn-danger"
                      type="submit"
                      style={{ alignSelf: "flex-start", marginLeft: "auto" }}
                    >
                      Reset Password
                    </button>
                  </div>
                <br />
            </div>
          )}
        </form>

        <div>
        <br />
          {alertVisible && (
            <Alert
              type={error ? "danger" : "success"}
              onClose={() => setAlertVisibility(false)}
            >
              {error ? error : message}
            </Alert>
          )}
        </div>
      </div>
    </div>
    </Content>
    <ImportedFooter />
  </Layout>
  );
};

export default ForgotPassword;
