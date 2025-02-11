import { Link } from "react-router-dom";
import useSession from '../Context/SessionContext'
import React from "react";
import iconProfile from '../assets/img/profile.png'

function Header() {
    const [getSession, setSession, killSession] = useSession();
    const handleLogout=()=>{
        killSession()
    }

    return (
        < header id="header" className="header fixed-top d-flex align-items-center" >

            <div className="d-flex align-items-center justify-content-between">
                <div className="logo d-flex align-items-center">
                    <span className="d-none d-lg-block">Asset Management System</span>
                </div>
                <i className="bi bi-list toggle-sidebar-btn"></i>
            </div>

            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown pe-3">

                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                            <img src={iconProfile} alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{getSession()?.data[0]?.Username}</span>
                        </a>
                        {/* <!-- End Profile Iamge Icon --> */}

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{getSession()?.data[0]?.Username}</h6>
                                <span>{getSession()?.data[0]?.PreviligeName}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link to='/Login' onClick={handleLogout} className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Sign Out</span>
                                </Link>
                            </li>

                        </ul>
                        {/* <!-- End Profile Dropdown Items --> */}
                    </li>
                    {/* <!-- End Profile Nav --> */}

                </ul>
            </nav>
            {/* <!-- End Icons Navigation --> */}

        </header >
    )
};

export default Header;