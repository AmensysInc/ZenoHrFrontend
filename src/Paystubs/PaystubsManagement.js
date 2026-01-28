import React, { useEffect, useState } from "react";
import { Card, Table, Typography, Button, Modal, Form, Input, Upload, message, Select, Space, DatePicker, InputNumber } from "antd";
import { UploadOutlined, DownloadOutlined, DeleteOutlined, PlusOutlined, DollarOutlined } from "@ant-design/icons";
import axios from "axios";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { fetchEmployees } from "../SharedComponents/services/EmployeeServices";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function PaystubsManagement() {
  const [paystubs, setPaystubs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

  useEffect(() => {
    fetchPaystubs();
    fetchEmployeesList();
  }, []);

  const fetchPaystubs = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/paystubs/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaystubs(response.data || []);
    } catch (error) {
      console.error("Error fetching paystubs:", error);
      message.error("Failed to load paystubs");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const { content } = await fetchEmployees(0, 1000, "", "");
      setEmployees(content || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleUpload = async (values) => {
    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      
      if (fileList.length === 0) {
        message.error("Please select a file to upload");
        return;
      }

      formData.append("employeeId", values.employeeId);
      formData.append("file", fileList[0].originFileObj);
      formData.append("year", values.year.toString());
      formData.append("payPeriodStart", values.payPeriodStart.format("YYYY-MM-DD"));
      formData.append("payPeriodEnd", values.payPeriodEnd.format("YYYY-MM-DD"));
      
      if (values.grossPay) {
        formData.append("grossPay", values.grossPay.toString());
      }
      if (values.netPay) {
        formData.append("netPay", values.netPay.toString());
      }

      await axios.post(`${apiUrl}/paystubs/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Paystub uploaded successfully");
      setUploadModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchPaystubs();
    } catch (error) {
      console.error("Error uploading paystub:", error);
      message.error("Failed to upload paystub: " + (error.response?.data || error.message));
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/paystubs/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Paystub downloaded successfully");
    } catch (error) {
      console.error("Error downloading paystub:", error);
      message.error("Failed to download paystub");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${apiUrl}/paystubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Paystub deleted successfully");
      fetchPaystubs();
    } catch (error) {
      console.error("Error deleting paystub:", error);
      message.error("Failed to delete paystub");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("MM/DD/YYYY");
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.employeeID === employeeId);
    if (employee) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return employeeId;
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
    maxCount: 1,
  };

  const columns = [
    {
      title: "Employee Name",
      key: "employee",
      render: (_, record) => getEmployeeName(record.employee?.employeeID),
    },
    {
      title: "Pay Period",
      key: "payPeriod",
      render: (_, record) => (
        <span>
          {formatDate(record.payPeriodStart)} - {formatDate(record.payPeriodEnd)}
        </span>
      ),
    },
    {
      title: "Month/Year",
      key: "monthYear",
      render: (_, record) => {
        if (record.month && record.year) {
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          return `${monthNames[record.month - 1]} ${record.year}`;
        }
        return "-";
      },
    },
    {
      title: "Gross earnings",
      dataIndex: "grossPay",
      render: (amount) => (
        <Space>
          <DollarOutlined style={{ color: "#52c41a" }} />
          <span style={{ fontWeight: 600 }}>{formatCurrency(amount)}</span>
        </Space>
      ),
    },
    {
      title: "Net Pay",
      dataIndex: "netPay",
      render: (amount) => (
        <Space>
          <DollarOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: 600 }}>{formatCurrency(amount)}</span>
        </Space>
      ),
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      ellipsis: true,
    },
    {
      title: "Uploaded",
      dataIndex: "uploadedAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id, record.fileName)}
          >
            Download
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Delete Paystub",
                content: "Are you sure you want to delete this paystub?",
                onOk: () => handleDelete(record.id),
              });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 0 28px 0",
          margin: "0 28px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            Pay Stubs Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setUploadModalVisible(true)}
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
            }}
          >
            Upload Pay Stub
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={paystubs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} paystubs`,
          }}
        />

        <Modal
          title="Upload Pay Stub"
          open={uploadModalVisible}
          onCancel={() => {
            setUploadModalVisible(false);
            form.resetFields();
            setFileList([]);
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpload}
          >
            <Form.Item
              label="Employee"
              name="employeeId"
              rules={[{ required: true, message: "Please select an employee" }]}
            >
              <Select
                placeholder="Select Employee"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                }
              >
                {employees.map((emp) => (
                  <Option key={emp.employeeID} value={emp.employeeID}>
                    {emp.firstName} {emp.lastName} ({emp.emailID})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Year"
              name="year"
              rules={[{ required: true, message: "Please select year" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={2000}
                max={2100}
                placeholder="Enter year (e.g., 2025)"
              />
            </Form.Item>

            <Form.Item
              label="Pay Period Start"
              name="payPeriodStart"
              rules={[{ required: true, message: "Please select pay period start date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Pay Period End"
              name="payPeriodEnd"
              rules={[{ required: true, message: "Please select pay period end date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Gross earnings"
              name="grossPay"
            >
              <InputNumber
                style={{ width: "100%" }}
                prefix="$"
                min={0}
                step={0.01}
                precision={2}
                placeholder="Enter gross pay amount"
              />
            </Form.Item>

            <Form.Item
              label="Net Pay"
              name="netPay"
            >
              <InputNumber
                style={{ width: "100%" }}
                prefix="$"
                min={0}
                step={0.01}
                precision={2}
                placeholder="Enter net pay amount"
              />
            </Form.Item>

            <Form.Item
              label="Attachment (Paystub)"
              required
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                PDF, DOC, DOCX, XLS, XLSX
              </div>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Upload
                </Button>
                <Button onClick={() => {
                  setUploadModalVisible(false);
                  form.resetFields();
                  setFileList([]);
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </AnimatedPageWrapper>
  );
}

