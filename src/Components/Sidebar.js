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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    // Move "Home" to the top if it exists
    const homeIndex = arr.findIndex(
      (item) =>
        item.MenuName.toLowerCase() === "home" ||
        item.Link === "/" ||
        item.Icon === "home"
    );
    if (homeIndex > 0) {
      const [homeItem] = arr.splice(homeIndex, 1);
      arr.unshift(homeItem);
    }

    setNav(arr);
  }, []);

  // Helper to check if a nav item is active
  const isActive = (link) => {
    // Exact match or startsWith for subroutes
    return location.pathname === link || location.pathname.startsWith(link + "/");
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768) {  // Only for mobile
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          position: 'fixed',
          left: '10px',
          top: '70px',
          zIndex: 1000,
          padding: '8px',
          background: '#fff',
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          display: 'none',  // Hidden by default, shown in mobile media query
          cursor: 'pointer'
        }}
      >
        <img
          src={iconMenu}
          alt="Toggle Menu"
          style={{ width: '24px', height: '24px' }}
        />
      </button>

      {/* Sidebar */}
      <aside 
        id="sidebar" 
        className={`sidebar${isMobileMenuOpen ? ' mobile-nav-active' : ''}`}
        style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.07)" }}
      >
        <ul className="sidebar-nav" id="sidebar-nav" style={{ padding: 0, margin: 0 }}>
          {nav.map((item, idx) => (
            <li
              className={`nav-item${isActive(item.Link) ? " active-tab" : ""}${idx === 0 ? " nav-item-home" : ""}`}
              key={item.MenuName}
              style={{
                borderRadius: idx === 0 ? "12px 12px 0 0" : "0",
                marginBottom: idx === 0 ? "10px" : "0",
                boxShadow: idx === 0 ? "0 2px 8px rgba(255, 200, 100, 0.08)" : "",
                transition: "background 0.2s, box-shadow 0.2s"
              }}
            >
              <Link
                to={item.Link}
                className={`nav-link collapsed${isActive(item.Link) ? " active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  fontWeight: idx === 0 ? "600" : "500",
                  color: idx === 0 ? "#c20001" : "#333",
                  fontSize: idx === 0 ? "1.15rem" : "1rem",
                  letterSpacing: idx === 0 ? "0.5px" : "0",
                  borderLeft: isActive(item.Link) ? "4px solid #c20001" : "4px solid transparent",
                  background: isActive(item.Link) ? "#e9ecef" : "transparent",
                  borderRadius: idx === 0 ? "10px" : "0",
                  transition: "all 0.2s"
                }}
              >
                <i className="bi bi-menu-button-wide" style={{ marginRight: 12, display: "flex", alignItems: "center" }}>
                  <img
                    src={iconMap[item.Icon] || ""}
                    height={idx === 0 ? "34" : "28"}
                    style={{
                      width: idx === 0 ? 34 : 28,
                      height: idx === 0 ? 34 : 28,
                      filter: idx === 0 ? "drop-shadow(0 2px 6px #ffe0e0)" : "none",
                      borderRadius: idx === 0 ? 8 : 0,
                      background: idx === 0 ? "none" : "none",
                      padding: idx === 0 ? 2 : 0,
                      transition: "all 0.2s"
                    }}
                    alt={item.MenuName + " icon"}
                  />
                </i>
                <span style={{ flex: 1 }}>{item.MenuName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            display: 'none'  // Hidden by default, shown in mobile media query
          }}
        />
      )}

      <style>
        {`
          .sidebar {
            position: fixed;
            top: 60px;
            left: 0;
            height: calc(100vh - 60px);
            width: 240px;
            background: #fff;
            z-index: 999;
            transition: all 0.3s ease;
          }

          /* Desktop and Tablet */
          @media (min-width: 769px) {
            #main {
              margin-left: 240px;
            }
            
            .sidebar {
              transform: translateX(0);
            }
          }

          /* Small screens and tablets */
          @media (max-width: 1024px) {
            .sidebar {
              width: 200px;
            }
            #main {
              margin-left: 200px;
            }
          }

          /* Mobile */
          @media (max-width: 768px) {
            .mobile-nav-toggle {
              display: block !important;
            }

            .mobile-nav-overlay {
              display: block !important;
            }

            .sidebar {
              transform: translateX(-100%);
              width: 240px;
            }

            .sidebar.mobile-nav-active {
              transform: translateX(0);
            }

            #main {
              margin-left: 0;
            }
          }

          .sidebar-nav .nav-item.active-tab,
          .sidebar-nav .nav-link.active {
            background-color: #e9ecef !important;
          }
          .sidebar-nav .nav-item-home {
            box-shadow: 0 2px 8px rgba(255, 200, 100, 0.08);
            border-radius: 12px 12px 0 0;
            margin-bottom: 10px;
          }
          .sidebar-nav .nav-item-home .nav-link {
            color: #c20001 !important;
            font-weight: 600 !important;
            font-size: 1.15rem !important;
            letter-spacing: 0.5px;
            background: transparent !important;
            border-radius: 10px !important;
          }
          .sidebar-nav .nav-item-home .nav-link img {
            filter: drop-shadow(0 2px 6px #ffe0e0);
            background: none;
            border-radius: 8px;
            padding: 2px;
          }
          .sidebar-nav .nav-link {
            transition: background 0.2s, color 0.2s;
          }
          .sidebar-nav .nav-link:hover {
            background: #f7f7f7 !important;
            color: #c20001 !important;
            text-decoration: none;
          }
          .sidebar-nav .nav-link:hover img {
            filter: drop-shadow(0 2px 6px #ffe0e0) brightness(1.1);
          }
        `}
      </style>
    </>
  );
}

export default Sidebar;
