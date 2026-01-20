import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { logoutUser } from "../authUtils/authUtils";
import { fetchCompanies } from "../../SharedComponents/services/CompaniesServies";
import CompanySelector from "../CompanySelector";

const { Header } = Layout;

export default function Navbar({ setIsLoggedIn, setRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const defaultCompanyId = Number(sessionStorage.getItem("defaultCompanyId"));

  const fetchCompany = async () => {
    try {
      const { content } = await fetchCompanies(0, 10, "", "");
      setCompanies(content);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (defaultCompanyId) fetchCompany();
  }, [defaultCompanyId]);

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole, navigate);
  };

  if (location.pathname === "/login") return null;

  return (
    <Header
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        zIndex: 1001,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#667eea",
        padding: "0 24px",
        height: 64,
      }}
    >
      <Link to="/" style={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>
        Zeno HR & PAY Portal
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Company Selector for Admins */}
        <CompanySelector />
        
        {/* Show company name for SADMIN or if no selector */}
        {sessionStorage.getItem("role") === "SADMIN" &&
          companies.map(
            (c) =>
              c.companyId === defaultCompanyId && (
                <span key={c.companyId} style={{ color: "#fff", fontWeight: 600 }}>
                  {c.companyName}
                </span>
              )
          )}

        <BsBoxArrowInLeft
          size={26}
          style={{ color: "#fff", cursor: "pointer" }}
          title="Logout"
          onClick={handleLogout}
        />
      </div>
    </Header>
  );
}
