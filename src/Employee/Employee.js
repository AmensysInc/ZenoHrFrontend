import axios from "axios";
import './Employee.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddUser() {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    dob: "",
    clgOfGrad: "",
    visaStatus: "",
    visaStartDate: null,
    visaExpiryDate: null,
    onBench: ""
  });

  const { firstName, lastName, emailID, dob, clgOfGrad, visaStatus, visaStartDate, visaExpiryDate, onBench } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onVisaStartDateChange = (date) => {
    setUser({ ...user, visaStartDate: date });
  };

  const onVisaExpiryDateChange = (date) => {
    setUser({ ...user, visaExpiryDate: date });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (visaStartDate > visaExpiryDate) {
      alert('Visa start date cannot be after visa expiry date');
      return;
    }
    if (visaExpiryDate < visaStartDate) {
      alert('Visa expiry date cannot be before visa start date');
      return;
    }
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
      };
      
      await fetch(`${apiUrl}/employees`, requestOptions);
      navigate("/");
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  

  return (
    <div className="form-container">
      <h2 className="text-center m-4">Add Employee</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type={"text"}
              className="form-control"
              name="firstName"
              value={firstName}
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type={"text"}
              className="form-control"
              name="lastName"
              value={lastName}
              onChange={(e) => onInputChange(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="emailID">Email Address</label>
          <input
            type={"text"}
            className="form-control"
            name="emailID"
            value={emailID}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth(yyyy-MM-dd)</label>
          <DatePicker
            className="form-control"
            name="dob"
            selected={dob}
            onChange={dob}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clgOfGrad">Name of the college</label>
          <input
            type={"text"}
            className="form-control"
            name="clgOfGrad"
            value={clgOfGrad}
            onChange={(e) => onInputChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="visaStatus">Visa Status</label>
          <select
            id="visaStatus"
            name="visaStatus"
            value={visaStatus}
            onChange={(e) => onInputChange(e)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Working">H1B</option>
            <option value="Bench">L1</option>
          </select>
        </div>
        <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="visaStartDate">Visa Start Date</label>
          <DatePicker
            className="form-control"
            name="visaStartDate"
            selected={visaStartDate}
            onChange={onVisaStartDateChange}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="visaExpiryDate">Visa Expiry Date</label>
          <DatePicker
            className="form-control"
            name="visaExpiryDate"
            selected={visaExpiryDate}
            onChange={onVisaExpiryDateChange}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
      </div>
        <div className="form-group">
          <label htmlFor="onBench">Working or Bench</label>
          <select
            id="onBench"
            name="onBench"
            value={onBench}
            onChange={(e) => onInputChange(e)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Working">onBench</option>
            <option value="Bench">Working</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
        <Link className="btn btn-outline-danger mx-2" to="/">
          Cancel
        </Link>
      </form>
    </div>
  );
}


// import axios from "axios";
// import './Employee.css';
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function AddUser() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   let navigate = useNavigate();

//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     emailID: "",
//     dob: "",
//     clgOfGrad: "",
//     visaStatus: "",
//     visaStartDate: null,
//     visaExpiryDate: null,
//     onBench: ""
//   });

//   const { firstName, lastName, emailID, dob, clgOfGrad, visaStatus, visaStartDate, visaExpiryDate, onBench } = user;

//   const onInputChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const onVisaStartDateChange = (date) => {
//     setUser({ ...user, visaStartDate: date });
//   };

//   const onVisaExpiryDateChange = (date) => {
//     setUser({ ...user, visaExpiryDate: date });
//   };
  
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (visaStartDate > visaExpiryDate) {
//       alert('Visa start date cannot be after visa expiry date');
//       return;
//     }
//     if (visaExpiryDate < visaStartDate) {
//       alert('Visa expiry date cannot be before visa start date');
//       return;
//     }
//     try {
//       const requestOptions = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(user)
//       };
      
//       await fetch(`${apiUrl}/employees`, requestOptions);
//       navigate("/");
//     } catch (error) {
//       console.error('Error adding employee:', error);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2 className="text-center m-4">Add Employee</h2>

//       <form onSubmit={(e) => onSubmit(e)}>
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="FirstName"></label>
//             <input
//               type={"text"}
//               className="form-control"
//               placeholder="First Name"
//               name="firstName"
//               value={firstName}
//               onChange={(e) => onInputChange(e)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="lastName"></label>
//             <input
//               type={"text"}
//               className="form-control"
//               placeholder="Last Name"
//               name="lastName"
//               value={lastName}
//               onChange={(e) => onInputChange(e)}
//             />
//           </div>
//         </div>
//         <div className="form-group">
//           <label htmlFor="Email"></label>
//           <input
//             type={"text"}
//             className="form-control"
//             placeholder="Email Address"
//             name="emailID"
//             value={emailID}
//             onChange={(e) => onInputChange(e)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="DOB"></label>
//           <input
//             type={"text"}
//             className="form-control"
//             placeholder="Date of Birth(yyyy-MM-dd)"
//             name="dob"
//             value={dob}
//             onChange={(e) => onInputChange(e)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="clgOfGrad"></label>
//           <input
//             type={"text"}
//             className="form-control"
//             placeholder="Name of the college"
//             name="clgOfGrad"
//             value={clgOfGrad}
//             onChange={(e) => onInputChange(e)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="visaStatus"></label>
//           <input
//             type={"text"}
//             className="form-control"
//             placeholder="Visa Status"
//             name="visaStatus"
//             value={visaStatus}
//             onChange={(e) => onInputChange(e)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="visaStartDate"></label>
//           <DatePicker
//             className="form-control"
//             placeholderText="Visa Start Date(yyyy-MM-dd)"
//             name="visaStartDate"
//             selected={visaStartDate}
//             onChange={onVisaStartDateChange}
//             dateFormat="yyyy-MM-dd"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="visaExpiryDate"></label>
//           <DatePicker
//             className="form-control"
//             placeholderText="Visa Expiry Date(yyyy-MM-dd)"
//             name="visaExpiryDate"
//             selected={visaExpiryDate}
//             onChange={onVisaExpiryDateChange}
//             dateFormat="yyyy-MM-dd"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="onBench">Working or Bench</label>
//           <select
//             id="onBench"
//             name="onBench"
//             value={onBench}
//             onChange={(e) => onInputChange(e)}
//             required
//           >
//             <option value="">-- Select --</option>
//             <option value="Working">onBench</option>
//             <option value="Bench">Working</option>
//           </select>
//         </div>
//         <button type="submit" className="btn btn-outline-primary">
//           Submit
//         </button>
//         <Link className="btn btn-outline-danger mx-2" to="/">
//           Cancel
//         </Link>
//       </form>
//     </div>
//   );
// }

// import axios from "axios";
// import './Employee.css';
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function AddUser() {
//   let navigate = useNavigate();

//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     emailID: "",
//     dob: "",
//     clgOfGrad: "",
//     visaStatus: "",    
//     visaStartDate: "",
//     visaExpiryDate: "",
//     onBench: ""
//   });

//   const { firstName, lastName, emailID, dob, clgOfGrad, visaStatus, visaStartDate, visaExpiryDate, onBench } = user;

//   const onInputChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (new Date(visaStartDate) > new Date(visaExpiryDate)) {
//       alert('Visa start date cannot be after visa expiry date');
//       return;
//     }
//     if (new Date(visaExpiryDate) < new Date(visaStartDate)) {
//       alert('Visa expiry date cannot be before visa start date');
//       return;
//     }
//     await axios.post("http://localhost:8082/employees", user);
//     navigate("/");
//   };
  

//   return (
//     <div className="form-container">
//           <h2 className="text-center m-4">Add Employee</h2>

//           <form onSubmit={(e) => onSubmit(e)}>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="FirstName">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="First Name"
//                 name="firstName"
//                 value={firstName}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="lastName">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Last Name"
//                 name="lastName"
//                 value={lastName}
//                 onChange={(e) => onInputChange(e)}
//               />
//             </div>
//             </div>
//             <div className="form-group">
//               <label htmlFor="Email">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Email Address"
//                 name="emailID"
//                 value={emailID}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="DOB">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Date of Birth(YYYY-MM-DD)"
//                 name="dob"
//                 value={dob}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//               </div>
//               <div className="form-group">
//               <label htmlFor="clgOfGrad">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Name of the college"
//                 name="clgOfGrad"
//                 value={clgOfGrad}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="visaStatus">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Visa Status"
//                 name="visaStatus"
//                 value={visaStatus}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="visaStartDate">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 placeholder="Visa Start Date"
//                 name="visaStartDate"
//                 value={visaStartDate}
//                 onChange={(e) => onInputChange(e)}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="visaExpiryDate">
//               </label>
//               <input
//                 type={"text"}
//                 className="form-control"
//                 name="visaExpiryDate"
//                 placeholder="Visa Expiry Date"
//                 value={visaExpiryDate}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="onBench">
//               Working or Bench
//               </label>
//               <select
//                 id="onBench"
//                 name="onBench"
//                 value={onBench}
//                 onChange={(e) => onInputChange(e)}
//                 required
//               >
//                 <option value="">-- Select --</option>
//                 <option value="Working">onBench</option>
//                 <option value="Bench">Working</option>
//               </select>
//             </div>
//             <button type="submit" className="btn btn-outline-primary">
//               Submit
//             </button>
//             <Link className="btn btn-outline-danger mx-2" to="/">
//               Cancel
//             </Link>
//           </form>
//         </div>
      
//   );
// }