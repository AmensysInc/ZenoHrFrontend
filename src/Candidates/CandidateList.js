import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { Select, Input, Button, Checkbox, InputNumber, Card, Typography, Space, Tooltip, Popconfirm } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { deleteCandidate, fetchCandidates, fetchCandidatesWithoutPagination, fetchCandidatesWithMarketing, fetchCandidatesWithMarketingAndWithouPagination } from "../SharedComponents/services/CandidateService";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import ReusableTable from "../components/ReusableTable";

const { Title } = Typography;

export default function CandidateList({ inMarketing }) {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, searchField, pagination, inMarketing]);

  const fetchData = async () => {
    let result;

    if (inMarketing) {
      if (pagination) {
        result = await fetchCandidatesWithMarketing(currentPage, pageSize, searchQuery, searchField);

        setRowData(result.content);
        setIsLoading(false);
        setTotalPages(result.totalPages);
      } else {
        result = await fetchCandidatesWithMarketingAndWithouPagination(searchQuery, searchField);
        setRowData(result);
      }
    }
    else {
      if (pagination) {
        result = await fetchCandidates(currentPage, pageSize, searchQuery, searchField);

        setRowData(result.content);
        setIsLoading(false);
        setTotalPages(result.totalPages);
      } else {
        result = await fetchCandidatesWithoutPagination(searchQuery, searchField);
        setRowData(result);
      }
    }
  }

  const handleSearch = () => {
    fetchData();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchData();
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    { title: "Skills", dataIndex: "skills", ellipsis: true },
    { title: "Recruiter", dataIndex: "recruiterName" },
    { title: "Phone", dataIndex: "phoneNo" },
    { title: "Email", dataIndex: "emailAddress", ellipsis: true },
    { title: "Company", dataIndex: "company" },
    { title: "Visa Status", dataIndex: "originalVisaStatus" },
    { title: "Marketing Visa", dataIndex: "marketingVisaStatus" },
    { title: "Status", dataIndex: "candidateStatus" },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<FiEdit2 size={18} />}
              onClick={() => handleEditCandidate(record.candidateID)}
            />
          </Tooltip>
          {!inMarketing && (
            <Popconfirm
              title="Are you sure you want to delete this candidate?"
              onConfirm={() => handleDeleteCandidate(record.candidateID)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button
                  type="text"
                  danger
                  icon={<AiFillDelete size={18} />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleEditCandidate = (candidateID) => {
    navigate(`/editcandidate/${candidateID}`);
  };

  const handleDeleteCandidate = async (candidateID) => {
    const success = await deleteCandidate(candidateID);
    if (success) {
      fetchData();
    }
  };

  const handleTableChange = (paginationInfo) => {
    setCurrentPage(paginationInfo.current - 1);
    setPageSize(paginationInfo.pageSize);
  };

  return (
    <AnimatedPageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {inMarketing ? "In Marketing List" : "Candidates List"}
            </Title>
            <Link to="/addcandidate">
              <Button type="primary" icon={<BsFillPersonPlusFill size={16} />}>
                Add Candidate
              </Button>
            </Link>
          </div>

          <Space style={{ marginBottom: 16 }} wrap>
            <Select
              value={searchField}
              onChange={(value) => setSearchField(value)}
              style={{ width: 150 }}
              placeholder="Select Field"
            >
              <Select.Option value="">All Fields</Select.Option>
              <Select.Option value="firstName">First Name</Select.Option>
              <Select.Option value="lastName">Last Name</Select.Option>
              <Select.Option value="emailAddress">Email</Select.Option>
              <Select.Option value="company">Company</Select.Option>
              <Select.Option value="phoneNo">Phone No</Select.Option>
              <Select.Option value="recruiterName">Recruiter</Select.Option>
              <Select.Option value="skills">Skills</Select.Option>
              <Select.Option value="candidateStatus">Status</Select.Option>
            </Select>
            <Input.Search
              placeholder="Search..."
              onSearch={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              enterButton
              style={{ width: 250 }}
            />
            <Button onClick={handleClearSearch}>Clear</Button>
            <Checkbox
              checked={pagination}
              onChange={(e) => setPagination(e.target.checked)}
            >
              Enable Pagination
            </Checkbox>
            {pagination && (
              <>
                <span>Page Size:</span>
                <InputNumber
                  min={1}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  style={{ width: 70 }}
                />
              </>
            )}
          </Space>

          <ReusableTable
            columns={columns}
            data={rowData || []}
            rowKey="candidateID"
            loading={isLoading}
            pagination={pagination}
            total={totalPages * pageSize}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </AnimatedPageWrapper>
  );
}
