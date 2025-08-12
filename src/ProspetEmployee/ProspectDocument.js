import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProspectDocument.css";

export default function ProspectDocument() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("id");
  
  const [documents, setDocuments] = useState({
    educational: null,
    passport: null,
    workStatus: null,
    w4Form: null,
    i9Form: null,
    usIdProof: null,
    voidCheck: null,
    lcaDocument: null,
    ssnCopy: null,
  });

  const onDocumentSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      const formData = new FormData();

      for (const key in documents) {
        if (documents[key]) {
          formData.append("documents", documents[key]);
        }
      }

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      const response = await fetch(
        `${apiUrl}/employees/prospectFiles/${employeeId}`,
        requestOptions
      );

      if (response.status === 200) {
        navigate("/");
      } else if (!response.ok) {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const onDocumentInputChange = (e, documentType) => {
    const selectedFile = e.target.files[0];
    setDocuments({ ...documents, [documentType]: selectedFile });
  };

  const onDeleteDocument = (documentType) => {
    const updatedDocuments = { ...documents };
    updatedDocuments[documentType] = null;
    setDocuments(updatedDocuments);
    const fileInput = document.querySelector(`input[name="${documentType}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="document-container">
      <form onSubmit={onDocumentSubmit} encType="multipart/form-data">
      <div className="document-section">
          <h6>Educational Documents</h6>
          <div className="file-upload">
            <input
              type="file"
              name="educational"
              id="educational"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "educational")}
            />
            {documents.educational && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("educational")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>Passport Copy</h6>
          <div className="file-upload">
            <input
              type="file"
              name="passport"
              id="passport"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "passport")}
            />
            {documents.passport && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("passport")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>Work Status Documents</h6>
          <div className="file-upload">
            <input
              type="file"
              name="workStatus"
              id="workStatus"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "workStatus")}
            />
            {documents.workStatus && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("workStatus")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>W-4 Form</h6>
          <div className="file-upload">
            <input
              type="file"
              name="w4Form"
              id="w4Form"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "w4Form")}
            />
            {documents.w4Form && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("w4Form")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>I-9 Form</h6>
          <div className="file-upload">
            <input
              type="file"
              name="i9Form"
              id="i9Form"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "i9Form")}
            />
            {documents.i9Form && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("i9Form")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>US ID Proof</h6>
          <div className="file-upload">
            <input
              type="file"
              name="usIdProof"
              id="usIdProof"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "usIdProof")}
            />
            {documents.usIdProof && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("usIdProof")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>Void check</h6>
          <div className="file-upload">
            <input
              type="file"
              name="voidCheck"
              id="voidCheck"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "voidCheck")}
            />
            {documents.voidCheck && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("voidCheck")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>LCA document for H1B Visa</h6>
          <div className="file-upload">
            <input
              type="file"
              name="lcaDocument"
              id="lcaDocument"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "lcaDocument")}
            />
            {documents.lcaDocument && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("lcaDocument")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="document-section">
          <h6>SSN copy</h6>
          <div className="file-upload">
            <input
              type="file"
              name="ssnCopy"
              id="ssnCopy"
              className="file-input"
              onChange={(e) => onDocumentInputChange(e, "ssnCopy")}
            />
            {documents.ssnCopy && (
              <div className="file-controls">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteDocument("ssnCopy")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>      
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
    </div>
  );
}

