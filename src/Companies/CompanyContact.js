import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyContact = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCompanyEmail = async () => {
      try {
        const employeeId = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch employee details to get company info
        const response = await axios.get(
          `${apiUrl}/employees/${employeeId}`,
          config
        );
        const companyEmail = response.data.company.email;
        console.log(companyEmail);
        setEmail(companyEmail);
      } catch (error) {
        console.error("Error fetching company email:", error);
        setEmail("Unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyEmail();
  }, [apiUrl]);

  if (loading) {
    return <div>Loading company contact...</div>;
  }

  return (
    <div className="company-contact">
      <p>
        Please get in touch with this email for any queries:{" "}
        <strong>{email}</strong>
      </p>
    </div>
  );
};

export default CompanyContact;