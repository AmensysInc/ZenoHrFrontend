import './Navbar.css';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { logoutUser } from "../authUtils/authUtils";
import { fetchCompanies } from "../../SharedComponents/services/CompaniesServies";
import { useNavigate } from 'react-router-dom';

export default function Navbar({setIsLoggedIn, setRole}) {
  const [companies, setCompanies] = useState([]);
  const location = useLocation();
  const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId"));
  const navigate = useNavigate();

  const fetchCompany = async () => {
    try {
      const { content } = await fetchCompanies(0, 10, "", "");
      setCompanies(content);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  useEffect(() => {
    if (defaultCompanyId) {
      fetchCompany();
    }
  }, [defaultCompanyId]);

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole, navigate);
  };

  if (location.pathname === "/login") {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
               Zeno Pay & HR Portal
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
             Zeno Pay & HR Portal
          </Link>
          <div style={{ marginRight: "20px", fontWeight: "bold" }}>
            {companies.map((company) =>
              company.companyId === defaultCompanyId ? (
                <div key={company.companyId}>
                  Company:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {company.companyName}
                  </span>
                </div>
              ) : null
            )}
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <>
            <BsBoxArrowInLeft size={30} onClick={handleLogout} className="logout-icon" title="logout"/>
          </>
        </div>
      </nav>
    </div>
  );
}