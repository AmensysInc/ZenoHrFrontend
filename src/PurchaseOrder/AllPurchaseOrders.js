import React, { useEffect, useState } from "react";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button, Modal, Form, DatePicker } from "antd";
import dayjs from "dayjs";

export default function PurchaseOrders() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const [recruiters, setRecruiters] = useState([]);

  // Update Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, searchQuery, searchField]);

  useEffect(() => {
    loadRecruiters();
  }, []);

  const loadOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const searchParams = new URLSearchParams();
      searchParams.append("page", currentPage);
      searchParams.append("size", pageSize);
      if (searchQuery) {
        searchParams.append("searchField", searchField);
        searchParams.append("searchString", searchQuery);
      }
      const requestOptions = {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        redirect: "follow",
      };
      const ordersResponse = await fetch(
        `${apiUrl}/orders?${searchParams.toString()}`,
        requestOptions
      );
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.content);
      setTotalPages(ordersData.totalPages);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const loadRecruiters = async () => {
    try {
      const response = await fetch("http://localhost:8082/users");
      const users = await response.json();
      const recruiterList = users.filter((u) => u.role === "RECRUITER");
      setRecruiters(recruiterList);
    } catch (error) {
      console.error("Error loading recruiters:", error);
    }
  };

  const handleSearch = () => {
    loadOrders();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    loadOrders();
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    form.setFieldsValue({
      employeeFirstName: order.employeeFirstName,
      employeeLastName: order.employeeLastName,
      dateOfJoining: order.dateOfJoining ? dayjs(order.dateOfJoining) : null,
      projectEndDate: order.projectEndDate ? dayjs(order.projectEndDate) : null,
      billRate: order.billRate,
      endClientName: order.endClientName,
      vendorPhoneNo: order.vendorPhoneNo,
      vendorEmailId: order.vendorEmailId,
      netTerms: order.netTerms,
      recruiterName: order.recruiterName,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const token = sessionStorage.getItem("token");

      const payload = {
        ...editingOrder,
        ...values,
        dateOfJoining: values.dateOfJoining
          ? values.dateOfJoining.format("YYYY-MM-DD")
          : null,
        projectEndDate: values.projectEndDate
          ? values.projectEndDate.format("YYYY-MM-DD")
          : null,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      };

      await fetch(`${apiUrl}/orders/${editingOrder.id}`, requestOptions);
      setIsModalOpen(false);
      setEditingOrder(null);
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="col-md-10" style={{ overflowX: "auto" }}>
      {/* Search Section */}
      <div className="search-container">
        <div className="search-bar">
          <Select
            value={searchField}
            onChange={(value) => setSearchField(value)}
            style={{ width: 160 }}
          >
            <Select.Option value="">Select Field</Select.Option>
            <Select.Option value="dateOfJoining">Date Of Joining</Select.Option>
            <Select.Option value="projectEndDate">Project End Date</Select.Option>
            <Select.Option value="billRate">Bill Rate</Select.Option>
            <Select.Option value="endClientName">Client Name</Select.Option>
            <Select.Option value="vendorPhoneNo">Vendor PhoneNo</Select.Option>
            <Select.Option value="vendorEmailId">Vendor EmailID</Select.Option>
            <Select.Option value="netTerms">Net Terms</Select.Option>
            <Select.Option value="recruiterName">Recruiter</Select.Option>
          </Select>
          <Input.Search
            placeholder="Search..."
            onSearch={handleSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            enterButton
          />
        </div>
        <Button onClick={handleClearSearch}>Clear</Button>
      </div>

      {/* Orders Table */}
      <table className="table border shadow">
        <thead>
          <tr>
            <th>S.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date Of Joining</th>
            <th>Project End Date</th>
            <th>Bill Rate</th>
            <th>Client Name</th>
            <th>Vendor PhoneNo</th>
            <th>Vendor Email</th>
            <th>Net Terms</th>
            <th>Recruiter</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((employeeOrder, index) => {
              const userIndex = index + currentPage * pageSize;
              return (
                <tr key={employeeOrder.id || userIndex}>
                  <td>{userIndex + 1}</td>
                  <td>{employeeOrder.employeeFirstName}</td>
                  <td>{employeeOrder.employeeLastName}</td>
                  <td>{employeeOrder.dateOfJoining}</td>
                  <td>{employeeOrder.projectEndDate}</td>
                  <td>{employeeOrder.billRate}</td>
                  <td>{employeeOrder.endClientName}</td>
                  <td>{employeeOrder.vendorPhoneNo}</td>
                  <td>{employeeOrder.vendorEmailId}</td>
                  <td>{employeeOrder.netTerms}</td>
                  <td>{employeeOrder.recruiterName}</td>
                  <td>
                    <Button onClick={() => handleEdit(employeeOrder)}>Edit</Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="12">No Orders</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Update Modal */}
      <Modal
        title="Update Purchase Order"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="employeeFirstName" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="employeeLastName" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="dateOfJoining" label="Date Of Joining">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="projectEndDate" label="Project End Date">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="billRate" label="Bill Rate">
            <Input />
          </Form.Item>
          <Form.Item name="endClientName" label="Client Name">
            <Input />
          </Form.Item>
          <Form.Item name="vendorPhoneNo" label="Vendor PhoneNo">
            <Input />
          </Form.Item>
          <Form.Item name="vendorEmailId" label="Vendor Email">
            <Input />
          </Form.Item>
          <Form.Item name="netTerms" label="Net Terms">
            <Input />
          </Form.Item>
          <Form.Item name="recruiterName" label="Recruiter">
            <Select placeholder="Select Recruiter">
              {recruiters.map((r) => (
                <Select.Option key={r.id} value={`${r.firstname} ${r.lastname}`}>
                  {r.firstname} {r.lastname}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}