import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Select,
  Button,
  Upload,
  Input,
  Table,
  Tag,
  Space,
  Typography,
  message,
  Spin,
  Popconfirm,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function WeekFileUploader() {
  /* =============================
     STATE
  ==============================*/
  const currentYear = dayjs().year();

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(dayjs().format("MMMM"));
  const [week, setWeek] = useState("Week 1");

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const employeeId = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");

  /* =============================
     YEAR & MONTH OPTIONS
  ==============================*/
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear - 3; y <= currentYear + 3; y++) {
      years.push(y.toString());
    }
    return years;
  }, [currentYear]);

  const monthOptions = useMemo(() => dayjs.months(), []);

  /* =============================
     FIXED: WEEK → BACKEND FORMAT
     🔥 W1 instead of W01
  ==============================*/
  const getBackendWeek = () => {
    const weekIndex = Number(week.replace("Week ", "")) - 1;

    const baseDate = dayjs(`${year}-${month}-01`)
      .add(weekIndex * 7, "day");

    const isoWeekNumber = baseDate.isoWeek();

    // ✅ FIX: no leading zero
    return `${year}-W${isoWeekNumber}`;
  };

  /* =============================
     FETCH FILES
  ==============================*/
  const fetchDocuments = async () => {
    if (!employeeId) return;

    setLoading(true);
    try {
      const backendWeek = getBackendWeek();

      const res = await axios.get(
        `http://localhost:8082/employees/${employeeId}/files/week/${backendWeek}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const files = res.data || [];

      const mapped = files.map((fileName, idx) => ({
        id: `${backendWeek}-${idx}`,
        period: backendWeek,
        fileName,
        status: "Uploaded",
      }));

      setDocuments(mapped);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch weekly files");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, []);

  /* =============================
     UPLOAD FILE
  ==============================*/
  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a file");
      return;
    }

    const backendWeek = getBackendWeek();

    const formData = new FormData();
    formData.append("documents", file);
    formData.append("week", backendWeek); // ✅ send week
    formData.append("year", year);
    formData.append("month", month);
    formData.append("description", description || "");

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:8082/employees/${employeeId}/uploadFiles`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("File uploaded successfully");
      setFile(null);
      setDescription("");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      message.error("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     VIEW FILE
  ==============================*/
  const handleViewFile = async (fileName) => {
    try {
      setLoading(true);
      const backendWeek = getBackendWeek();

      const res = await axios.get(
        `http://localhost:8082/employees/${employeeId}/files/week/${backendWeek}/${encodeURIComponent(
          fileName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error(err);
      message.error("Failed to open file");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     DELETE FILE
  ==============================*/
  const handleDelete = async (fileName) => {
    try {
      setLoading(true);
      const backendWeek = getBackendWeek();

      await axios.delete(
        `http://localhost:8082/employees/${employeeId}/files/week/${backendWeek}/${encodeURIComponent(
          fileName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("File deleted successfully");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      message.error("File could not be deleted");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     TABLE CONFIG
  ==============================*/
  const columns = [
    { title: "Period", dataIndex: "period" },
    { title: "File Name", dataIndex: "fileName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewFile(record.fileName)}
          >
            View
          </Button>

          <Popconfirm
            title="Delete this file?"
            onConfirm={() => handleDelete(record.fileName)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* =============================
     UI
  ==============================*/
  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        My Weekly Status Reports
      </Title>

      {/* FILTERS */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Select value={year} onChange={setYear} style={{ width: 120 }}>
            {yearOptions.map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>

          <Select value={month} onChange={setMonth} style={{ width: 160 }}>
            {monthOptions.map((m) => (
              <Option key={m} value={m}>
                {m}
              </Option>
            ))}
          </Select>

          <Select value={week} onChange={setWeek} style={{ width: 120 }}>
            {[1, 2, 3, 4].map((w) => (
              <Option key={w} value={`Week ${w}`}>
                Week {w}
              </Option>
            ))}
          </Select>

          <Button type="primary" onClick={fetchDocuments}>
            Apply
          </Button>
        </Space>
      </Card>

      {/* CONTENT */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* UPLOAD */}
        <Card title="Upload Status Report" style={{ width: 360 }}>
          <p>
            Upload for: <b>{year} / {month} / {week}</b>
          </p>

          <Upload
            beforeUpload={(f) => {
              setFile(f);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>

          <TextArea
            rows={3}
            placeholder="Optional description"
            style={{ marginTop: 12 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            type="primary"
            block
            style={{ marginTop: 16 }}
            onClick={handleUpload}
            loading={loading}
          >
            Upload
          </Button>
        </Card>

        {/* TABLE */}
        <Card title="Uploaded Documents" style={{ flex: 1 }}>
          {loading ? (
            <Spin />
          ) : (
            <Table
              columns={columns}
              dataSource={documents}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: "No documents found" }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
