import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  message,
  Form,
  Popconfirm,
  DatePicker,
  Select,
} from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const ProfitAndLoss = () => {
  const { employeeId } = useParams();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchProfitAndLoss = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${apiUrl}/profit-loss/employee/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDataSource(
        response.data.map((item, index) => ({
          key: item.id, // use actual ID for existing data
          ...item,
          amount: Number(item.amount || 0),
          otherAmount: Number(item.otherAmount || 0),
          totalAmount: Number(item.totalAmount || 0),
        }))
      );
    } catch (error) {
      console.error("Error fetching Profit & Loss:", error);
      message.error("Failed to fetch Profit & Loss data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchProfitAndLoss();
  }, [employeeId]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = { ...newData[index], ...row };

        const hours = parseFloat(item.hours) || 0;
        const rate = parseFloat(item.rate) || 0;
        const otherAmount = parseFloat(item.otherAmount) || 0;
        item.amount = hours * rate;
        item.totalAmount = item.amount + otherAmount;

        item.date = row.date ? dayjs(row.date).format("YYYY-MM-DD") : "";

        const token = sessionStorage.getItem("token");

        if (item.id) {
          // ✅ Update existing record
          await axios.put(
            `${apiUrl}/profit-loss/${item.id}`,
            {
              date: item.date,
              type: item.type,
              hours: hours,
              rate: rate,
              amount: item.amount,
              otherAmount: otherAmount,
              totalAmount: item.totalAmount,
              status: item.status,
              notes: item.notes,
              employee: { id: employeeId }, // send employee id if needed
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          message.success("Record updated successfully!");
        } else {
          // ✅ Create new record
          const response = await axios.post(
            `${apiUrl}/profit-loss/${employeeId}`,
            {
              date: item.date,
              type: item.type,
              hours: hours,
              rate: rate,
              amount: item.amount,
              otherAmount: otherAmount,
              totalAmount: item.totalAmount,
              status: item.status,
              notes: item.notes,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          item.id = response.data.id; // Assign the new id from the server
          message.success("Record added successfully!");
        }

        newData[index] = item;
        setDataSource(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validate or Save Failed:", errInfo);
      message.error("Save failed!");
    }
  };

  const handleCellChange = (key, field, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = { ...newData[index], [field]: value };

      const hours = parseFloat(item.hours) || 0;
      const rate = parseFloat(item.rate) || 0;
      const otherAmount = parseFloat(item.otherAmount) || 0;

      if (field === "hours" || field === "rate") {
        item.amount = hours * rate;
        item.totalAmount = item.amount + otherAmount;
      }

      if (field === "amount" || field === "otherAmount") {
        const amount = parseFloat(item.amount) || 0;
        item.totalAmount = amount + otherAmount;
      }

      newData[index] = item;
      setDataSource(newData);
    }
  };

  const handleAddRow = () => {
    const newKey = Date.now();
    const newRow = {
      key: newKey,
      id: null, // no id for new row
      date: null,
      type: "",
      hours: 0,
      rate: 0,
      amount: 0,
      otherAmount: 0,
      totalAmount: 0,
      status: "",
      notes: "",
    };
    setDataSource([...dataSource, newRow]);
    edit(newRow);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="date"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please input date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        ) : (
          record.date
        ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="type"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please select type!" }]}
          >
            <Select placeholder="Select Type">
              <Option value="Revenue">Revenue</Option>
              <Option value="Payment">Payment</Option>
              <Option value="Expense">Expense</Option>
            </Select>
          </Form.Item>
        ) : (
          record.type
        ),
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="hours"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please input hours!" }]}
          >
            <Input
              type="number"
              onChange={(e) =>
                handleCellChange(record.key, "hours", e.target.value)
              }
            />
          </Form.Item>
        ) : (
          record.hours
        ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="rate"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please input rate!" }]}
          >
            <Input
              type="number"
              onChange={(e) =>
                handleCellChange(record.key, "rate", e.target.value)
              }
            />
          </Form.Item>
        ) : (
          Number(record.rate || 0).toFixed(2)
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="amount"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please input amount!" }]}
          >
            <Input
              type="number"
              onChange={(e) =>
                handleCellChange(record.key, "amount", e.target.value)
              }
            />
          </Form.Item>
        ) : (
          Number(record.amount || 0).toFixed(2)
        ),
    },
    {
      title: "Other Amount",
      dataIndex: "otherAmount",
      key: "otherAmount",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="otherAmount"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please input other amount!" }]}
          >
            <Input
              type="number"
              onChange={(e) =>
                handleCellChange(record.key, "otherAmount", e.target.value)
              }
            />
          </Form.Item>
        ) : (
          Number(record.otherAmount || 0).toFixed(2)
        ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      editable: false,
      render: (_, record) => Number(record.totalAmount || 0).toFixed(2),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item
            name="status"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select placeholder="Select Status">
              <Option value="Pending">Pending</Option>
              <Option value="Received">Received</Option>
              <Option value="Paid">Paid</Option>
            </Select>
          </Form.Item>
        ) : (
          record.status
        ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <Form.Item name="notes" style={{ margin: 0 }}>
            <Input />
          </Form.Item>
        ) : (
          record.notes
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button type="link" onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h4>Profit & Loss</h4>
      <Button
        onClick={handleAddRow}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add Row
      </Button>
      <Form form={form} component={false}>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          rowKey="key"
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default ProfitAndLoss;