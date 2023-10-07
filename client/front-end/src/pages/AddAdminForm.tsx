import React, { useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";

const AddAdminForm: React.FC = () => {
  const [Username, setUsername] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertVisibility(true);
    const data = {
      Username,
      Password,
    };

    try {
      const response = await api.post("/admin/add", data);
      console.log("Response:", response.data);

      setError(null);
    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        setError(apiError);
      } else {
        setError("An error occurred");
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
        <h2>Add Admin Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Username">Username:</label>
            <input
              className="form-control"
              type="text"
              id="Username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password:</label>
            <input
              className="form-control"
              type="password"
              id="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
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
