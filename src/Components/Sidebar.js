import '../style.css';
import { Link } from "react-router-dom";
import SessionContext from '../Context/SessionContext'
import React, { useContext, useEffect, useState, } from "react";

function Sidebar() {
    const { session } = useContext(SessionContext)
    const [nav, setNav] = useState([])

    useEffect(() => {
        let arr = []
        session.data.map((item) => {
            let i = arr.find(i => i.MenuName === item.MenuName)
            if (i === undefined) {
                let o = { 'Link': item.Link, 'MenuName': item.MenuName }
                arr.push(o)
            }
        })
        console.log(arr)
        setNav(arr)
    }, [setNav, session])

    return (
        <>
            {/* < !-- ======= Sidebar ======= --> */}
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    {
                        nav.map(item => {
                            return <li className="nav-item" key={item.MenuName}>
                                <Link to={item.Link} className="nav-link collapsed" >
                                    <i className="bi bi-menu-button-wide"></i><span>{item.MenuName}</span><i className="bi bi-chevron-down ms-auto"></i>
                                </Link>
                            </li>
                        })
                    }
                </ul>
            </aside>
            {/* <!--End Sidebar-- > */}
        </>
    );
}

export default Sidebar;