import React, { useEffect, useState } from "react";
import App from "./App";
import Login from "./pages/Login";
export default function AuthenticatedApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      // Check if the JWT token is present in local storage
      const token = localStorage.getItem("token");
      // Perform any necessary authentication checks with the token
      // For example, you can send the token to the server to verify its validity
      // Here, we'll assume a simple check of the token's presence
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, []);
  
    const handleLogin = (token) => {
      // Store the JWT token in local storage
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    };
  
    const handleLogout = () => {
      // Remove the JWT token from local storage
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
// export default function AuthenticatedApp() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if the JWT token is present in local storage
//     const token = localStorage.getItem("token");
//     // Perform any necessary authentication checks with the token
//     // For example, you can send the token to the server to verify its validity
//     // Here, we'll assume a simple check of the token's presence
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   const handleLogin = (token) => {
//     // Store the JWT token in local storage
//     localStorage.setItem("token", token);
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Remove the JWT token from local storage
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//   };

//   return isLoggedIn ? <App onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
// }
