import React, { useState } from "react";
import { logoutUser, updatePassword } from "./authUtils";

const ChangePasswordForm = ({setIsLoggedIn, setRole}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole);
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const userId = sessionStorage.getItem("id");
      await updatePassword(userId, password);

      handleLogout();
    } catch (error) {
      setErrorMessage(error.message);
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
