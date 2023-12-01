import React, { useState } from "react";
import Alert from "../../components/Alert";
import InputField from "../../components/InputField";
import {
  validateUsername,
  validatePassword,
} from "../../utils/ValidationUtils";
import { addAdmin } from "../../apis/Admin/AddAdmin";

const AddAdminForm: React.FC = () => {
  const [Username, setUsername] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
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

    if (!(Username && Password && Email)) {
      setError("Please fill in all required fields");
      return;
    }

    const isUsernameValid = validateUsername(Username);
    const isPasswordValid = validatePassword(Password);

    if (!isUsernameValid || !isPasswordValid) {
      setError("Username and Password must meet the minimum requirements.");
      return;
    }

    const data = {
      Username,
      Password,
      Email,
    };

    try {
      await addAdmin(data);

      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred");
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
          <InputField
            id="Email"
            label="Email"
            type="email"
            value={Email}
            onChange={setEmail}
            required={true}
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
          {alertVisible && (
            <Alert
              type={error ? "danger" : "success"}
              onClose={() => setAlertVisibility(false)}
            >
              {error ? error : "Admin added Successfully"}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAdminForm;
