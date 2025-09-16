import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");
  const recruiterId = sessionStorage.getItem("id");

  axios.defaults.baseURL = apiUrl;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (recruiterId) {
      axios
        .get(`/bulkmails/${recruiterId}`)
        .then((response) => {
          console.log("Data fetched successfully:", response.data);
          setContacts(response.data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [recruiterId, token]);

  const handleEditContact = (id) => {
    navigate(`/editcontact/${id}`);
  };

  const handleAddContact = () => {
    navigate("/addcontact");
  };

  return (
    <div className="col-md-10" style={{ overflowX: "auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Contacts List</h1>
        <button className="btn btn-primary" onClick={handleAddContact}>
          Add Contacts
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td>{contact.email}</td>
                  <td>
                    <div className="icon-container">
                      <FiEdit2
                        onClick={() => handleEditContact(contact.id)}
                        size={20}
                        title="Edit Contact"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
