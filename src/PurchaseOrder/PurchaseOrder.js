import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../PurchaseOrder/PurchaseOrder.css";
import { BiSolidAddToQueue } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";

export default function PurchaseOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  let location = useLocation();
  const { employeeId } = location.state;

  const handleAddOrder = (employeeId) => {
    navigate("/orders/addorder", { state: { employeeId } });
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const ordersResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/orders`,
        requestOptions
      );
      const detailsResponse = await fetch(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );
      const ordersData = await ordersResponse.json();
      const detailsData = await detailsResponse.json();

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentOrders = ordersData.slice(indexOfFirstItem, indexOfLastItem);

      setOrders(currentOrders);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleEditOrder = (orderId) => {
    navigate("/orders/editorder", { state: { employeeId,orderId } });
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">
          {userDetail.first} {userDetail.last}
        </h4>
        <div className="add-orders d-flex justify-content-start">
          <button
            className="btn btn-primary"
            onClick={() => handleAddOrder(employeeId)}
          >
            <BiSolidAddToQueue size={15} />
            Orders
          </button>
        </div>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Date Of Joining</th>
              <th scope="col">Project End Date</th>
              <th scope="col">Bill Rate</th>
              <th scope="col">Client Name</th>
              <th scope="col">Vendor PhoneNo</th>
              <th scope="col">Vendor Email</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((employeeOrder, index) => (
                <tr key={index}>
                  <th scope="row">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </th>
                  <td>{employeeOrder.dateOfJoining}</td>
                  <td>{employeeOrder.projectEndDate}</td>
                  <td>{employeeOrder.billRate}</td>
                  <td>{employeeOrder.endClientName}</td>
                  <td>{employeeOrder.vendorPhoneNo}</td>
                  <td>{employeeOrder.vendorEmailId}</td>
                  <td>
                  <div className="icon-container">
                  <FiEdit2 onClick={() => handleEditOrder(employeeOrder.orderId)} size={20}/>
                  </div>
                </td>
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
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useLocation} from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import "../PurchaseOrder/PurchaseOrder.css";
// import { BiSolidAddToQueue } from "react-icons/bi";

// export default function PurchaseOrder() {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const [orders, setOrders] = useState([]);
//   const [userDetail, setUserDetail] = useState({}); 
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const navigate = useNavigate();
//   let location = useLocation();
//   const { employeeId } = location.state;

//   const handleAddOrder = (employeeId) => {
//     navigate("/addorder", { state: { employeeId } });
//   };
  

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const loadOrders = async () => {
//     try {
//       const token = localStorage.getItem("token");  
//       var myHeaders = new Headers();
//       myHeaders.append("Authorization", `Bearer ${token}`);  
//       var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//       };
  
//       const ordersResponse = await fetch(
//         `${apiUrl}/employees/${employeeId}/orders`, requestOptions
//       );
//       const detailsResponse = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
//       const ordersData = await ordersResponse.json();
//       const detailsData = await detailsResponse.json();
//       setOrders(ordersData);
//       setUserDetail({
//         first: detailsData.firstName,
//         last: detailsData.lastName,
//       });
//     } catch (error) {
//       console.error("Error loading orders:", error);
//     }
//   };
  
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(orders.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <div className="container">
//       <div className="py-4">
//         <h4 className="text-center">{userDetail.first} {userDetail.last}</h4>
//         <div className="add-orders d-flex justify-content-start">
//         <button
//         className="btn btn-primary"
//         onClick={() => handleAddOrder(employeeId)}
//         >
//           <BiSolidAddToQueue size={15}/>
//           Orders
//         </button>
//         </div>
//         <table className="table border shadow">
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
//             {currentOrders.length > 0 ? (
//               currentOrders.map((employeeOrder, index) => (
//                 <tr key={index}>
//                   <th scope="row">{indexOfFirstItem + index + 1}</th>
//                   <td>{employeeOrder.dateOfJoining}</td>
//                   <td>{employeeOrder.projectEndDate}</td>
//                   <td>{employeeOrder.endClientName}</td>
//                   <td>{employeeOrder.vendorPhoneNo}</td>
//                   <td>{employeeOrder.vendorEmailId}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No Orders</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="pagination">
//         {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//           (page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={currentPage === page ? "active" : ""}
//             >
//               {page}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// }