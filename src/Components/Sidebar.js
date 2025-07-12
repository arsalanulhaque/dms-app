import "../style.css";
import { Link, useLocation } from "react-router-dom";
import useSession from "../Context/SessionContext";
import React, { useEffect, useState } from "react";
import iconUser from "../assets/img/user.png";
import iconSchool from "../assets/img/school.png";
import iconPrevilige from "../assets/img/previlige.png";
import iconDevice from "../assets/img/devices.png";
import iconAction from "../assets/img/actions.png";
import iconMenu from "../assets/img/menus.png";
import iconPolicy from "../assets/img/policies.png";
import iconHome from "../assets/img/home.png";
import iconWeeklyReport from "../assets/img/report.png";
import iconBulkUpload from "../assets/img/bulk.png";
import iconHistory from "../assets/img/history.png";
import iconReminder from "../assets/img/bell-icon.png";

// Icon mapping for optimization
const iconMap = {
  home: iconHome,
  user: iconUser,
  previlige: iconPrevilige,
  devices: iconDevice,
  school: iconSchool,
  actions: iconAction,
  menus: iconMenu,
  policies: iconPolicy,
  WeeklyReport: iconWeeklyReport,
  ReminderSettings: iconReminder,
  upload: iconBulkUpload,
  status: iconHistory,
};

function Sidebar() {
  const [getSession] = useSession();
  const [nav, setNav] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const sessionData = getSession();
    if (!sessionData) return;

    // Use a Set to track unique MenuNames for deduplication
    const seen = new Set();
    const arr = [];

    sessionData.data?.forEach((item) => {
      if (!seen.has(item.MenuName)) {
        arr.push({ Link: item.Link, MenuName: item.MenuName, Icon: item.Icon });
        seen.add(item.MenuName);
      }
    });

    if (sessionData.isAdmin && !sessionData.isAppDeveloper) {
      arr.push(
        { Link: "/weekly-report", MenuName: "Weekly Report", Icon: "WeeklyReport" },
        { Link: "/reminder-settings", MenuName: "Reminder Settings", Icon: "ReminderSettings" }
      );
    }

    setNav(arr);
  }, []);

  // Helper to check if a nav item is active
  const isActive = (link) => {
    // Exact match or startsWith for subroutes
    return location.pathname === link || location.pathname.startsWith(link + "/");
  };

  return (
    <>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          {nav.map((item) => (
            <li
              className={`nav-item${isActive(item.Link) ? " active-tab" : ""}`}
              key={item.MenuName}
              style={isActive(item.Link) ? { backgroundColor: "#e9ecef" } : {}}
            >
              <Link to={item.Link} className={`nav-link collapsed${isActive(item.Link) ? " active" : ""}`}>
                <i className="bi bi-menu-button-wide">
                  <img
                    src={iconMap[item.Icon] || ""}
                    height="30"
                    alt={item.MenuName + " icon"}
                  />
                </i>
                <span>{item.MenuName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {/* <!--End Sidebar--> */}
      <style>
        {`
          .sidebar-nav .nav-item.active-tab,
          .sidebar-nav .nav-link.active {
            background-color: #e9ecef !important;
            /* You can adjust the color as needed */
          }
        `}
      </style>
    </>
  );
}

export default Sidebar;
