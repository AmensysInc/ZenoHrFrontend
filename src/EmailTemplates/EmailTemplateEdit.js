import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EmailTemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState({
    name: "",
    description: "",
    subject: "",
    body: "",
    category: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`http://localhost:8082/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTemplate(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching template:", err);
      setError("Failed to load template.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`http://localhost:8082/messages/${id}`, template, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/email-templates");
    } catch (err) {
      console.error("Error updating template:", err);
      setError("Failed to update the template.");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Email Template</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={template.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={template.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            name="subject"
            className="form-control"
            value={template.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Body *</label>
          <textarea
            name="body"
            className="form-control"
            rows="6"
            value={template.body}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={template.category || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="isActive"
            className="form-check-input"
            checked={template.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label">Active</label>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Template
        </button>
      </form>
    </div>
  );
}
