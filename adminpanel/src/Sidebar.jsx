import React from 'react'
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill,
    BsGraphUpArrow
}
    from 'react-icons/bs'
import { Link } from 'react-router-dom'

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand' style={{ color: 'white' }}>
                    True Pay DashBoard
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to={'/'}>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={'userslist'}>
                        <BsPeopleFill className='icon' /> User List
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={'transaction'}>
                        <BsGraphUpArrow className='icon' /> Transactions
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar