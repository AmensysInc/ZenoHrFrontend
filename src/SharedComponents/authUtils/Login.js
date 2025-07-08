import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./authUtils";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const error = await loginUser(email, password, onLogin, navigate);
    if (error) {
      setErrorMessage(error);
    }
  }

  return (
    <div className="container">
      <h3>Log in to Zeno Pay & HR Online Portal</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Id
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
          Log In
        </button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
}
