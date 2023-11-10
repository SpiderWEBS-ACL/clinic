import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { config, headers } from "../../Middleware/authMiddleware";
import { validatePassword } from "../../utils/ValidationUtils";
import Alert from "../../components/Alert";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";

const ChangePassword = () => {
  const accessToken = localStorage.getItem("accessToken");
  // const id = localStorage.getItem("id");
  const [currPass, setCurrPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [newPassConfirm, setNewPassConfirm] = useState<string>("");
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showNewPassConfirm, setShowNewPassConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(currPass && newPass && newPassConfirm)) {
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

    const data = {
      currPass,
      newPass,
      newPassConfirm,
    };

    try {
      const response = await api.put("/admin/changePassword", data, {
        headers: headers,
      });
      console.log("Response:", response.data);
      setError(null);

      //logout
      localStorage.clear();
      setTimeout(()=> {
        navigate("/");
       }, 1000);
      window.location.reload;

      
    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data;
        setError(apiError);
      } else {
        setError("An error occurred");
      }
    }
    setAlertVisibility(true);

  };
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div>
        <h1 className="text-center mt-4 mb-4">Change Password</h1>
        <br />
        <form onSubmit={handleSubmit} >
          <div className="form-group">
            <div className="input-container">
              <InputLabel htmlFor="standard-adornment-password">
                Current Password
              </InputLabel>

              <Input
                type={showCurrPass ? "text" : "password"}
                onChange={(e) => {
                  setCurrPass(e.target.value);
                }}
                value={currPass}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowCurrPass(!showCurrPass);
                      }}
                    >
                      {showCurrPass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                style={{ width: "300px" }}
              />
            </div>
          </div>

          <br />

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
                style={{ width: "300px" }}
              />
              {!validatePassword(newPass) && (
                <div className="text-danger" style={{ textAlign: "left" }}>
                  <small>Password must be at least 6 characters long and contain at least </small><br />
                    <small><b>one uppercase letter, one lowercase letter, and one digit</b> </small><br />
                </div>
              )}
            </div>
          </div>
          <br />

          <div className="form-group">
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
                      {showNewPassConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                style={{ width: "300px" }}
              />
            </div>
          </div>   
          <br />
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
              Update Password
            </button>
          </div>
          <br />
          
        </form>
        <div> 
        {alertVisible && (
            <Alert
              type={error ? "danger" : "success"}
              onClose={() => setAlertVisibility(false)}
            >
              {error ? error : "Password Updated Successfully"}
            </Alert>
          )}
        </div>
      </div>
  
      
    </div>
  );
};

export default ChangePassword;
