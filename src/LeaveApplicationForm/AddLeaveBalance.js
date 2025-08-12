import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Input, Form, message } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

const LeaveBalanceList = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const token = sessionStorage.getItem("token");
  const { employeeId } = useParams();

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeName(employeeId);
    }
    fetchLeaveTypes();
  }, [employeeId]);

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8082/leave/types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mappedData = response.data.map((type) => ({
        ...type,
        availableDays: null,
        bookedDays: null,
      }));

      setLeaveTypes(mappedData);
    } catch (error) {
      console.error("Error fetching leave types:", error);
      message.error("Failed to fetch leave types");
    }
  };

  const fetchEmployeeName = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setEmployeeName(`${response.data.firstName} ${response.data.lastName}`);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      message.error("Failed to fetch employee details");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      availableDays: record.availableDays,
      bookedDays: record.bookedDays,
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      // First-time creation: If availableDays was null or undefined originally
      if (
        editingRecord.availableDays === null ||
        editingRecord.availableDays === undefined
      ) {
        await axios.post(
          `http://localhost:8082/leave/balances/${employeeId}`,
          {
            availableDays: values.availableDays,
            bookedDays: values.bookedDays,
            leaveType: {
              id: editingRecord.id,
              name: editingRecord.name,
              description: editingRecord.description,
              defaultDays: editingRecord.defaultDays,
            },
            employee: { id: employeeId },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        message.success("Leave balance created successfully!");
      } else {
        // Existing record → update
        await axios.put(
          `http://localhost:8082/leave/balances/${
            editingRecord.id || editingRecord.leaveBalanceId
          }`,
          {
            availableDays: values.availableDays,
            bookedDays: values.bookedDays,
            leaveType: {
              id: editingRecord.id,
              name: editingRecord.name,
              description: editingRecord.description,
              defaultDays: editingRecord.defaultDays,
            },
            employee: { id: employeeId },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        message.success("Leave balance updated successfully!");
      }

      // Update UI instantly
      setLeaveTypes((prev) =>
        prev.map((type) =>
          type.id === editingRecord.id
            ? {
                ...type,
                availableDays: values.availableDays,
                bookedDays: values.bookedDays,
              }
            : type
        )
      );

      setEditingRecord(null);
    } catch (error) {
      console.error("Error saving leave balance:", error);
      message.error("Failed to save leave balance");
    }
  };

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "name",
      key: "name",
    },
    {
  title: "Available Days",
  dataIndex: "availableDays",
  key: "availableDays",
  render: (value) => (value === null ? "" : value),
},
{
  title: "Booked Days",
  dataIndex: "bookedDays",
  key: "bookedDays",
  render: (value) => (value === null ? "" : value),
},
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={`Leave Balances for ${employeeName || "Employee"}`}
      style={{ margin: "20px" }}
    >
      <Table
        dataSource={leaveTypes}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={!!editingRecord}
        title="Edit Leave Balance"
        onCancel={() => setEditingRecord(null)}
        onOk={handleUpdate}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Available Days"
            name="availableDays"
            rules={[{ required: true, message: "Please enter available days" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Booked Days"
            name="bookedDays"
            rules={[{ required: true, message: "Please enter booked days" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LeaveBalanceList;
