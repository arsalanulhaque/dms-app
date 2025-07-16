import { Link } from "react-router-dom";
import useSession from '../Context/SessionContext';
import React, { useState, useEffect } from "react";
import iconProfile from '../assets/img/profile.png';

function Header() {
    const [getSession, , killSession] = useSession();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

    const user = getSession()?.data?.[0] || {};
    const username = user.Username || "User";
    const privilege = user.PreviligeName || "User";

    const handleLogout = () => {
        killSession();
    };

    const toggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-nav-active');
        }
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header id="header" className="header fixed-top d-flex align-items-center shadow-sm bg-white">
            <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                    {isMobileView && (
                        <button
                            className="toggle-sidebar-btn btn btn-link border-0 p-0 me-3"
                            onClick={toggleSidebar}
                            style={{ 
                                boxShadow: "none",
                                fontSize: "1.5rem",
                                color: "#333",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <i className="bi bi-list"></i>
                        </button>
                    )}
                    <div className="logo d-flex align-items-center">
                        <span className="fw-bold" style={{ fontSize: isMobileView ? '1rem' : '1.25rem' }}>
                            {isMobileView ? 'AMS' : 'Asset Management System'}
                        </span>
                    </div>
                </div>

                <nav className="header-nav">
                    <ul className="d-flex align-items-center mb-0">
                        <li className="nav-item dropdown">
                            <button
                                className="nav-link nav-profile d-flex align-items-center pe-0 btn btn-link border-0 p-0"
                                type="button"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ boxShadow: "none" }}
                            >
                                <img 
                                    src={iconProfile} 
                                    alt="Profile" 
                                    className="rounded-circle" 
                                    width={isMobileView ? 32 : 36} 
                                    height={isMobileView ? 32 : 36} 
                                />
                                <span className="d-none d-md-block dropdown-toggle ps-2">
                                    {username}
                                </span>
                            </button>
                            <ul 
                                className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
                                style={{
                                    minWidth: '200px',
                                    padding: '10px 0',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                }}
                            >
                                <li className="dropdown-header">
                                    <h6 className="mb-0">{username}</h6>
                                    <span className="text-muted small">{privilege}</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    {user.IsAdmin === 1 && (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className="dropdown-item d-flex align-items-center"
                                                style={{
                                                    padding: '10px 20px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <i className="bi bi-house me-2"></i>
                                                <span>Dashboard</span>
                                            </Link>
                                            <hr className="dropdown-divider" />
                                        </>
                                    )}
                                    <Link
                                        to="/Login"
                                        onClick={handleLogout}
                                        className="dropdown-item d-flex align-items-center"
                                        style={{
                                            padding: '10px 20px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        <span className="text-danger">Sign Out</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>

            <style>
                {`
                    .header {
                        height: 60px;
                        padding: 0 20px;
                        transition: all 0.3s;
                    }

                    .dropdown-item:hover {
                        background-color: #f8f9fa;
                    }

                    .toggle-sidebar-btn:hover {
                        color: #c20001 !important;
                    }

                    @media (max-width: 768px) {
                        .header {
                            padding: 0 15px;
                        }
                        
                        .nav-profile {
                            padding: 5px !important;
                        }
                    }

                    @media (min-width: 769px) {
                        .toggle-sidebar-btn {
                            display: none;
                        }
                    }
                `}
            </style>
        </header>
    );
}

export default Header;