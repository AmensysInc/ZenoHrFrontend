import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showAddOrdersLink, setShowAddOrdersLink] = useState(false);
/*
  useEffect(() => {
    const result = axios.get("http://localhost:8082/employees");
    result
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
  }, []);
*/
  
useEffect(() => {
  const result = api.get("/employees");
  result
    .then((response) => {
      setUsers(response.data);
    })
    .catch((error) => console.log(error));
}, []);


  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
    setShowAddOrdersLink(true);
  };

  return (
    <div className="container">
      <div className="py-4">
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">EmailID</th>
              <th scope="col">Visa Status</th>
              <th scope="col">Date Of Birth</th>
              <th scope="col">College Graduation</th>
              <th scope="col">Visa StartDate</th>
              <th scope="col">Visa EndDate</th>
              <th scope="col">Working Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((employee, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.emailID}</td>
                  <td>{employee.visaStatus}</td>
                  <td>{employee.dob}</td>
                  <td>{employee.clgOfGrad}</td>
                  <td>{employee.visaStartDate}</td>
                  <td>{employee.visaExpiryDate}</td>
                  <td>{employee.onBench ? "Yes" : "No"}</td>
                  {employee.length === 0 && (
                    <tr>
                      <td colSpan="8">No record found</td>
                    </tr>
                  )}
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewOrders(employee.employeeID)}
                    >
                      View Orders
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showAddOrdersLink && (
        <NavLink className="btn btn-outline-light" to="/addorders">
          Add Orders
        </NavLink>
      )}
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import {useNavigate , NavLink} from "react-router-dom";
// import axios from "axios";

// export default function Home() {
//   const [users, setUsers] = useState([]);
//   let navigate = useNavigate();

//   useEffect(() => {
//     const result =  axios.get("http://localhost:8082/employees");
//     result.then((response) => {
//       setUsers(response.data);
//     }).catch(error => console.log(error));
//   }, []);



//   return (
//     <div className="container">
//       <div className="py-4">
//         <table className="table border shadow">
//           <thead>
//             <tr>
//               <th scope="col">S.No</th>
//               <th scope="col">FirstName</th>
//               <th scope="col">LastName</th>
//               <th scope="col">EmailID</th>
//               <th scope="col">Visa Status</th>
//               <th scope="col">Date Of Birth</th> 
//               <th scope="col">College Graduation</th>
//               <th scope="col">Visa StartDate</th>
//               <th scope="col">Visa EndDate</th>
//               <th scope="col">Working Status</th>
//               {/* <th scope="col">Action</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {users && users.length > 0 && users.map((employee, index) => {
//               return(
//               <tr key={Math.random()}>
//                 <th scope="row" key={index}>
//                   {index+1}
//                 </th>
//                 <td>{employee.firstName}</td>
//                 <td>{employee.lastName}</td>
//                 <td>{employee.emailID}</td>
//                 <td>{employee.visaStatus}</td>
//                 <td>{employee.dob}</td>
//                 <td>{employee.clgOfGrad}</td>
//                 <td>{employee.visaStartDate}</td>
//                 <td>{employee.visaExpiryDate}</td>
//                 <td>{employee.onBench ? 'Yes' : 'No'}</td>
//                 {
//                 !employee.length ===  0  && 
//                 <tr>
//                     <td colSpan='8'> No record found</td>
//                 </tr>
//             }
//               {/* <NavLink to={`/orders/${employee.employeeID}`}>View Orders </NavLink> */}

//               <NavLink to={`/orders`} state={{ employeeId: employee.employeeID }}>View Orders</NavLink>

//               </tr>
// )})}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
