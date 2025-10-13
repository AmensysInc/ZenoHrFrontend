import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Card,
  Button,
  Select,
  Input,
  Typography,
  Tooltip,
  message,
} from "antd";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import { getUserDetails } from "../SharedComponents/services/OrderService";
import { getVisaForEmployee } from "../SharedComponents/services/VisaDetailsService";

const { Title } = Typography;

export default function VisaDetails() {
  const [visaDetails, setVisaDetails] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");

  const navigate = useNavigate();
  const { employeeId } = useParams();

  useEffect(() => {
    if (employeeId) {
      fetchVisaDetails();
    }
  }, [currentPage, pageSize, employeeId, searchQuery, searchField]);

  const fetchVisaDetails = async () => {
    setLoading(true);
    try {
      const detailsData = await getUserDetails(employeeId);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });

      const data = await getVisaForEmployee(
        employeeId,
        currentPage,
        pageSize,
        searchQuery,
        searchField
      );

      setVisaDetails(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching visa details:", error);
      message.error("Failed to load visa details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDetails = (employeeId, visaId) => {
    navigate(`/editemployee/${employeeId}/visa-details/${visaId}/editvisadetails`);
  };

  const handleAddDetails = () => {
    navigate(`/editemployee/${employeeId}/visa-details/add-visa-details`);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchVisaDetails();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    setCurrentPage(0);
    fetchVisaDetails();
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + currentPage * pageSize,
      width: 70,
      align: "center",
    },
    {
      title: "Visa Start Date",
      dataIndex: "visaStartDate",
      sorter: (a, b) => a.visaStartDate.localeCompare(b.visaStartDate),
    },
    {
      title: "Visa Expiry Date",
      dataIndex: "visaExpiryDate",
      sorter: (a, b) => a.visaExpiryDate.localeCompare(b.visaExpiryDate),
    },
    {
      title: "Visa Type",
      dataIndex: "visaType",
    },
    {
      title: "I94 Date",
      dataIndex: "i94Date",
    },
    {
      title: "LCA Number",
      dataIndex: "lcaNumber",
    },
    {
      title: "LCA Wage",
      dataIndex: "lcaWage",
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
    },
    {
      title: "I140 Status",
      dataIndex: "i140Status",
    },
    {
      title: "GC Status",
      dataIndex: "gcStatus",
    },
    {
      title: "Attorney",
      dataIndex: "attorney",
    },
    {
      title: "Receipt",
      dataIndex: "receipt",
    },
    {
      title: "Residential Address",
      dataIndex: "residentialAddress",
    },
    {
      title: "Comments",
      dataIndex: "comments",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Edit Visa Details">
          <Button
            type="text"
            icon={<FiEdit2 size={18} />}
            onClick={() => handleEditDetails(employeeId, record.visaId)}
          />
        </Tooltip>
      ),
    },
  ];

  const fieldOptions = [
    { value: "", label: "Select Field" },
    { value: "visaStartDate", label: "Visa Start Date" },
    { value: "visaExpiryDate", label: "Visa End Date" },
    { value: "visaType", label: "Visa Type" },
    { value: "i94Date", label: "I94 Date" },
    { value: "lcaNumber", label: "LCA Number" },
    { value: "jobTitle", label: "Job Title" },
    { value: "i140Status", label: "I140 Status" },
    { value: "gcStatus", label: "GC Status" },
    { value: "attorney", label: "Attorney" },
    { value: "receipt", label: "Receipt" },
    { value: "residentialAddress", label: "Residential Address" },
    { value: "comments", label: "Comments" },
  ];

  return (
    <div className="p-4">
      <Card bordered className="shadow-sm">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Title level={4} className="m-0">
            {userDetail.first} {userDetail.last} — Visa Details
          </Title>
          <Button
            type="primary"
            icon={<BiSolidAddToQueue size={16} />}
            onClick={handleAddDetails}
          >
            Add Visa Details
          </Button>
        </div>

        {/* Search Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <Select
            value={searchField}
            onChange={setSearchField}
            options={fieldOptions}
            style={{ width: 200 }}
            placeholder="Select Field"
          />
          <Input
            placeholder="Search..."
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", maxWidth: 400 }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ height: "30px"}}
          >
            Search
          </Button>
          <Button
            onClick={handleClearSearch}
            style={{ height: "30px"}}
          >
            Clear
          </Button>
        </div>

        {/* Visa Details Table */}
        <Table
          columns={columns}
          dataSource={visaDetails}
          rowKey="visaId"
          loading={loading}
          bordered
          pagination={{
            current: currentPage + 1,
            total: totalPages * pageSize,
            pageSize: pageSize,
            onChange: (page, size) => {
              setCurrentPage(page - 1);
              setPageSize(size);
            },
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
