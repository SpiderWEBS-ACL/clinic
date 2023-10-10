import React, { useState, ChangeEvent } from 'react';import axios from "axios";
import "./style.css";
import { Int32 } from "mongodb";
import Alert from "../components/Alert";
import { useParams,useNavigate } from "react-router-dom";


const RegLog: React.FC = () => {
const [alertVisible, setAlertVisibility] = useState(false);
const [isSignUp, setIsSignUp] = useState<boolean>(false);
const [Name, setName] = useState<string>("");
const [Email, setEmail] = useState<string>("");
const [Password, sePassword] = useState<string>("");
const [Username, setUsername] = useState<string>("");
const [Gender, setGender] = useState<string>();
const [Dob, setDob] = useState<Date>();
const [Mobile, setMobile] = useState<Number>();
const [EmergencyContactName, setEmergencyContactName] = useState<string>();
const [EmergencyContactMobile, setEmergencyContactMobile] = useState<Number>();

const api = axios.create({
    baseURL: "http://localhost:8000/",
});
const handleSignUp = async () => {
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
        EmergencyContactMobile

      };
      
     
      const response = await api.post(`/patient/register`, data);
      console.log("Response:", response.data);
      setAlertVisibility(true)
      setTimeout(toggleSignUp,1500)
     
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSignIn = async () => {
    try {
      const data = {
        Password,
        Username
      };
   const response =await api.post(`/patient/login`,data)
        console.log(response.data)
        handleRedirection(response.data.id);
     
      ;
}
   catch (error) {
    console.error("Error:", error);
  }
}
const navigate = useNavigate();
const handleRedirection = (item: any) => {
  navigate(`/patient/PatientHome/${item}`);
};
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    sePassword(event.target.value);
  };
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const parsedValue = parseFloat(inputValue); // Parse the input string to an integer

    if (!isNaN(parsedValue)) {
      setMobile(parsedValue);
    } else {
      setMobile(undefined); // Invalid input, clear the value
    }
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
  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleEmerNamechange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmergencyContactName(event.target.value);
  };
  const handleEmerMobileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const parsedValue = parseFloat(inputValue); // Parse the input string to an integer

    if (!isNaN(parsedValue)) {
      setEmergencyContactMobile(parsedValue);
    } else {
      setEmergencyContactMobile(undefined); // Invalid input, clear the value
    }  };
  




  const toggleSignUp = () => {
    setAlertVisibility(false)
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
      <div className="form sign-in ">
        <h2>Welcome Back</h2>
        <label>
            <span>Username</span>
            <input 
            value = {Username}
            onChange={handleUsernameChange}
            type="text" />
          </label>
          <label>
            <span>Password</span>
            <input 
            value = {Password}
            onChange={handlePasswordChange}
            type="password" />
          </label>
        <p className="forgot-pass">Forgot password?</p>
        <button onClick={handleSignIn} type="button" className="submit">
          Sign In
        </button>
      </div>
      <div className="sub-cont">
        <div className="img">
          <div className={`img__text m--up ${isSignUp ? "" : ""}`}>
            <h2>New here?</h2>
            <p>Sign up and discover a great amount of new opportunities!</p>
          </div>
          <div className={`img__text m--in ${isSignUp ? "" : "m--up"}`}>
            <h2>One of us?</h2>
            <p>
              If you already have an account, just sign in. We've missed you!
            </p>
          </div>
          <div className="img__btn" onClick={toggleSignUp}>
            <span className={`m--up ${isSignUp ? "m--in" : ""}`}>Sign Up</span>
            <span className={`m--in ${isSignUp ? "" : "m--up"}`}>Sign In</span>
          </div>
        </div>
        <div className="form sign-up">
          <h2>Time to feel like home</h2>
          <h6>Your Details:</h6>
          <label>
            <span>Name</span>
            <input  
                value = {Name}
                onChange={handleNameChange} 
                type="text" />
          </label>
          <label>
            <span>Username</span>
            <input 
            value = {Username}
            onChange={handleUsernameChange}
            type="text" />
          </label>
          <label>
            <span>Password</span>
            <input 
            value = {Password}
            onChange={handlePasswordChange}
            type="password" />
          </label>
          <label>
            <span>Email</span>
            <input 
            value = {Email}
            onChange={handleEmailChange}
            type="Email" />
          </label>
          <label>
            <span>Date of Birth</span>
            <input 
            value = {Dob !== undefined ? Dob.toISOString().split('T')[0] : ''}
            onChange={handleDobChange}
            type="date" />
          </label>
          <label>
            <span>Gender</span>
            <input 
            value = {Gender}
            onChange={handleGenderChange}
            type="text" />
          </label>
          <label>
            <span>Mobile Number</span>
            <input 
            value = {Mobile !== undefined ? Mobile.toString() : ''}
            onChange={handleMobileChange}
            type="tel" />
          </label>
         <br></br>
         <br></br>
         <h6>Emergency Contact Details:</h6>
          <label>
            <span>Emergency Contant Name</span>
            <input 
            value = {EmergencyContactName}
            onChange={handleEmerNamechange}
            type="text" />
          </label>
          <label>
            <span>Emergency Contant Mobile </span>
            <input 
            value = {EmergencyContactMobile !== undefined ? EmergencyContactMobile.toString() : ''}
          
            onChange={handleEmerMobileChange}
            type="tel" />
          </label>
          
          <button onClick={handleSignUp} type="button" className="submit">
            Sign Up
          </button>
          {alertVisible && (
            <Alert
              type={ "success"}
              onClose={() => setAlertVisibility(false)}
            >
            {"Admin added Successfully"}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegLog;
