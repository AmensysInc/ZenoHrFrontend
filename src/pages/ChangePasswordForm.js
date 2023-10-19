import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";

const ChangePasswordForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const navigate = useNavigate();
const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
const [role, setRole] = useLocalStorage("role", "");
const handleLogout = () => {
  localStorage.clear();
  setIsLoggedIn(false);
  setRole("");
  window.location.href = "/login";
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
    return;
  }
  try {

    const userId = localStorage.getItem("id");
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);
    queryParams.append("password", password);

    const url = `${apiUrl}/auth/updatePassword?${queryParams.toString()}`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      // localStorage.clear();
      // localStorage.setItem("isLoggedIn", false);
      // localStorage.setItem("role", "");
      // window.history.pushState(null, "", window.location.href);
      // window.onpopstate = function () {
      //   window.history.pushState(null, "", window.location.href);
      // };
      // navigate("/login");
      handleLogout();
    } else {
      setErrorMessage("Failed to update password.");
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
};


  return (
    <div className="container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
      <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New Password
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
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;


