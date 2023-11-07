import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";
import { post } from "../httpClient ";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sendDetailsSuccess, setSendDetailsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await post("/auth/resetPassword", { email });
      if (response.status === 200 || response.status === 201) {
        setSendDetailsSuccess(true);
      } else {
        console.error("Password reset request failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onClose = () => {
    navigate("/login");
  };

  return (
    <div className="form-container">
      {sendDetailsSuccess && (
          <Alert
            message="Login Details emailed successfully"
            type="success"
            closable
            onClose={onClose}
          />
        )}
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
}
