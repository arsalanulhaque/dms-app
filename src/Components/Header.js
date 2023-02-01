import { Link } from "react-router-dom";
import SessionContext from '../Context/SessionContext'
import React, { useContext, useEffect, } from "react";

function Header() {
    const { session } = useContext(SessionContext);

    return (
        < header id="header" className="header fixed-top d-flex align-items-center" >

            <div className="d-flex align-items-center justify-content-between">
                <a href="index.html" className="logo d-flex align-items-center">
                    {/* <img src="assets/img/logo.png" alt="" /> */}
                    <span className="d-none d-lg-block">Asset Management System</span>
                </a>
                <i className="bi bi-list toggle-sidebar-btn"></i>
            </div>

            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown pe-3">

                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                            <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{ session?.data[0]?.Username}</span>
                        </a>
                        {/* <!-- End Profile Iamge Icon --> */}

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{session?.data[0]?.Username}</h6>
                                <span>{session?.data[0]?.PreviligeName}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                    <i className="bi bi-gear"></i>
                                    <span>Account Settings</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                                    <i className="bi bi-question-circle"></i>
                                    <span>Need Help?</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <Link to='/Login' className="dropdown-item d-flex align-items-center">
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