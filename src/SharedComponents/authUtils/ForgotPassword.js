import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";
import { post } from "../httpClient ";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sendDetailsSuccess, setSendDetailsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await post("/auth/resetPassword", { email });
      if (response.status === 200 || response.status === 201) {
        setSendDetailsSuccess(true);
      }
    } catch (error) {
      setError("Email does not exist", error);
      console.error("An error occurred:", error);
    }
  };

  const onClose = () => {
    navigate("/login");
  };

  const paragraphStyle = {
    fontSize: '16px',
    display: 'block',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
    unicodeBidi: 'isolate'
  };

  return (
    <div className="form-container">
       {error && ( 
        <Alert message={error} type="error" closable onClose={() => setError(null)} />
      )}
      {sendDetailsSuccess && (
          <Alert
            message="Temporary password Details emailed successfully"
            type="success"
            closable
            onClose={onClose}
          />
        )}
      <h3>Forgot Password ?</h3>
      <p style={paragraphStyle}>
      Don't worry. Resetting your password is easy, just tell us the email address you registered with Quick HRMS.
    </p>
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
