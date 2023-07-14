import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import AddUser from './Employee/Employee';
import PurchaseOrder from './PurchaseOrder/PurchaseOrder';
import AddOrder from './PurchaseOrder/AddOrder';
import WithHoldTracking from './WithHoldTracking/WithHoldTracking';
import AddWithHoldTracking from './WithHoldTracking/AddWithHoldTracking';
import EditEmployee from './Employee/EditEmployee';
import Login from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/addorder" element={<AddOrder />} />
              <Route path="/orders" element={<PurchaseOrder />} />
              <Route path="/tracking" element={<WithHoldTracking />} />
              <Route path="/addtracking" element={<AddWithHoldTracking />} />
              <Route path="/editemployee" element={<EditEmployee />} />
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// import React from 'react';
// import { BrowserRouter as Routes, Route, } from "react-router-dom";
// import Navbar from "./layout/Navbar";
// import Home from "./pages/Home";
// import AddUser from "./Employee/Employee";
// import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
// import AddOrder from "./PurchaseOrder/AddOrder";
// import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
// import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";
// import EditEmployee from "./Employee/EditEmployee";
// import Login from "./pages/Login";

// function App() {
//   return (
     
//       <div className="App">
//         <Navbar />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/adduser" element={<AddUser />} />
//           <Route path="/addorder" element={<AddOrder />} />
//           <Route path="/orders" element={<PurchaseOrder />} />
//           <Route path="/tracking" element={<WithHoldTracking />} />
//           <Route path="/addtracking" element={<AddWithHoldTracking />} />
//           <Route path="/editemployee" element={<EditEmployee />} />
//         </Routes>
//       </div>
//   );
// }

// export default App;




// import "./App.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "./layout/Navbar";
// import Home from "./pages/Home";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AddUser from "./Employee/Employee";
// import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
// import AddOrder from "./PurchaseOrder/AddOrder";
// import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
// import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";
// import EditEmployee from "./Employee/EditEmployee";
// import Login from "./pages/Login";

// function App() {

//   return (
//     <div className="App">
//       <Router>
//         <Navbar location={window.location}/>
//         <Routes>
//         <Route exact path="/login" element={<Login />} />
//           <Route exact path="/" element={<Home />} />
//           <Route exact path="/adduser" element={<AddUser/>} />
//           <Route exact path="/addorder" element={<AddOrder/>} />
//           <Route exact path="/orders" element={<PurchaseOrder />} />
//           <Route exact path="/tracking" element={<WithHoldTracking />} />
//           <Route exact path="/addtracking" element={<AddWithHoldTracking/>} />
//           <Route exact path="/editemployee" element={<EditEmployee />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }
// export default App;
