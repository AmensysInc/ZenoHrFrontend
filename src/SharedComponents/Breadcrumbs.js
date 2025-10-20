import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

const CustomBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Check if a string looks like a UUID
  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
  };

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

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
        const displayName = capitalizeFirstLetter(params[name] || name);

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
    borderRadius: "0 0 10px 10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
  },
  link: {
    color: "#4f46e5",
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
