import React, { useEffect, useState } from "react";
import { useLocation} from "react-router-dom";

export default function PurchaseOrder() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [userDetail, setUserDetail] = useState({}); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  let location = useLocation();
  const { employeeId } = location.state;

  useEffect(() => {
    loadOrders();
  }, []);

  // const loadOrders = async () => {
  //   try {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow'
  //     };
      
  //     const ordersResponse = await fetch(
  //       `${apiUrl}/employees/${employeeId}/orders`,requestOptions
  //     );
  //     const detailsResponse = await fetch(`${apiUrl}/employees/${employeeId}`);
      
  //     const ordersData = await ordersResponse.json();
  //     const detailsData = await detailsResponse.json();
  //     setOrders(ordersData);
  //     setUserDetail({
  //       first: detailsData.firstName,
  //       last: detailsData.lastName,
  //     });
  //   } catch (error) {
  //     console.error("Error loading orders:", error);
  //   }
  // };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
  
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
  
      const ordersResponse = await fetch(
        `${apiUrl}/employees/${employeeId}/orders`, requestOptions
      );
      const detailsResponse = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      const ordersData = await ordersResponse.json();
      const detailsData = await detailsResponse.json();
      setOrders(ordersData);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">{userDetail.first} {userDetail.last}</h4>
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
            {currentOrders.length > 0 ? (
              currentOrders.map((employeeOrder, index) => (
                <tr key={index}>
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                  <td>{employeeOrder.dateOfJoining}</td>
                  <td>{employeeOrder.projectEndDate}</td>
                  <td>{employeeOrder.endClientName}</td>
                  <td>{employeeOrder.vendorPhoneNo}</td>
                  <td>{employeeOrder.vendorEmailId}</td>
                  <td>
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

/*
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";

export default function PurchaseOrder() {

  const apiUrls = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState({});

  let location = useLocation();
  const { employeeId } = location.state;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  
  useEffect(() => {
    loadUsers();
  }, []);

  // const loadUsers = async () => {
  //   const result = await axios.get(
  //     `http://localhost:8082/employees/${employeeId}/orders`
  //   );
  //   const details = await axios.get(`http://localhost:8082/employees/${employeeId}`);
  //   console.log(details);
  //   setUsers(result.data);
  //   setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  // };

  // const loadUsers = async () => {
  //   const result = await api.get(
  //     `/employees/${employeeId}/orders`
  //   );
  //   const details = await api.get(`/employees/${employeeId}`);
  //   console.log(details);
  //   setUsers(result.data);
  //   setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  // };

  // const loadUsers = async () => {
  //   const result = await fetch(
  //     `${apiUrls}/employees/${employeeId}/orders`
  //   );
  //   const details = await fetch(`${apiUrls}/employees/${employeeId}`);
  //   console.log(details);
  //   setUsers(result.data);
  //   setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  // };
 
  const loadUsers = async () => {
    try {
      const result = await fetch(`${apiUrls}/employees/${employeeId}/orders`);
      const details = await fetch(`${apiUrls}/employees/${employeeId}`);
      const resultData = await result.json();
      const detailsData = await details.json();
      console.log(detailsData);
      setUsers(resultData);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="container">
      <div className="py-4">
        <h4 className="text-center">{userDetail.first} {userDetail.last} Orders</h4>
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
              users.map((employeeOrders, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{employeeOrders.dateOfJoining}</td>
                  <td>{employeeOrders.projectEndDate}</td>
                  <td>{employeeOrders.endClientName}</td>
                  <td>{employeeOrders.vendorPhoneNo}</td>
                  <td>{employeeOrders.vendorEmailId}</td>
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
      <div className="pagination-container">
      <Pagination>
          {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map(
            (item, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>
    </div>
  );
}*/
/*
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  let location = useLocation();
  const { empId } = useParams();
  

  useEffect(() => {
    loadUsers();
    setUsers(location.state);
  
  }, []);
  

  const loadUsers = async () => {
    const result = await axios.get(`http://localhost:8082/employees/${empId}/orders`);
    const details = await axios(`http://localhost:8082/employees/${empId}`);
    console.log(details);
    setUsers(result.data);
    setUserDetail({first : details.data.firstName, last : details.data.lastName})
  };

  return (
    <div className="container">
      <div className="py-4">
        <table className="table border shadow">
            {userDetail.first} {userDetail.last}
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
          
            { users.map((employeePO, index) => (
              <tr>
                <th scope="row" key={index}>
                  {index + 1}
                </th>
                <td>{employeePO.dateOfJoining}</td>
                <td>{employeePO.projectEndDate}</td>
                <td>{employeePO.endClientName}</td>
                <td>{employeePO.vendorPhoneNo}</td>
                <td>{employeePO.vendorEmailId}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
*/