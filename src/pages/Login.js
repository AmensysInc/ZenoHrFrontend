import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/auth/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 403) {
        setErrorMessage("Invalid Credentials!");
      } else {
        const data = await response.json();
        const { role, access_token, id, tempPassword } = data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        localStorage.setItem("tempPassword", tempPassword);

        if ( tempPassword === true) {
          console.log("Role:", role);
          console.log("Temporary Password:", tempPassword);
          onLogin(role);
          navigate(`/change-password/${id}`);
        } else {
          onLogin(role);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
}
