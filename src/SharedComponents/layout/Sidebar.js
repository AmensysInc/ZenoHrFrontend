// sidebar
import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Select } from "antd";
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
  DollarOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { logoutUser } from "../authUtils/authUtils";
import axios from "axios";
import "./Sidebar.css";

const { Option } = Select;

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
    flexShrink: 0,
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
    overflowY: "auto",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  },
  logoutContainer: {
    padding: "6px 16px 12px 16px",
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoutBtn: {
    color: "#6b7280",
    fontWeight: 500,
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    gap: "10px",
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
    key: "allemployeefiles",
    label: "Employee Status Report",
    icon: <FileOutlined />,
    path: "/allemployeefiles",
  },
  {
    key: "paystubs",
    label: "Pay Stubs",
    icon: <DollarOutlined />,
    path: "/paystubs",
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
  // Parse JSON if stored as JSON, otherwise use as-is and remove quotes
  let role = "";
  try {
    role = JSON.parse(roleFromStorage) || "";
  } catch (e) {
    role = roleFromStorage.replace(/"/g, "");
  }
  role = String(role).replace(/^"|"$/g, "").trim(); // Final cleanup

  const firstNameFromStorage = sessionStorage.getItem("firstName") || "";
  const firstName = firstNameFromStorage.replace(/"/g, "");

  const lastNameFromStorage = sessionStorage.getItem("lastName") || "";
  const lastName = lastNameFromStorage.replace(/"/g, "");

  const [activeKey, setActiveKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [groupAdminCompanies, setGroupAdminCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    sessionStorage.getItem("selectedCompanyId") || null
  );

  // Fetch companies for GROUP_ADMIN
  useEffect(() => {
    const fetchGroupAdminCompanies = async () => {
      if (role === "GROUP_ADMIN") {
        try {
          const token = sessionStorage.getItem("token");
          const userId = sessionStorage.getItem("id");
          const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

          const response = await axios.get(
            `${apiUrl}/user-company/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const companies = response.data.map((role) => role.company);
          setGroupAdminCompanies(companies);

          // Set default selected company if not already set
          if (!selectedCompanyId && companies.length > 0) {
            const defaultCompany = companies.find(
              (c) => c.companyId === Number(sessionStorage.getItem("defaultCompanyId"))
            ) || companies[0];
            const companyId = String(defaultCompany.companyId);
            setSelectedCompanyId(companyId);
            sessionStorage.setItem("selectedCompanyId", companyId);
          }
        } catch (error) {
          console.error("Error fetching group admin companies:", error);
        }
      }
    };

    fetchGroupAdminCompanies();
  }, [role, selectedCompanyId]);

  const handleCompanyChange = async (companyId) => {
    if (!companyId) return;
    
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("id");
    const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

    try {
      // Update the default company in user-company roles
      const rolesResponse = await axios.get(
        `${apiUrl}/user-company/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (rolesResponse.status !== 200) throw new Error("Failed to fetch user roles");
      const roles = rolesResponse.data;

      // Update all roles: set selected as default, others as false
      await Promise.all(
        roles.map(async (role) => {
          const isSelected = Number(role.companyId) === Number(companyId);
          const updateBody = {
            id: role.id,
            userId: role.userId,
            companyId: role.companyId,
            role: role.role,
            defaultCompany: isSelected ? "true" : "false",
            createdAt: new Date(role.createdAt).toISOString().split("T")[0],
          };

          const updateResponse = await axios.put(
            `${apiUrl}/user-company/${role.id}`,
            updateBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (updateResponse.status !== 200) throw new Error("Failed to update role");
        })
      );

      // Update session storage
      sessionStorage.setItem("selectedCompanyId", String(companyId));
      sessionStorage.setItem("defaultCompanyId", companyId);
      setSelectedCompanyId(String(companyId));
      
      // Reload the page to refresh data with new company filter
      window.location.reload();
    } catch (error) {
      console.error("Error updating default company:", error);
    }
  };

  const handleLogout = () => {
    logoutUser(setIsLoggedIn, setRole, navigate);
  };

  const menuItemsByRole = {
    ADMIN: baseAdminMenu,
    HR_MANAGER: baseAdminMenu,
    GROUP_ADMIN: baseAdminMenu,
    REPORTING_MANAGER: [
      {
        key: "employees",
        label: "Employees",
        icon: <TeamOutlined />,
        path: "/employees",
      },
      {
        key: "allemployeefiles",
        label: "Employee Status Report",
        icon: <FileOutlined />,
        path: "/allemployeefiles",
      },
    ],
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
      {
        key: "paystubs",
        label: "Pay Stubs",
        icon: <DollarOutlined />,
        path: "/paystubs",
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

        {role === "GROUP_ADMIN" && !collapsed && groupAdminCompanies.length > 0 && (
          <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
            <Typography.Text strong style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#6b7280" }}>
              Select Company:
            </Typography.Text>
            <Select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              style={{ width: "100%" }}
              placeholder="Select Company"
            >
              {groupAdminCompanies.map((company) => (
                <Option key={company.companyId} value={String(company.companyId)}>
                  {company.companyName}
                </Option>
              ))}
            </Select>
          </div>
        )}

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
