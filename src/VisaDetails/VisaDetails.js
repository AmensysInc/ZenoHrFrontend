import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
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
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

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
    navigate(
      `/editemployee/${employeeId}/visa-details/${visaId}/editvisadetails`
    );
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
    { title: "Visa Start Date", dataIndex: "visaStartDate" },
    { title: "Visa Expiry Date", dataIndex: "visaExpiryDate" },
    { title: "Visa Type", dataIndex: "visaType" },
    { title: "I94 Date", dataIndex: "i94Date" },
    { title: "LCA Number", dataIndex: "lcaNumber" },
    { title: "LCA Wage", dataIndex: "lcaWage" },
    { title: "Job Title", dataIndex: "jobTitle" },
    { title: "I140 Status", dataIndex: "i140Status" },
    { title: "GC Status", dataIndex: "gcStatus" },
    { title: "Attorney", dataIndex: "attorney" },
    { title: "Receipt", dataIndex: "receipt" },
    { title: "Residential Address", dataIndex: "residentialAddress" },
    { title: "Comments", dataIndex: "comments" },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
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

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current - 1);
    setPageSize(pagination.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card bordered className="shadow-sm">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
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

          <ReusableTable
            columns={columns}
            data={visaDetails}
            rowKey="visaId"
            loading={loading}
            total={totalPages * pageSize}
            pagination={true}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
