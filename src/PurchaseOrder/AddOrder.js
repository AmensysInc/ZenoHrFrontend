import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AddOrder() {
  let navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

  const [orders, setOrders] = useState({
    employeeId: employeeId,
    dateOfJoining: "",
    projectEndDate: "",
    billRate: "",
    endClientName: "",
    vendorPhoneNo: "",
    vendorEmailId: ""
  });

  const { dateOfJoining, projectEndDate, billRate, endClientName, vendorPhoneNo, vendorEmailId } = orders;

  const onInputChange = (e) => {
    setOrders({ ...orders, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:8082/employees/${employeeId}/orders`, orders);
    navigate("/");
  };

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add New Purchase Order</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="employeeId">
              Employee ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Employee ID"
              name="employeeId"
              value={employeeId}
              onChange={(e) => onInputChange(e)}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfJoining">
              Date Of Joining
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Date Of Joining"
              name="dateOfJoining"
              value={dateOfJoining}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectEndDate">
              Project End Date
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Project End Date"
              name="projectEndDate"
              value={projectEndDate}
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="billRate">
            Bill Rate
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Bill Rate"
            name="billRate"
            value={billRate}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endClientName">
            End Client Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="End Client Name"
            name="endClientName"
            value={endClientName}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorPhoneNo">
            Vendor PhoneNo
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Vendor PhoneNo"
            name="vendorPhoneNo"
            value={vendorPhoneNo}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorEmailId">
            Vendor EmailId
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Vendor EmailId"
            name="vendorEmailId"
            value={vendorEmailId}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>

        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
      </form>
    </div>
  )
}

// import React, { useState } from 'react';
// import axios from "axios";
// import { Link, useNavigate,} from "react-router-dom";

// export default function AddOrder() {

//   let navigate = useNavigate();

//   const [orders, setOrders] = useState({
//     employeeId: "",
//     dateOfJoining : "",
//     projectEndDate : "",
//     billRate : "",
//     endClientName : "",
//     vendorPhoneNo : "",
//     vendorEmailId : ""
//   });

//   const { employeeId, dateOfJoining, projectEndDate, billRate, endClientName, vendorPhoneNo, vendorEmailId} = orders;

//   const onInputChange = (e) => {
//     setOrders({ ...orders, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post(`http://localhost:8082/employees/${employeeId}/orders`, orders);
//     navigate("/");
//   };

//   return (
//     <div className="form-container">
//           <h2 className="text-center m-4">Add New PurchaseOrder</h2>
//           <form onSubmit={(e) => onSubmit(e)}>
//           <div className="form-row">
//           <div className="form-group">
//               <label htmlFor="employeeId">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Employee ID"
//                 name="employeeId"
//                 value={employeeId}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="dateOfJoining">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Date Of Joining"
//                 name="dateOfJoining"
//                 value={dateOfJoining}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="projectEndDate">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Project End Date"
//                 name="projectEndDate"
//                 value={projectEndDate}
//                 onChange={(e) => onInputChange(e)}
//               />
//             </div>
//             </div>
//             <div className="form-group">
//               <label htmlFor="billRate">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Bill Rate"
//                 name="billRate"
//                 value={billRate}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="endClientName">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="End Client Name"
//                 name="endClientName"
//                 value={endClientName}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//               </div>
//               <div className="form-group">
//               <label htmlFor="vendorPhoneNo">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Vendor PhoneNo"
//                 name="vendorPhoneNo"
//                 value={vendorPhoneNo}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="vendorEmailId">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Vendor EmailId"
//                 name="vendorEmailId"
//                 value={vendorEmailId}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>

//             <button type="submit" className="btn btn-outline-primary">
//               Submit
//             </button>
//             <Link className="btn btn-outline-danger mx-2" to="/">
//               Cancel
//             </Link>
//           </form>
//         </div>
//   )
// }

