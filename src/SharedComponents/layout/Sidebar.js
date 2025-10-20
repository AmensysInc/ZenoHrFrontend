import React, { useState } from "react";
import { Layout, Menu, Typography, Button } from "antd";
import {
  ApartmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  ProjectOutlined,
  IdcardOutlined,
  MailOutlined,
  NotificationOutlined,
  FileOutlined,
  ContactsOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  FundOutlined,
  UserSwitchOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { logoutUser } from "../authUtils/authUtils";
import "./Sidebar.css";

const { Sider } = Layout;
const { Text } = Typography;

export default function SideBar({ setIsLoggedIn, setRole }) {
  const roleFromSessionStorage = sessionStorage.getItem("role");
  const role = roleFromSessionStorage ? roleFromSessionStorage.replace(/"/g, "") : "";

  // ✅ Get user info
  const firstName = sessionStorage.getItem("firstName")?.replace(/"/g, "") || "";
  const lastName = sessionStorage.getItem("lastName")?.replace(/"/g, "") || "";

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole, navigate);
  };

  const menuItemsByRole = {
    ADMIN: [
      { key: "companies", label: "Companies", icon: <ApartmentOutlined />, path: "/companies" },
      { key: "employees", label: "Employees", icon: <TeamOutlined />, path: "/employees" },
      { key: "purchase-orders", label: "Purchase Orders", icon: <FileTextOutlined />, path: "/purchase-orders" },
      { key: "projects", label: "Projects", icon: <ProjectOutlined />, path: "/projects" },
      { key: "visa-details", label: "Visa Details", icon: <IdcardOutlined />, path: "/visa-details" },
      { key: "announcements", label: "Announcements", icon: <NotificationOutlined />, path: "/announcements" },
      { key: "alltimeSheets", label: "All TimeSheets", icon: <ClockCircleOutlined />, path: "/alltimeSheets" },
      { key: "email-templates", label: "Email Templates", icon: <MailOutlined />, path: "/email-templates" },
      { key: "uploadedfiles", label: "Files", icon: <FileOutlined />, path: "/uploadedfiles" },
      { key: "email", label: "Send Email", icon: <ThunderboltOutlined />, path: "/email" },
      { key: "contacts", label: "Contacts", icon: <ContactsOutlined />, path: "/contacts" },
      { key: "bulkemail", label: "Campaigns", icon: <FundOutlined />, path: "/bulkemail" },
    ],
    SADMIN: [
      { key: "companies", label: "Companies", icon: <ApartmentOutlined />, path: "/companies" },
      { key: "employees", label: "Employees", icon: <TeamOutlined />, path: "/employees" },
      { key: "purchase-orders", label: "Purchase Orders", icon: <FileTextOutlined />, path: "/purchase-orders" },
      { key: "projects", label: "Projects", icon: <ProjectOutlined />, path: "/projects" },
      { key: "visa-details", label: "Visa Details", icon: <IdcardOutlined />, path: "/visa-details" },
      { key: "announcements", label: "Announcements", icon: <NotificationOutlined />, path: "/announcements" },
      { key: "alltimeSheets", label: "All TimeSheets", icon: <ClockCircleOutlined />, path: "/alltimeSheets" },
      { key: "email-templates", label: "Email Templates", icon: <MailOutlined />, path: "/email-templates" },
      { key: "uploadedfiles", label: "Files", icon: <FileOutlined />, path: "/uploadedfiles" },
      { key: "email", label: "Send Email", icon: <ThunderboltOutlined />, path: "/email" },
      { key: "contacts", label: "Contacts", icon: <ContactsOutlined />, path: "/contacts" },
      { key: "bulkemail", label: "Campaigns", icon: <FundOutlined />, path: "/bulkemail" },
      { key: "companyrole", label: "User Role", icon: <UserSwitchOutlined />, path: "/companyrole" },
    ],
    EMPLOYEE: [
      { key: "timeSheets", label: "Monthly Time Sheets", icon: <ClockCircleOutlined />, path: "/timeSheets" },
      { key: "weeklytimeSheets", label: "Weekly Time Sheets", icon: <ClockCircleOutlined />, path: "/weeklytimeSheets" },
      { key: "trackings", label: "WithHold Tracking", icon: <FundOutlined />, path: "/trackings" },
      { key: "withholdSheet", label: "WithHold Sheet", icon: <FileTextOutlined />, path: "/withholdSheet" },
      { key: "myfiles", label: "Files", icon: <FileOutlined />, path: "/myfiles" },
      { key: "announcements", label: "Announcements", icon: <NotificationOutlined />, path: "/announcements" },
      { key: "contactus", label: "Contact Us", icon: <ContactsOutlined />, path: "/contactus" },
    ],
  };

  const items = menuItemsByRole[role] || [];

  if (!items.length) return null;

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={230}
        style={styles.sider}
      >
        {/* ✅ Logo and Name */}
        <div style={styles.logo}>
          <Text style={{ color: "white", fontWeight: 600 }}>
            {collapsed ? "ZP" : "Zeno HR & Pay"}
          </Text>
          {!collapsed && (
            <Text style={styles.userName}>
              {firstName} {lastName}
            </Text>
          )}
        </div>

        {/* ✅ Menu Items */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[items[0]?.key]}
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>,
          }))}
          style={styles.menu}
        />

        {/* ✅ Logout Button */}
        <div style={styles.logoutContainer}>
          <Button
            type="text"
            icon={<PoweroffOutlined style={{ color: "#fff" }} />}
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>
    </motion.div>
  );
}

const styles = {
  sider: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    textAlign: "center",
    padding: "18px 0",
    fontSize: "18px",
    letterSpacing: "0.5px",
    background: "rgba(255,255,255,0.1)",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  userName: {
    marginTop: 4,
    display: "block",
    color: "#f0f0f0",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  menu: {
    background: "transparent",
    flex: 1,
  },
  logoutContainer: {
    textAlign: "center",
    padding: "15px 0",
    borderTop: "1px solid rgba(255,255,255,0.2)",
  },
  logoutBtn: {
    color: "#fff",
    fontWeight: 600,
    width: "100%",
    borderRadius: 0,
    fontSize: 15,
    background: "transparent",
  },
};
