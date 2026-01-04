// sidebar
import React, { useState, useEffect } from "react";
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
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { logoutUser } from "../authUtils/authUtils";
import "./Sidebar.css";

const { Sider } = Layout;
const { Text } = Typography;

const styles = {
  sider: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "92.8vh",
    background: "#ffffff",
    borderRight: "1px solid #f0f0f0",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "16px",
    margin: "12px",
    boxShadow: "0 0px 18px rgba(0, 0, 0, 0.15)",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none",
    marginTop: "28px",
  },
  logo: {
    padding: "10px 16px 6px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
    position: "relative",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "16px",
  },
  appNameContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    lineHeight: 1.1,
    marginTop: "4px",
  },

  appNameMain: {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: 700,
    textTransform: "uppercase",
  },

  appNameSub: {
    color: "#1f2937",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    marginTop: "-2px",
    letterSpacing: "1px",
  },
  userName: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 400,
  },
  menu: {
    background: "transparent",
    flex: 1,
    border: "none",
    paddingTop: "0px",
    paddingLeft: "19px",
    paddingBottom: "6px",
  },
  logoutContainer: {
    padding: "6px 16px 0px 24px ",
    paddingLeft: "24px",
    justifyContent: "center",
    borderTop: "1px solid #f0f0f0",
  },
  logoutBtn: {
    color: "#6b7280",
    fontWeight: 500,
    width: "100%",
    borderRadius: "8px",
    border: "10px",
    fontSize: "14px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    paddingRight: "5px",
    paddingBottom: "32px",
    justifyContent: "center",
    paddingLeft: "2px",
  },
  collapseBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    color: "#6b7280",
    fontSize: "16px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    borderRadius: "6px",
  },
};

const baseAdminMenu = [
  {
    key: "overview",
    label: "Home",
    icon: <AppstoreOutlined />,
    path: "/",
  },
  {
    key: "companies",
    label: "Companies",
    icon: <ApartmentOutlined />,
    path: "/companies",
  },
  {
    key: "employees",
    label: "Employees",
    icon: <TeamOutlined />,
    path: "/employees",
  },
  {
    key: "purchase-orders",
    label: "Purchase Orders",
    icon: <FileTextOutlined />,
    path: "/purchase-orders",
  },
  {
    key: "projects",
    label: "Projects",
    icon: <ProjectOutlined />,
    path: "/projects",
  },
  {
    key: "visa-details",
    label: "Visa Details",
    icon: <IdcardOutlined />,
    path: "/visa-details",
  },
  {
    key: "announcements",
    label: "Announcements",
    icon: <NotificationOutlined />,
    path: "/announcements",
  },
  {
    key: "alltimeSheets",
    label: "All TimeSheets",
    icon: <ClockCircleOutlined />,
    path: "/alltimeSheets",
  },
  {
    key: "email-templates",
    label: "Email Templates",
    icon: <MailOutlined />,
    path: "/email-templates",
  },
  {
    key: "uploadedfiles",
    label: "Files",
    icon: <FileOutlined />,
    path: "/uploadedfiles",
  },
  {
    key: "email",
    label: "Send Email",
    icon: <ThunderboltOutlined />,
    path: "/email",
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: <ContactsOutlined />,
    path: "/contacts",
  },
  {
    key: "bulkemail",
    label: "Campaigns",
    icon: <FundOutlined />,
    path: "/bulkemail",
  },
];

export default function SideBar({
  collapsed,
  setCollapsed,
  setIsLoggedIn,
  setRole,
}) {
  const roleFromStorage = sessionStorage.getItem("role") || "";
  const role = roleFromStorage.replace(/"/g, "");

  const firstNameFromStorage = sessionStorage.getItem("firstName") || "";
  const firstName = firstNameFromStorage.replace(/"/g, "");

  const lastNameFromStorage = sessionStorage.getItem("lastName") || "";
  const lastName = lastNameFromStorage.replace(/"/g, "");

  const [activeKey, setActiveKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole, navigate);
  };

  const menuItemsByRole = {
    ADMIN: baseAdminMenu,
    SADMIN: [
      ...baseAdminMenu,
      {
        key: "companyrole",
        label: "User Role",
        icon: <UserSwitchOutlined />,
        path: "/companyrole",
      },
    ],
    EMPLOYEE: [
      {
        key: "overview",
        label: "My Profile",
        icon: <AppstoreOutlined />,
        path: "/",
      },
            {
        key: "Uploads",
        label: "Uploads",
        icon: <AppstoreOutlined />,
        path: "/uploads",
      },
      // {
      //   key: "timeSheets",
      //   label: "Monthly Time Sheets",
      //   icon: <ClockCircleOutlined />,
      //   path: "/timeSheets",
      // },
      // {
      //   key: "weeklytimeSheets",
      //   label: "Weekly Time Sheets",
      //   icon: <ClockCircleOutlined />,
      //   path: "/weeklytimeSheets",
      // },
      // {
      //   key: "trackings",
      //   label: "WithHold Tracking",
      //   icon: <FundOutlined />,
      //   path: "/trackings",
      // },
      // {
      //   key: "withholdSheet",
      //   label: "WithHold Sheet",
      //   icon: <FileTextOutlined />,
      //   path: "/withholdSheet",
      // },
      // {
      //   key: "myfiles",
      //   label: "Files",
      //   icon: <FileOutlined />,
      //   path: "/myfiles",
      // },
      // {
      //   key: "announcements",
      //   label: "Announcements",
      //   icon: <NotificationOutlined />,
      //   path: "/announcements",
      // },
      {
        key: "contactus",
        label: "Contact Us",
        icon: <ContactsOutlined />,
        path: "/contactus",
      },
    ],
  };

  const items = menuItemsByRole[role] || [];

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/") {
      setActiveKey("overview");
    } else {
      const matchedItem = items.find(
        (item) => currentPath.startsWith(item.path) && item.path !== "/"
      );
      setActiveKey(matchedItem ? matchedItem.key : "");
    }
  }, [location.pathname, items]);

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
        width={270}
        style={styles.sider}
        className="modern-sidebar"
        trigger={null}
      >
        <div style={styles.logo}>
          <div style={styles.logoIcon}>ZP</div>
          {!collapsed && (
            <div className="sidebar-text-content">
              <div style={styles.appNameContainer}>
                <Text style={styles.appNameMain}>Zeno</Text>
                <Text style={styles.appNameSub}>HR & PAY</Text>
              </div>
            </div>
          )}

          {!collapsed && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={styles.collapseBtn}
              className="collapse-trigger sidebar-text-content"
            />
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          style={styles.menu}
          className="modern-menu"
        >
          {collapsed && (
            <Menu.Item
              key="collapse-trigger"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setCollapsed(false)}
              style={{ cursor: "pointer" }}
            />
          )}

          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              title={collapsed ? item.label : undefined}
            >
              {!collapsed && <Link to={item.path}>{item.label}</Link>}
            </Menu.Item>
          ))}
        </Menu>

        <div style={styles.logoutContainer}>
          <Button
            type="text"
            icon={<PoweroffOutlined />}
            onClick={handleLogout}
            style={styles.logoutBtn}
            className="logout-button"
          >
            {!collapsed && <span className="sidebar-text-content">Logout</span>}
          </Button>
        </div>
      </Sider>
    </motion.div>
  );
}
