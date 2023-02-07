import '../style.css';
import { Link } from "react-router-dom";
import SessionContext from '../Context/SessionContext'
import React, { useContext, useEffect, useState, } from "react";
import iconUser from '../assets/img/user.png'
import iconSchool from '../assets/img/school.png'
import iconPrevilige from '../assets/img/previlige.png'
import iconDevice from '../assets/img/devices.png'

function Sidebar() {
    const { session } = useContext(SessionContext)
    const [nav, setNav] = useState([])

    useEffect(() => {
        let arr = []
        session.data.map((item) => {
            let i = arr.find(i => i.MenuName === item.MenuName)
            if (i === undefined) {
                let o = { 'Link': item.Link, 'MenuName': item.MenuName, Icon: item.Icon }
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
                                    <i className="bi bi-menu-button-wide">
                                        <img src={item.Icon === 'user' ? iconUser :
                                            item.Icon === 'previlige' ? iconPrevilige :
                                                item.Icon === 'devices' ? iconDevice :
                                                    item.Icon === 'school' ? iconSchool : ''} height='30' />
                                    </i>
                                    <span>{item.MenuName}</span>

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