import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import {
  message,
  Button,
  Checkbox,
  Form,
  Input,
  AutoComplete,
  Cascader,
  Col,
  InputNumber,
  Row,
  DatePicker,
  Select,
} from "antd";

import {
  validateMobile,
  validatePassword,
  validateUsername,
} from "../utils/ValidationUtils";
import InputField2 from "../components/InputField2";
import Cookies from "js-cookie";
import moment from "moment";
import dayjs from "dayjs";

const RegLog: React.FC = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>();
  const [Dob, setDob] = useState<any>();
  const [Mobile, setMobile] = useState<string>();
  const [EmergencyContactName, setEmergencyContactName] = useState<string>();
  const [EmergencyContactMobile, setEmergencyContactMobile] =
    useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const handleSignUp = async () => {
    console.log(
      Name,
      Email,
      Password,
      Username,
      Dob,
      Gender,
      Mobile,
      EmergencyContactName,
      EmergencyContactMobile
    );
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
        console.log(data);
        message.success("Congrats, you are in");
        setTimeout(toggleSignUp, 1500);
      } catch (error: any) {
        console.error("Error:", error);
        message.error(`${error.response.data.error}`);
      }
    }
  };
  const validatePassword = (rule: any, value: string, callback: any) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!regex.test(value)) {
      callback(
        "Password must be at least 6 characters long and include one capital letter and one number."
      );
    } else {
      callback();
    }
  };

  const validatePhoneNumber = (rule: any, value: string, callback: any) => {
    const regex = /^[0-9]+$/;
    if (!regex.test(value)) {
      callback("Please enter a valid phone number.");
    } else if (value.length !== 11) {
      callback("Please enter a valid phone number.");
    } else {
      callback();
    }
  };

  const handleSignIn = async (values: any) => {
    const { password, username } = values; // Destructure the values from the form

    if (!password || !username) {
      message.warning(" Please fill in all the required fields.");
      return;
    }

    try {
      const data = {
        Password: password, // Use the value from the form for Password
        Username: username, // Use the value from the form for Username
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

  //------------------------------------------------------------------
  type FieldType = {
    username?: string;
    password?: string;
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const { Option } = Select;
  const [form] = Form.useForm();
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="20">+20</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Roboto', sans-serif",
      }}
      className={`cont ${isSignUp ? "s--signup" : ""}`}
    >
      <div className="form sign-in ">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 350, margin: 70 }}
          initialValues={{ remember: true }}
          onFinish={handleSignIn}
          autoComplete="off"
        >
          <h2 style={{ margin: 30 }} className="h2">
            Welcome Back
          </h2>
          <br></br>
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <a
            href="/forgotPassword"
            className="forgot-pass text-right"
            style={{ display: "block", textAlign: "center", marginBottom: 17 }}
          >
            Forgot Password?
          </a>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button style={{ margin: "auto" }} type="primary" htmlType="submit">
              Sign in
            </Button>
          </Form.Item>
        </Form>
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
          <div
            style={{ marginTop: 20, minWidth: 140, minHeight: 60 }}
            className="img__btn"
            onClick={handleRegAsDoctor}
          >
            <span
              style={{ textAlign: "center" }}
              className={`span m--up ${isSignUp ? "m--in" : ""}`}
            >
              Sign Up as a doctor
            </span>
            <span
              style={{ textAlign: "center" }}
              className={`span m--in ${isSignUp ? "" : "m--up"}`}
            >
              Sign Up as a doctor
            </span>
          </div>
        </div>
        <div className="form sign-up">
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={handleSignUp}
            labelWrap
            initialValues={{ prefix: "20" }}
            style={{ maxWidth: 430, marginTop: 20 }}
            scrollToFirstError
          >
            <h2 style={{ marginBottom: 20 }} className="h2">
              Time to feel like home
            </h2>

            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your Name!",
                  whitespace: true,
                },
              ]}
            >
              <Input onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  type: "string",
                  message: "The input is not valid Username",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              tooltip="Your password must be 8 character and contain: one capital letter, one small letter, one number"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  validator: validatePassword,
                },
              ]}
              hasFeedback
            >
              <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item
              name="dob"
              label="Date of birth"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter you date of birth!",
                },
              ]}
            >
              <DatePicker
                value={Dob ? dayjs(Dob) : undefined}
                onChange={(date, dateString) => {
                  if (dateString) {
                    setDob(dateString);
                  }
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  validator: validatePhoneNumber,
                },
              ]}
            >
              <Input
                addonBefore={prefixSelector}
                style={{ width: "100%" }}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select
                onChange={(value) => setGender(value)}
                placeholder="select your gender"
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="EmergencyContactName"
              label="Emergency Contact Name"
              rules={[{ required: true, message: "Please input name" }]}
            >
              <Input
                onChange={(e) => setEmergencyContactName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="EmergencyContactMobile"
              label="Emergency Contact Mobile"
              rules={[
                { required: true, message: "Please input mobile number" },
              ]}
            >
              <Input
                onChange={(e) => setEmergencyContactMobile(e.target.value)}
                addonBefore={prefixSelector}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegLog;
