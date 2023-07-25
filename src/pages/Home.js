import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { CiLocationArrow1 } from "react-icons/ci";
import { HiShoppingCart } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";

export default function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/employees?page=${currentPage}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }

      const jsonData = await response.json();
      setUsers(jsonData.content);
      setTotalPages(jsonData.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
  };

  const handleViewTracking = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };

  const handleEditEmployee = (employeeId) => {
    navigate("/editemployee", { state: { employeeId } });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const range = 2;
    const paginationItems = [];
    const startPage = Math.max(currentPage - range, 0); 
    const endPage = Math.min(currentPage + range, totalPages - 1);
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePagination(i)}
        >
          <span className="page-link">{i + 1}</span>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li
            className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
            onClick={() => handlePagination(0)}
          >
            <span className="page-link">First</span>
          </li>
          {paginationItems}
          <li
            className={`page-item ${
              currentPage === totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => handlePagination(totalPages - 1)}
          >
            <span className="page-link">Last</span>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">Employee details</h4>
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
              users.map((employee, index) => {
                const userIndex = index + currentPage * pageSize;
                return (
                  <tr key={userIndex}>
                    <th scope="row">{userIndex + 1}</th>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.emailID}</td>
                    <td>{employee.visaStatus}</td>
                    <td>{employee.dob}</td>
                    <td>{employee.clgOfGrad}</td>
                    <td>{employee.visaStartDate}</td>
                    <td>{employee.visaExpiryDate}</td>
                    <td>{employee.onBench ? "Yes" : "No"}</td>
                    <td>
                    <div className="icon-container">
                        <FiEdit2
                          onClick={() => handleEditEmployee(employee.employeeID)}
                          size={20}
                          title="Edit Employee"
                        />
                        <HiShoppingCart
                          onClick={() => handleViewOrders(employee.employeeID)}
                          size={20}
                          title="Purchase Orders"
                        />
                        <CiLocationArrow1
                          onClick={() => handleViewTracking(employee.employeeID)}
                          size={20}
                          title="WithHold Tracking"
                        />
                        <AiFillDelete
                          onClick={() => handleDeleteEmployee(employee.employeeID)}
                          size={20}
                          className="delete-icon"
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import "./Home.css";
// import { useNavigate } from "react-router-dom";
// import { GrView } from "react-icons/gr";
// import { FaUserEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";

// export default function Home() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const [users, setUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, [currentPage, pageSize]);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${apiUrl}/employees?page=${currentPage}&size=${pageSize}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch data from the server");
//       }

//       const jsonData = await response.json();
//       setUsers(jsonData.content);
//       setTotalPages(jsonData.totalPages);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleViewOrders = (employeeId) => {
//     navigate(`/orders`, { state: { employeeId } });
//   };

//   const handleViewTracking = (employeeId) => {
//     navigate("/tracking", { state: { employeeId } });
//   };

//   const handleEditEmployee = (employeeId) => {
//     navigate("/editemployee", { state: { employeeId } });
//   };

//   const handleDeleteEmployee = async (employeeId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting employee:", error);
//     }
//   };

//   const handlePagination = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   useEffect(() => {
//     fetchData();
//     setCurrentPage(0);
//   }, [pageSize]);

//   // const renderPagination = () => {
//   //   const paginationItems = [];
//   //   for (let i = 0; i < totalPages; i++) {
//   //     paginationItems.push(
//   //       <li
//   //         key={i}
//   //         className={`page-item ${i === currentPage ? "active" : ""}`}
//   //         onClick={() => handlePagination(i)}
//   //       >
//   //         <span className="page-link">{i + 1}</span>
//   //       </li>
//   //     );
//   //   }
//   //   return (
//   //     <nav>
//   //       <ul className="pagination justify-content-center">
//   //         <li
//   //           className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
//   //           onClick={() => handlePagination(0)}
//   //         >
//   //           <span className="page-link">First</span>
//   //         </li>
//   //         <li
//   //           className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
//   //           onClick={() => handlePagination(currentPage - 1)}
//   //         >
//   //           <span className="page-link">&laquo; Previous</span>
//   //         </li>
//   //         {paginationItems}
//   //         <li
//   //           className={`page-item ${
//   //             currentPage === totalPages - 1 ? "disabled" : ""
//   //           }`}
//   //           onClick={() => handlePagination(currentPage + 1)}
//   //         >
//   //           <span className="page-link">Next &raquo;</span>
//   //         </li>
//   //         <li
//   //           className={`page-item ${
//   //             currentPage === totalPages - 1 ? "disabled" : ""
//   //           }`}
//   //           onClick={() => handlePagination(totalPages - 1)}
//   //         >
//   //           <span className="page-link">Last</span>
//   //         </li>
//   //       </ul>
//   //     </nav>
//   //   );
//   // };

// const renderPagination = () => {
//   // Define the range of pagination buttons to display before and after the current page
//   const range = 2;

//   // Initialize an array to store the pagination items
//   const paginationItems = [];

//   // Calculate the start and end pages based on the current page
//   const startPage = Math.max(currentPage - range, 0); // Ensure the start page is not less than 0
//   const endPage = Math.min(currentPage + range, totalPages - 1); // Ensure the end page is not greater than the total number of pages minus 1

//   // Generate the pagination items within the desired range
//   for (let i = startPage; i <= endPage; i++) {
//     paginationItems.push(
//       <li
//         key={i}
//         className={`page-item ${i === currentPage ? "active" : ""}`}
//         onClick={() => handlePagination(i)}
//       >
//         <span className="page-link">{i + 1}</span>
//       </li>
//     );
//   }

//   // Render the pagination component
//   return (
//     <nav>
//       <ul className="pagination justify-content-center">
//         <li
//           className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
//           onClick={() => handlePagination(0)}
//         >
//           <span className="page-link">First</span>
//         </li>
//         <li
//           className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
//           onClick={() => handlePagination(currentPage - 1)}
//         >
//           <span className="page-link">&laquo; Previous</span>
//         </li>
//         {paginationItems}
//         <li
//           className={`page-item ${
//             currentPage === totalPages - 1 ? "disabled" : ""
//           }`}
//           onClick={() => handlePagination(currentPage + 1)}
//         >
//           <span className="page-link">Next &raquo;</span>
//         </li>
//         <li
//           className={`page-item ${
//             currentPage === totalPages - 1 ? "disabled" : ""
//           }`}
//           onClick={() => handlePagination(totalPages - 1)}
//         >
//           <span className="page-link">Last</span>
//         </li>
//       </ul>
//     </nav>
//   );
// };


//   return (
//     <div className="container">
//       <div className="py-4">
//         <h4 className="text-center">Employee details</h4>
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
//               <th scope="col">View Orders</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((employee, index) => {
//                 const userIndex = index + currentPage * pageSize;
//                 return (
//                   <tr key={userIndex}>
//                     <th scope="row">{userIndex + 1}</th>
//                     <td>{employee.firstName}</td>
//                     <td>{employee.lastName}</td>
//                     <td>{employee.emailID}</td>
//                     <td>{employee.visaStatus}</td>
//                     <td>{employee.dob}</td>
//                     <td>{employee.clgOfGrad}</td>
//                     <td>{employee.visaStartDate}</td>
//                     <td>{employee.visaExpiryDate}</td>
//                     <td>{employee.onBench ? "Yes" : "No"}</td>
//                     <td>
//                       <div className="unique">
//                         <FaUserEdit
//                           onClick={() => handleEditEmployee(employee.employeeID)}
//                           size={30}
//                         />
//                       </div>
//                       <div className="unique">
//                         <GrView
//                           onClick={() => handleViewOrders(employee.employeeID)}
//                           size={15}
//                         />{" "}
//                         Orders
//                       </div>
//                       <div className="unique">
//                         <GrView
//                           onClick={() => handleViewTracking(employee.employeeID)}
//                           size={15}
//                         />{" "}
//                         Tracking
//                       </div>
//                       <div className="unique">
//                         <AiFillDelete
//                           onClick={() => handleDeleteEmployee(employee.employeeID)}
//                           size={25}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="11">No users found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {renderPagination()}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import "./Home.css";
// import { useNavigate } from "react-router-dom";
// import { GrView } from "react-icons/gr";
// import { FaUserEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";

// export default function Home() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const [users, setUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, [currentPage, pageSize]);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${apiUrl}/employees?page=${currentPage}&size=${pageSize}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch data from the server");
//       }

//       const jsonData = await response.json();
//       setUsers(jsonData.content);
//       setTotalPages(jsonData.totalPages);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleViewOrders = (employeeId) => {
//     navigate(`/orders`, { state: { employeeId } });
//   };

//   const handleViewTracking = (employeeId) => {
//     navigate("/tracking", { state: { employeeId } });
//   };

//   const handleEditEmployee = (employeeId) => {
//     navigate("/editemployee", { state: { employeeId } });
//   };

//   const handleDeleteEmployee = async (employeeId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestOptions = {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting employee:", error);
//     }
//   };

//   const handlePagination = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   useEffect(() => {
//     fetchData();
//     setCurrentPage(0);
//   }, [pageSize]);

//   const renderPagination = () => {
//     const paginationItems = [];
//     for (let i = 0; i < totalPages; i++) {
//       paginationItems.push(
//         <li
//           key={i}
//           className={`page-item ${i === currentPage ? "active" : ""}`}
//           onClick={() => handlePagination(i)}
//         >
//           <span className="page-link">{i + 1}</span>
//         </li>
//       );
//     }
//     return (
//       <nav>
//         <ul className="pagination justify-content-center">
//           <li
//             className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
//             onClick={() => handlePagination(0)}
//           >
//             <span className="page-link">First</span>
//           </li>
//           <li
//             className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
//             onClick={() => handlePagination(currentPage - 1)}
//           >
//             <span className="page-link">&laquo; Previous</span>
//           </li>
//           {paginationItems}
//           <li
//             className={`page-item ${
//               currentPage === totalPages - 1 ? "disabled" : ""
//             }`}
//             onClick={() => handlePagination(currentPage + 1)}
//           >
//             <span className="page-link">Next &raquo;</span>
//           </li>
//           <li
//             className={`page-item ${
//               currentPage === totalPages - 1 ? "disabled" : ""
//             }`}
//             onClick={() => handlePagination(totalPages - 1)}
//           >
//             <span className="page-link">Last</span>
//           </li>
//         </ul>
//       </nav>
//     );
//   };

//   return (
//     <div className="container">
//       <div className="py-4">
//         <h4 className="text-center">Employee details</h4>
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
//               <th scope="col">View Orders</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((employee, index) => (
//                 <tr key={index }>
//                   <th scope="row">{index + 1}</th>
//                   <td>{employee.firstName}</td>
//                   <td>{employee.lastName}</td>
//                   <td>{employee.emailID}</td>
//                   <td>{employee.visaStatus}</td>
//                   <td>{employee.dob}</td>
//                   <td>{employee.clgOfGrad}</td>
//                   <td>{employee.visaStartDate}</td>
//                   <td>{employee.visaExpiryDate}</td>
//                   <td>{employee.onBench ? "Yes" : "No"}</td>
//                   <td>
//                     <div className="unique">
//                       <FaUserEdit
//                         onClick={() => handleEditEmployee(employee.employeeID)}
//                         size={30}
//                       />
//                     </div>
//                     <div className="unique">
//                       <GrView
//                         onClick={() => handleViewOrders(employee.employeeID)}
//                         size={15}
//                       />{" "}
//                       Orders
//                     </div>
//                     <div className="unique">
//                       <GrView
//                         onClick={() => handleViewTracking(employee.employeeID)}
//                         size={15}
//                       />{" "}
//                       Tracking
//                     </div>
//                     <div className="unique">
//                       <AiFillDelete
//                         onClick={() => handleDeleteEmployee(employee.employeeID)}
//                         size={25}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="11">No users found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {renderPagination()}
//       </div>
//     </div>
//   );
// }




/*
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

export default function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch("http://localhost:8082/employees", requestOptions)
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
      const jsonData = await response.json();
      setUsers(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
  };

  const handleViewTracking = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };

  const handleEditEmployee = (employeeId) => {
    navigate("/editemployee", { state: { employeeId } });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");

      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">Employee details</h4>
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
              <th scope="col">View Orders</th>
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
                  <td>
                    <div className="unique">
                      <FaUserEdit onClick={() => handleEditEmployee(employee.employeeID)} size={30} />
                    </div>
                    <div className="unique">
                      <GrView onClick={() => handleViewOrders(employee.employeeID)} size={15} /> Orders
                    </div>
                    <div className="unique">
                      <GrView onClick={() => handleViewTracking(employee.employeeID)} size={15} /> Tracking
                    </div>
                    <div className="unique">
                      <AiFillDelete onClick={() => handleDeleteEmployee(employee.employeeID)} size={25} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage(page > 0 ? page - 1 : 0)}
          disabled={page === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={users.length === 0 || users.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}
*/


/*
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate} from "react-router-dom";
import { GrView } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

export default function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch("http://localhost:8082/employees", requestOptions)
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
      const jsonData = await response.json();
      setUsers(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
  };

  const handleViewTracking = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };

  const handleEditEmployee = (employeeId) => {
    navigate("/editemployee", { state: { employeeId } });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");

      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">Employee details</h4>
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
              <th scope="col">View Orders</th>
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
                  <td>
                  <div className="unique">
                    <FaUserEdit onClick={() => handleEditEmployee(employee.employeeID)} size={30}/>
                  </div>
                  <div className="unique">
                    <GrView onClick={() => handleViewOrders(employee.employeeID)} size={15}/> Orders
                  </div>
                  <div className="unique">
                    <GrView onClick={() =>handleViewTracking(employee.employeeID)} size={15}/> Tracking
                  </div>
                  <div className="unique">
                    <AiFillDelete onClick={() => handleDeleteEmployee(employee.employeeID)} size={25}/>
                   </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
*/



/*
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate, NavLink } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

export default function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showAddOrdersLink, setShowAddOrdersLink] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
     fetchData();
  }, []);

  const fetchData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch("http://localhost:8082/employees", requestOptions)
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
      const jsonData = await response.json();
      setUsers(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewOrders = (employeeId) => {
    navigate(`/orders`, { state: { employeeId } });
    setShowAddOrdersLink(true);
  };

  const handleViewTracking = (employeeId) => {
    navigate("/tracking", { state: { employeeId } });
  };
  
  const handleEditEmployee = (employeeId) => {
    navigate("/editemployee", { state: { employeeId } });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
  
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      fetchData();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="py-4">
        
        <h4 className="text-center">Employee details</h4>
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
              <th scope="col">View Orders</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((employee, index) => (
                <tr key={index}>
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.emailID}</td>
                  <td>{employee.visaStatus}</td>
                  <td>{employee.dob}</td>
                  <td>{employee.clgOfGrad}</td>
                  <td>{employee.visaStartDate}</td>
                  <td>{employee.visaExpiryDate}</td>
                  <td>{employee.onBench ? "Yes" : "No"}</td>
                  <td>
                  <div className="unique">
                    <FaUserEdit onClick={() => handleEditEmployee(employee.employeeID)} size={30}/>
                  </div>
                  <div className="unique">
                    <GrView onClick={() => handleViewOrders(employee.employeeID)} size={15}/> Orders
                  </div>
                  <div className="unique">
                    <GrView onClick={() =>handleViewTracking(employee.employeeID)} size={15}/> Tracking
                  </div>
                  <div className="unique">
                    <AiFillDelete onClick={() => handleDeleteEmployee(employee.employeeID)} size={25}/>
                   </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
      </div>
      {showAddOrdersLink && (
        <NavLink className="btn btn-outline-light" to="/addorders">
          Add Orders
        </NavLink>
        
      )}
    </div>
  );
}
*/
