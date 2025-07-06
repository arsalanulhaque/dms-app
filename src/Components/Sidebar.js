import "../style.css";
import { Link } from "react-router-dom";
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

function Sidebar() {
  const [getSession, setSession] = useSession();
  const [nav, setNav] = useState([]);

  useEffect(() => {
    let arr = [];
    const sessionData = getSession();
    // console.log(sessionData);

    sessionData?.data.map((item) => {
      let i = arr.find((i) => i.MenuName === item.MenuName);

      if (i === undefined) {
        let o = { Link: item.Link, MenuName: item.MenuName, Icon: item.Icon };
        arr.push(o);
      }
    });

    if (sessionData?.isAdmin && !sessionData?.isAppDeveloper) {
      arr.push({ Link: "/weekly-report", MenuName: "Weekly Report", Icon: "WeeklyReport" });
    }
    
    setNav(arr);
  }, []);

  return (
    <>
      {/* < !-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          {nav.map((item) => {
            return (
              <li className="nav-item" key={item.MenuName}>
                <Link to={item.Link} className="nav-link collapsed">
                  <i className="bi bi-menu-button-wide">
                    <img
                      src={
                        item.Icon === "user"
                          ? iconUser
                          : item.Icon === "previlige"
                          ? iconPrevilige
                          : item.Icon === "devices"
                          ? iconDevice
                          : item.Icon === "school"
                          ? iconSchool
                          : item.Icon === "actions"
                          ? iconAction
                          : item.Icon === "menus"
                          ? iconMenu
                          : item.Icon === "policies"
                          ? iconPolicy
                          : item.Icon === "home"
                          ? iconHome
                          : item.Icon === "WeeklyReport"
                          ? iconWeeklyReport
                          : item.Icon === "upload"
                          ? iconBulkUpload
                          : item.Icon === "status"
                          ? iconHistory
                          : ""
                      }
                      height="30"
                    />
                  </i>
                  <span>{item.MenuName}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      {/* <!--End Sidebar-- > */}
    </>
  );
}

export default Sidebar;
