import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

export default function PurchaseOrder() {
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  let location = useLocation();
  const { employeeId } = location.state;

  useEffect(() => {
    loadUsers();
  }, []);
/*
  const loadUsers = async () => {
    const result = await axios.get(
      `http://localhost:8082/employees/${employeeId}/orders`
    );
    const details = await axios.get(`http://localhost:8082/employees/${employeeId}`);
    console.log(details);
    setUsers(result.data);
    setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  };
*/

  const loadUsers = async () => {
    const result = await api.get(
      `/employees/${employeeId}/orders`
    );
    const details = await api.get(`/employees/${employeeId}`);
    console.log(details);
    setUsers(result.data);
    setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  };

  return (
    <div className="container">
      <div className="py-4">
      {userDetail.first} {userDetail.last}
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Date Of Joining</th>
              <th scope="col">Project End Date</th>
              <th scope="col">Client Name</th>
              <th scope="col">Vendor PhoneNo</th>
              <th scope="col">Vendor Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((employeePO, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{employeePO.dateOfJoining}</td>
                  <td>{employeePO.projectEndDate}</td>
                  <td>{employeePO.endClientName}</td>
                  <td>{employeePO.vendorPhoneNo}</td>
                  <td>{employeePO.vendorEmailId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Orders</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import axios from "axios";

// export default function Home() {
//   const [users, setUsers] = useState([]);
//   const [userDetail, setUserDetail] = useState({});
//   let location = useLocation();
//   const { empId } = useParams();
  

//   useEffect(() => {
//     loadUsers();
//     setUsers(location.state);
  
//   }, []);
  

//   const loadUsers = async () => {
//     const result = await axios.get(`http://localhost:8082/employees/${empId}/orders`);
//     const details = await axios(`http://localhost:8082/employees/${empId}`);
//     console.log(details);
//     setUsers(result.data);
//     setUserDetail({first : details.data.firstName, last : details.data.lastName})
//   };

//   return (
//     <div className="container">
//       <div className="py-4">
//         <table className="table border shadow">
//             {userDetail.first} {userDetail.last}
//           <thead>
//             <tr>
//               <th scope="col">S.No</th>
//               <th scope="col">Date Of Joining</th>
//               <th scope="col">Project End Date</th>
//               <th scope="col">Client Name</th>
//               <th scope="col">Vendor PhoneNo</th>
//               <th scope="col">Vendor Email</th>
//             </tr>
//           </thead>
//           <tbody>
          
//             { users.map((employeePO, index) => (
//               <tr>
//                 <th scope="row" key={index}>
//                   {index + 1}
//                 </th>
//                 <td>{employeePO.dateOfJoining}</td>
//                 <td>{employeePO.projectEndDate}</td>
//                 <td>{employeePO.endClientName}</td>
//                 <td>{employeePO.vendorPhoneNo}</td>
//                 <td>{employeePO.vendorEmailId}</td>
//                 </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }