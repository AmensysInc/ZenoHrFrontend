import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { BiSolidAddToQueue } from "react-icons/bi";
import Pagination from "../SharedComponents/Pagination";
import { Select, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getUserDetails } from "../SharedComponents/services/OrderService";
import { getProjectsForEmployee } from "../SharedComponents/services/ProjectHistoryService";

export default function ProjectHistory() {
  const [projectHistory, setProjectHistory] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();
  let { employeeId } = useParams();

  useEffect(() => {
    fetchProjectHistory();
  }, [currentPage, pageSize, searchQuery, searchField]);

  const fetchProjectHistory = async () => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("page", currentPage);
      searchParams.append("size", pageSize);
      if (searchQuery) {
        searchParams.append("searchField", searchField);
        searchParams.append("searchString", searchQuery);
      }
      const detailsData = await getUserDetails(employeeId);
      setUserDetail({
        first: detailsData.firstName,
        last: detailsData.lastName,
      });
      const projectData = await getProjectsForEmployee(
        employeeId,
        currentPage,
        pageSize,
        searchQuery,
        searchField
      );
      setProjectHistory(projectData.content);
      setTotalPages(projectData.totalPages);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleEditHistory = (employeeId, projectId) => {
    navigate(
      `/editemployee/${employeeId}/project-history/${projectId}/editproject`
    );
  };

  const handleAddProject = (employeeId) => {
    navigate(`/editemployee/${employeeId}/project-history/add-project`);
  };
  const handleSearch = () => {
    fetchProjectHistory();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchField("");
    fetchProjectHistory();
  };

  return (
    <>
      <h4 className="text-center">
        {userDetail.first} {userDetail.last}
      </h4>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          onClick={() => handleAddProject(employeeId)}
        >
          <BiSolidAddToQueue size={15} />
          New Projects
        </button>
      </div>
      {/* <div className="search-container">
        <div className="search-bar">
          <Select
            value={searchField}
            onChange={(value) => setSearchField(value)}
            style={{ width: 120 }}
          >
            <Select.Option value="">Select Field</Select.Option>
            <Select.Option value="subVendorOne">Vendor One</Select.Option>
            <Select.Option value="subVendorTwo">Vendor Two</Select.Option>
            <Select.Option value="projectAddress">
              Project Address
            </Select.Option>
            <Select.Option value="projectStartDate">
              Project StartDate
            </Select.Option>
            <Select.Option value="projectEndDate">
              Project EndDate
            </Select.Option>
            <Select.Option value="projectStatus">Project Status</Select.Option>
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
      </div> */}
      <div className="search-container">
  <Space.Compact className="search-bar" size="large">
    <Select
      size="large"
      value={searchField}
      onChange={setSearchField}
      style={{ width: 150 }}
      placeholder="Select Field"
      options={[
        { value: "", label: "Select Field" },
        { value: "subVendorOne", label: "Vendor One" },
        { value: "subVendorTwo", label: "Vendor Two" },
        { value: "projectAddress", label: "Project Address" },
        { value: "projectStartDate", label: "Project StartDate" },
        { value: "projectEndDate", label: "Project EndDate" },
        { value: "projectStatus", label: "Project Status" },
      ]}
    />

    <Input
      size="large"
      placeholder="Search..."
      allowClear
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onPressEnter={handleSearch}
      style={{ width: 280 }}
    />

    <Button size="large" type="primary" icon={<SearchOutlined />} onClick={handleSearch} />

    <Button size="large" onClick={handleClearSearch}>Clear</Button>
  </Space.Compact>
</div>
      <table className="table border shadow">
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Vendor One</th>
            <th scope="col">Vendor Two</th>
            <th scope="col">Project Address</th>
            <th scope="col">Project StartDate</th>
            <th scope="col">Project EndDate</th>
            <th scope="col">Project Status</th>
          </tr>
        </thead>
        <tbody>
          {projectHistory.length > 0 ? (
            projectHistory.map((history, index) => {
              const userIndex = index + currentPage * pageSize;
              return (
                <tr key={userIndex}>
                  <th scope="row">{userIndex + 1}</th>
                  <td>{history.subVendorOne}</td>
                  <td>{history.subVendorTwo}</td>
                  <td>{history.projectAddress}</td>
                  <td>{history.projectStartDate}</td>
                  <td>{history.projectEndDate}</td>
                  <td>{history.projectStatus}</td>
                  <td>
                    <div className="icon-container">
                      <FiEdit2
                        onClick={() =>
                          handleEditHistory(employeeId, history.projectId)
                        }
                        size={20}
                        title="Edit Project History"
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">No Project History</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
