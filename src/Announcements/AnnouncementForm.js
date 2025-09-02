import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message as antdMessage, Spin, Checkbox } from "antd";
import axios from "axios";

export default function AnnouncementForm({ onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const [form] = Form.useForm();

  const token = sessionStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch Employees
  useEffect(() => {
    setFetchingEmployees(true);
    axios
      .get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data.content || []))
      .catch(() => setEmployees([]))
      .finally(() => setFetchingEmployees(false));
  }, [token, API_URL]);

  const handleSubmit = async (values) => {
    if (!values.employeeIds || values.employeeIds.length === 0) {
      antdMessage.warning("Please select at least one employee");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/announcements`,
        {
          title: values.title,
          message: values.message,
          type: values.type,
          createdBy: sessionStorage.getItem("id"),
          employeeIds: values.employeeIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      antdMessage.success("Announcement created successfully");
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      antdMessage.error("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl w-[500px]">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Announcement</h2>

      <Spin spinning={fetchingEmployees}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: "INFO" }}
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter announcement title" />
          </Form.Item>

          {/* Message */}
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter a message" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter announcement message" />
          </Form.Item>

          {/* Type */}
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="INFO">Info</Select.Option>
              <Select.Option value="URGENT">Urgent</Select.Option>
              <Select.Option value="EVENT">Event</Select.Option>
            </Select>
          </Form.Item>

          {/* Employees Multi-Select with Checkboxes */}
          <Form.Item
            label="Select Employees"
            name="employeeIds"
            rules={[{ required: true, message: "Please select at least one employee" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select employees"
              optionFilterProp="children"
              showSearch
              loading={fetchingEmployees}
              optionRender={(option) => (
                <div className="flex items-center">
                  <Checkbox checked={form.getFieldValue("employeeIds")?.includes(option.value)}>
                    {option.label}
                  </Checkbox>
                </div>
              )}
            >
              {employees.map((emp) => (
                <Select.Option
                  key={emp.employeeID}
                  value={emp.employeeID}
                  label={`${emp.firstName} ${emp.lastName} (${emp.emailID})`}
                >
                  {emp.firstName} {emp.lastName} ({emp.emailID})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Buttons */}
          <Form.Item className="flex justify-end space-x-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}
