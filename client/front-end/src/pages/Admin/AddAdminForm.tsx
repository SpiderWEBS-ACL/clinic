import React, { useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import InputField from "../../components/InputField";
import {
  validateUsername,
  validatePassword,
} from "../../utils/ValidationUtils";
import { Button, Form, Input, Select, message } from "antd";

const { Option } = Select;

const AddAdminForm: React.FC = () => {
  const [Username, setUsername] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertVisibility(true);

    const isUsernameValid = validateUsername(Username);
    const isPasswordValid = validatePassword(Password);

    if (!isUsernameValid || !isPasswordValid) {
      message.error(
        "Username and Password must meet the minimum requirements."
      );
      return;
    }

    const data = {
      Username,
      Password,
    };

    try {
      const response = await api.post("/admin/add", data);
      console.log("Response:", response.data);
      message.success("Admin added successfully!");
    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        message.error(apiError);
      } else {
        message.error("An error occurred");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <h2>Add Admin</h2>
        <form onSubmit={handleSubmit}>
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
          />
          <InputField
            id="Password"
            label="Password"
            type="password"
            value={Password}
            onChange={setPassword}
            onBlur={() => handleBlur("password")}
            isValid={validatePassword(Password)}
            errorMessage="Password must be at least 6 characters long."
            touched={touchedFields.password}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-primary"
              type="submit"
              style={{ alignSelf: "flex-end" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminForm;
