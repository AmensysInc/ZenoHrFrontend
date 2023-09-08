import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(`${apiUrl}/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log("Password reset email sent successfully.");
      } else {
        console.error("Password reset request failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    navigate("/login");
  };

  return (
    <div className="container">
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
