import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, DatePicker, Input, Button, Modal, Typography, Row, Col, message } from "antd";
import dayjs from "dayjs";
import {
  createProject,
  fetchEmployeeDetails,
  fetchProjectDetails,
  updateProject,
} from "../SharedComponents/services/ProjectHistoryService";

const { Title } = Typography;

export default function ProjectHistoryForm({ mode }) {
  const navigate = useNavigate();
  const { projectId, employeeId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState({
    subVendorOne: "",
    subVendorTwo: "",
    projectAddress: "",
    projectStartDate: "",
    projectEndDate: "",
    projectStatus: "",
  });

  const { subVendorOne, subVendorTwo, projectAddress, projectStartDate, projectEndDate, projectStatus } = project;
  const isEditMode = mode === "edit";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeeResponse = await fetchEmployeeDetails(employeeId);
        if (employeeResponse) {
          const fullName = `${employeeResponse.firstName || ""} ${employeeResponse.lastName || ""}`.trim();
          setEmployeeName(fullName);
        }

        if (isEditMode && projectId) {
          const projectResponse = await fetchProjectDetails(projectId);
          if (projectResponse) setProject(projectResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error loading employee or project data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode, employeeId, projectId]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const onInputChangeDate = (date, name) => {
    setProject((prev) => ({
      ...prev,
      [name]: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const success =
        isEditMode
          ? await updateProject(projectId, project)
          : await createProject(employeeId, project);

      if (success) {
        setIsModalOpen(true);
      } else {
        message.error("Failed to save project details");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate(`/editemployee/${employeeId}/project-history`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    handleNavigate();
  };

  return (
    <Card
      loading={loading}
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: 24,
        maxWidth: 800,
        margin: "30px auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={4} style={{ color: "#4f46e5", marginBottom: 5 }}>
          {isEditMode ? "Edit Project" : "Add Project"}
        </Title>
        <p style={{ marginBottom: 0, color: "#555" }}>
          {employeeName ? `Employee: ${employeeName}` : "Employee Details"}
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <label className="form-label">Sub Vendor One</label>
            <Input
              name="subVendorOne"
              value={subVendorOne}
              onChange={onInputChange}
              placeholder="Enter Vendor One"
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Sub Vendor Two</label>
            <Input
              name="subVendorTwo"
              value={subVendorTwo}
              onChange={onInputChange}
              placeholder="Enter Vendor Two"
            />
          </Col>

          <Col xs={24}>
            <label className="form-label">Project Address</label>
            <Input
              name="projectAddress"
              value={projectAddress}
              onChange={onInputChange}
              placeholder="Enter Project Address"
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Project Start Date</label>
            <DatePicker
              className="w-100"
              value={projectStartDate ? dayjs(projectStartDate) : null}
              onChange={(d) => onInputChangeDate(d, "projectStartDate")}
              format="YYYY-MM-DD"
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <label className="form-label">Project End Date</label>
            <DatePicker
              className="w-100"
              value={projectEndDate ? dayjs(projectEndDate) : null}
              onChange={(d) => onInputChangeDate(d, "projectEndDate")}
              format="YYYY-MM-DD"
              required
            />
          </Col>
        </Row>

        <div
          className="mt-4 d-flex justify-content-end"
          style={{ display: "flex", gap: 12, marginTop: 20 }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#4f46e5" }}
          >
            {isEditMode ? "Update Project" : "Submit Project"}
          </Button>
          <Button danger onClick={handleNavigate}>
            Cancel
          </Button>
        </div>
      </form>

      <Modal
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
      >
        <p>
          Project {isEditMode ? "updated" : "added"} successfully for{" "}
          <strong>{employeeName}</strong>.
        </p>
      </Modal>
    </Card>
  );
}
