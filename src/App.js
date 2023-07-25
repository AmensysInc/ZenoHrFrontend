import React, { useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./Employee/Employee";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import AddOrder from "./PurchaseOrder/AddOrder";
import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";
import EditEmployee from "./Employee/EditEmployee";
import Login from "./pages/Login";
import EditOrder from "./PurchaseOrder/EditOrder";
import EditWithHoldTracking from "./WithHoldTracking/EditWithHoldTracking";
import Breadcrumb from "./Breadcrumbs";


function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error getting data from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting data to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
  

  const handleLogin = () => {
    setIsLoggedIn(true);
    
  };

  return (
    <div className="App">
      <Router>
        <Navbar location={window.location}/>
        {isLoggedIn && <Breadcrumb/>}
        {/* <Breadcrumbs location={window.location} /> */}
        <Routes>
        <Route exact path="/login" element={<Login onLogin={handleLogin}/>} />
          {isLoggedIn ? 
          (
          <>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/adduser" element={<AddUser/>} />
          <Route exact path="/addorder" element={<AddOrder />} />
          <Route exact path="/orders" element={<PurchaseOrder />} />
          <Route path="/editorder" element={<EditOrder/>} />
          <Route exact path="/tracking" element={<WithHoldTracking />} />
          <Route path="/edittracking" element={<EditWithHoldTracking/> } />
          <Route exact path="/addtracking" element={<AddWithHoldTracking/>} />
          <Route exact path="/editemployee" element={<EditEmployee />} />
          </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}
export default App;
