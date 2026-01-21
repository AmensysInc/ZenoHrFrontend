import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import axios from "axios";

const CustomBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [companyName, setCompanyName] = useState(null);
  
  // Fetch company name if on editcompany route
  useEffect(() => {
    const fetchCompanyName = async () => {
      if (pathnames.includes("editcompany") && params.companyId) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";
          const token = sessionStorage.getItem("token");
          const response = await axios.get(`${apiUrl}/companies/${params.companyId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.companyName) {
            setCompanyName(response.data.companyName);
          }
        } catch (error) {
          console.error("Error fetching company name:", error);
        }
      }
    };
    fetchCompanyName();
  }, [pathnames, params.companyId]);

  // Check if a string looks like a UUID
  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
  };

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  // Name mapping for friendly display names
  const nameMap = {
    companyrole: "User Role",
    bulkemail: "Campaign Mails",
    "email-templates": "Email Templates",
    alltimesheets: "All Time Sheets",
    "purchase-orders": "Purchase Orders",
    "visa-details": "Visa Details",
  };

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    {
      title: (
        <Link to="/" style={styles.link}>
          <HomeOutlined /> <span style={{ marginLeft: 4 }}>Home</span>
        </Link>
      ),
    },
    ...pathnames
      .map((name, index) => {
        if (isUUID(name)) return null;
        const isLast = index === pathnames.length - 1;
        let displayName = nameMap[name.toLowerCase()] || capitalizeFirstLetter(params[name] || name);
        
        // Show company name instead of ID for editcompany route
        if (name === "editcompany" && companyName) {
          displayName = companyName;
        }

        let to = `/${pathnames.slice(0, index + 1).join("/")}`;

        // Handle special cases for nested routes
        if (name.toLowerCase() === "visa-details") {
          const employeeId =
            pathnames.at(pathnames.findIndex((x) => x === "visa-details") - 1);
          to = `/editemployee/${employeeId}/visa-details`;
        } else if (name.toLowerCase() === "project-history") {
          const employeeId =
            pathnames.at(pathnames.findIndex((x) => x === "project-history") - 1);
          to = `/editemployee/${employeeId}/project-history`;
        } else if (name.toLowerCase() === "tracking") {
          const employeeId =
            pathnames.at(pathnames.findIndex((x) => x === "tracking") + 1);
          to = `/tracking/${employeeId}`;
        } else if (name.toLowerCase() === "orders") {
          const employeeId =
            pathnames.at(pathnames.findIndex((x) => x === "orders") + 1);
          to = `/orders/${employeeId}`;
        } else if (name.toLowerCase() === "editemployee") {
          const employeeId =
            pathnames.at(pathnames.findIndex((x) => x === "editemployee") + 1);
          to = `/editemployee/${employeeId}`;
        }

        return {
          title: isLast ? (
            <span style={styles.active}>{displayName}</span>
          ) : (
            <Link to={to} style={styles.link}>
              {displayName}
            </Link>
          ),
        };
      })
      .filter(Boolean),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={styles.wrapper}
    >
      <Breadcrumb
        separator={<RightOutlined style={{ fontSize: 12, color: "#b3b3b3" }} />}
        items={breadcrumbItems}
      />
    </motion.div>
  );
};

// 🎨 Custom Styling
const styles = {
  wrapper: {
    padding: "14px 24px",
    background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
    borderBottom: "1px solid #e5e7eb",
    borderRadius: "10px 10px 10px 10px",
    boxShadow: "0 0px 18px rgba(0,0,0,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    marginLeft: "28px",
    marginTop: "28px",
    marginRight: "28px",
    marginBottom: "28px",
  },
  link: {
    color: "#000000ff",
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  active: {
    color: "#6b7280",
    fontWeight: 600,
    cursor: "default",
  },
};

export default CustomBreadcrumb;
