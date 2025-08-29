// import React, { useEffect, useState } from "react";
// import { Table, Tag, Spin, message as antdMessage } from "antd";
// import axios from "axios";

// export default function AnnouncementGrid() {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const token = sessionStorage.getItem("token");

//   // Convert [year,month,day,hour,minute,second] → JS Date
//   const formatDateArray = (arr) => {
//     if (!arr || arr.length < 3) return "-";
//     const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
//     return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
//   };

//   const fetchAnnouncements = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:8082/announcements", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAnnouncements(res.data || []); // ✅ direct array
//     } catch (err) {
//       console.error(err);
//       antdMessage.error("Failed to fetch announcements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//       render: (text) => <span className="font-medium">{text}</span>,
//     },
//     {
//       title: "Message",
//       dataIndex: "message",
//       key: "message",
//       ellipsis: true,
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//       render: (type) => {
//         let color = "blue";
//         if (type === "URGENT") color = "red";
//         else if (type === "EVENT") color = "green";
//         return <Tag color={color}>{type}</Tag>;
//       },
//     },
//     {
//       title: "Created By",
//       dataIndex: "createdBy",
//       key: "createdBy",
//     },
//     {
//       title: "Date",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (dateArr) => formatDateArray(dateArr),
//     },
//     {
//       title: "Recipients",
//       dataIndex: "recipients",
//       key: "recipients",
//       render: (recipients) => (recipients ? recipients.length : 0),
//     },
//   ];

//   return (
//     <div className="p-6 bg-white shadow-xl rounded-2xl">
//       <h2 className="text-2xl font-bold mb-4">Announcements</h2>
//       <Spin spinning={loading}>
//         <Table
//           columns={columns}
//           dataSource={announcements}
//           rowKey={(record) => record.id}
//           pagination={{ pageSize: 10 }}
//         />
//       </Spin>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message as antdMessage, Badge } from "antd";
import axios from "axios";

export default function EmployeeAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const employeeId = sessionStorage.getItem("id"); // 👈 employee id stored in sessionStorage

  // Convert [year,month,day,hour,minute,second] → JS Date
  const formatDateArray = (arr) => {
    if (!arr || arr.length < 3) return "-";
    const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8082/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter only announcements where current employee is a recipient
      const employeeAnnouncements = res.data.filter((a) =>
        a.recipients.some((r) => r.employeeId === employeeId)
      );

      setAnnouncements(employeeAnnouncements);
    } catch (err) {
      console.error(err);
      antdMessage.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue";
        if (type === "URGENT") color = "red";
        else if (type === "EVENT") color = "green";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateArr) => formatDateArray(dateArr),
    },
    {
      title: "Status",
      dataIndex: "recipients",
      key: "status",
      render: (recipients) => {
        const rec = recipients.find((r) => r.employeeId === employeeId);
        return rec?.readStatus ? (
          <Badge status="success" text="Read" />
        ) : (
          <Badge status="warning" text="Unread" />
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">My Announcements</h2>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={announcements}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
        />
      </Spin>
    </div>
  );
}
