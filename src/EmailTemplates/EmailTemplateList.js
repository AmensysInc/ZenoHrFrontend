import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function EmailTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTemplates(response.data);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      const token = sessionStorage.getItem("token");

      await axios.delete(`${API_URL}/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch (err) {
      console.error("Error deleting template:", err);
      setError("Failed to delete the template.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Email Templates</h2>
        <Link to="/email-template/create" className="btn btn-success">
          + Create New
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No templates found.</td>
            </tr>
          ) : (
            templates.map((template) => (
              <tr key={template.id}>
                <td>{template.name}</td>
                <td>{template.subject}</td>
                <td>{template.category || "-"}</td>
                <td>{template.isActive ? "Yes" : "No"}</td>
                <td>
                  <Link
                    to={`/email-template/edit/${template.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
