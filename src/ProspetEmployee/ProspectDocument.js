import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProspectDocument() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const employeeId = localStorage.getItem("id");
    const [documents, setDocuments] = useState();

    const onDocumentSubmit = async (event, employeeId, documents) => {
        event.preventDefault();
        try {
          const token = localStorage.getItem("token");
    
          if (!documents || !Array.isArray(documents)) {
            throw new Error("Documents are not provided or not in an array.");
          }
    
          let formData = new FormData();
          for (let i = 0; i < documents.length; i++) {
            formData.append("documents", documents[i]);
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
          }
          if (!response.ok) {
            throw new Error("Failed to update employee");
          }
        } catch (error) {
          console.error("Error updating employee:", error);
        }
      };

    const onDocumentInputChange = (e) => {
        const selectedFiles = e.target.files;
        setDocuments(Array.from(selectedFiles));
      };
  return (
    <div>
        <form
              onSubmit={(e) => onDocumentSubmit(e, employeeId, documents)}
              enctype="multipart/form-data"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Document">Document</label>
                  <input
                    type="file"
                    className="form-control"
                    name="document"
                    onChange={(e) => {
                      onDocumentInputChange(e);
                    }}
                    multiple
                    required
                  />
                </div>
              </div>
              {console.log(documents)}
              <button type="submit" className="btn btn-outline-primary">
                upload
              </button>
            </form>
    </div>
  )
}
