import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
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
  SettingOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  FundOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Sidebar.css";

const { Sider } = Layout;
const { Text } = Typography;

export default function SideBar() {
  const roleFromSessionStorage = sessionStorage.getItem("role");
  const role = roleFromSessionStorage ? roleFromSessionStorage.replace(/"/g, "") : "";
  const [collapsed, setCollapsed] = useState(false);

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
    SALES: [
      { key: "candidates", label: "Candidate List", icon: <TeamOutlined />, path: "/candidates" },
      { key: "marketing", label: "Marketing List", icon: <MailOutlined />, path: "/marketing" },
    ],
    RECRUITER: [
      { key: "marketing", label: "Marketing List", icon: <MailOutlined />, path: "/marketing" },
      { key: "contacts", label: "Contacts", icon: <ContactsOutlined />, path: "/contacts" },
      { key: "email", label: "Send Email", icon: <ThunderboltOutlined />, path: "/email" },
      { key: "bulkemail", label: "Bulk Email", icon: <FundOutlined />, path: "/bulkemail" },
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
        style={styles.sider}
        width={230}
      >
        <div style={styles.logo}>
          <Text style={{ color: "white", fontWeight: 600 }}>
            {collapsed ? "ZP" : "Zeno Pay"}
          </Text>
        </div>

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
      </Sider>
    </motion.div>
  );
}

const styles = {
  sider: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
  },
  logo: {
    textAlign: "center",
    padding: "16px 0",
    fontSize: "18px",
    letterSpacing: "0.5px",
  },
  menu: {
    background: "transparent",
  },
};
