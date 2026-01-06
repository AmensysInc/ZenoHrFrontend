import React from "react";

export default function RecruiterDashboard() {
  const roleFromLocalStorage = localStorage.getItem("role");
  const role = roleFromLocalStorage ? roleFromLocalStorage.replace(/"/g, "") : "";

  return (
    <div className="container">
      <div className="py-4">
        <h2>Welcome to {role} Team Dashboard</h2>
      </div>
    </div>
  );
}
