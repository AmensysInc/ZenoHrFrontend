import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DatePicker,Modal } from "antd";
import dayjs from "dayjs";

export default function PurchaseOrderForm({ mode }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  let { orderId, employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const [orders, setOrders] = useState({
    dateOfJoining: "",
    projectEndDate: "",
    billRate: "",
    endClientName: "",
    vendorPhoneNo: "",
    vendorEmailId: "",
  });

  const {
    dateOfJoining,
    projectEndDate,
    billRate,
    endClientName,
    vendorPhoneNo,
    vendorEmailId,
  } = orders;

  const fetchEmployeeDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const employeeResponse = await axios.get(
        `${apiUrl}/employees/${employeeId}`,
        requestOptions
      );

      const { firstName, lastName } = employeeResponse.data;
      setEmployeeDetails({ firstName, lastName });
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    if (mode === "add" || (mode === "edit" && employeeId)) {
      fetchEmployeeDetails();

      if (mode === "edit") {
        const token = sessionStorage.getItem("token");
        const requestOptions = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .get(`${apiUrl}/orders/${orderId}`, requestOptions)
          .then((historyResponse) => {
            setOrders(historyResponse.data);
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });
      }
    }
  }, [mode, employeeId, orderId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(orders),
      };

      const response = await fetch(
        `${apiUrl}/employees${mode === "edit" ? `/orders/${orderId}` : `/${employeeId}/orders`}`,
        requestOptions
      );

      if (response.status === 200 || response.status === 201) {
        showModal();
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "adding"} orders:`,
        error
      );
    }
  };

  const handleNavigate = (employeeId) => {
    navigate(`/orders/${employeeId}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setOrders({
      ...orders,
      [name]: value,
    });
  };
  
  const onInputChangeDate = (date, name) => {
    if (date) {
      setOrders({ ...orders, [name]: date.format("YYYY-MM-DD") });
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      <div className="form-container">
        <h2 className="text-center m-4">
          {isEditMode ? "Edit" : "Add"} Purchase Order
        </h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstName"
              value={employeeDetails.firstName || ""}
              disabled
              />
            </div>
            <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastName"
              value={employeeDetails.lastName || ""}
              disabled
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
            <label htmlFor="dateOfJoining">Date Of Joining</label>
          <DatePicker
            className="form-control"
            name="dateOfJoining"
            value={dateOfJoining ? dayjs(dateOfJoining) : null}
            onChange={(date) => onInputChangeDate(date, "dateOfJoining")}
            required
          />
            </div>
            <div className="form-group col-md-6">
            <label>Project End Date:</label>
              <DatePicker
                type="text"
                name="projectEndDate"
                className="form-control"
                value={projectEndDate ? dayjs(projectEndDate) : null}
                onChange={(date) => onInputChangeDate(date, "projectEndDate")}
                required
              />
            </div>
          </div>
          <div className="form-row">
          <div>
          <label>Bill Rate:</label>
          <input
            type="number"
            name="billRate"
            value={billRate}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="endClientName"
            value={endClientName}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        </div>
        <div className="form-row">
        <div>
          <label>Vendor PhoneNo:</label>
          <input
            type="number"
            name="vendorPhoneNo"
            value={vendorPhoneNo}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div>
          <label>Vendor Email:</label>
          <input
            type="email"
            name="vendorEmailId"
            value={vendorEmailId}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        </div>
        <br/>
          <button type="submit" className="btn btn-outline-primary">
            {isEditMode ? "Update" : "Submit"}
          </button>
          <Link className="btn btn-outline-danger mx-2" to="/">
            Cancel
          </Link>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>PurchaseOrder {isEditMode ? "Updated" : "Added"} successfully</p>
          </Modal>
        </form>
      </div>
    </div>
  )
}
