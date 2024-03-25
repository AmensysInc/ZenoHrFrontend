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

  return (
    <div className="col-md-10" style={{ overflowX: "auto" }}>
      <h1 className="text-center mb-4">Contacts List</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Email</th>
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
