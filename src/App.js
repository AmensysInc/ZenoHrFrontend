import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./Employee/Employee";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import AddOrder from "./PurchaseOrder/AddOrder";
import WithHoldTracking from "./WithHoldTracking/WithHoldTracking";
import AddWithHoldTracking from "./WithHoldTracking/AddWithHoldTracking";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar location={window.location}/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/adduser" element={<AddUser/>} />
          <Route exact path="/addorder" element={<AddOrder/>} />
          <Route exact path="/addorder" element={<AddOrder/>} />
          <Route exact path="/orders" element={<PurchaseOrder />} />
          <Route exact path="/tracking" element={<WithHoldTracking />} />
          <Route exact path="/addtracking" element={<AddWithHoldTracking/>} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
