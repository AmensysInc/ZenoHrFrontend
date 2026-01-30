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
      const isEditCompanyRoute = location.pathname.includes("/editcompany/");
      
      // Try to get companyId from params first, fallback to extracting from pathname
      let companyId = params.companyId;
      
      // If params.companyId is undefined, extract it from the pathname
      if (!companyId && isEditCompanyRoute) {
        const match = location.pathname.match(/\/editcompany\/(\d+)/);
        if (match && match[1]) {
          companyId = match[1];
          console.log("Extracted companyId from pathname:", companyId);
        }
      }
      
      console.log("Breadcrumb useEffect triggered:", {
        pathname: location.pathname,
        paramsCompanyId: params.companyId,
        extractedCompanyId: companyId,
        isEditCompanyRoute: isEditCompanyRoute,
        pathnames: pathnames
      });
      
      if (isEditCompanyRoute && companyId) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";
          const token = sessionStorage.getItem("token");
          const url = `${apiUrl}/companies/${companyId}`;
          
          console.log("Fetching company from:", url);
          
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Log the full response to debug
          console.log("Company API response:", response.data);
          
          // Try both companyName and name fields (handle different response structures)
          const name = response.data?.companyName || response.data?.name;
          if (name) {
            console.log("Setting company name to:", name);
            setCompanyName(name);
          } else {
            console.warn("Company name not found in response:", response.data);
          }
        } catch (error) {
          console.error("Error fetching company name:", error);
          if (error.response) {
            console.error("Error response status:", error.response.status);
            console.error("Error response data:", error.response.data);
          }
        }
      } else {
        // Reset company name when not on editcompany route
        if (companyName) {
          console.log("Resetting company name (not on editcompany route)");
          setCompanyName(null);
        }
      }
    };
    fetchCompanyName();
  }, [location.pathname, params.companyId]);

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
    adduser: "Add Employee",
    paystubs: "Pay Stubs",
  };

  // Build breadcrumb items dynamically - recalculate when companyName changes
  const breadcrumbItems = React.useMemo(() => [
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
        
        // Check if we're on editcompany route and this is the companyId
        const isEditCompanyRoute = pathnames.includes("editcompany");
        const prevPath = index > 0 ? pathnames[index - 1] : "";
        // Match if this is the companyId parameter (after "editcompany" in the path)
        // Handle both string and number comparisons
        // Try params first, fallback to extracting from pathname
        let companyIdStr = params.companyId ? String(params.companyId) : null;
        if (!companyIdStr && isEditCompanyRoute) {
          const match = location.pathname.match(/\/editcompany\/(\d+)/);
          if (match && match[1]) {
            companyIdStr = match[1];
          }
        }
        const isCompanyId = isEditCompanyRoute && prevPath === "editcompany" && companyIdStr && String(name) === companyIdStr;
        
        // Debug log for company ID matching
        if (isEditCompanyRoute && name === companyIdStr) {
          console.log("Breadcrumb matching company ID:", {
            name,
            companyIdStr,
            companyName,
            isCompanyId,
            prevPath
          });
        }
        
        let displayName;
        if (isCompanyId) {
          // Show company name instead of ID, or show ID if name not loaded yet
          displayName = companyName || name;
          console.log("Display name for company ID:", displayName);
        } else if (name === "editcompany") {
          displayName = "Edit Company";
        } else {
          displayName = nameMap[name.toLowerCase()] || capitalizeFirstLetter(params[name] || name);
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
  ], [pathnames, params, companyName, location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={styles.wrapper}
    >
      <Breadcrumb
        key={companyName || location.pathname}
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
