import React, { useEffect, useState } from "react";
import App from "./App";
import Login from "./pages/Login";
export default function AuthenticatedApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, []);
  
    const handleLogin = (token) => {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    };
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    };
  
    return isLoggedIn ? (
      <>
        <App />
        <button onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <Login onLogin={handleLogin} />
    );
  }
