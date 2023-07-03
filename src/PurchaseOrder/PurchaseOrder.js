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

  const loadUsers = async () => {
    const result = await api.get(
      `/employees/${employeeId}/orders`
    );
    const details = await api.get(`/employees/${employeeId}`);
    console.log(details);
    setUsers(result.data);
    setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  };

  const loadUsers = async () => {
    const result = await fetch(
      `${apiUrls}/employees/${employeeId}/orders`
    );
    const details = await fetch(`${apiUrls}/employees/${employeeId}`);
    console.log(details);
    setUsers(result.data);
    setUserDetail({ first: details.data.firstName, last: details.data.lastName });
  };
*/  
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
}
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