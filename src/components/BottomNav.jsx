import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlus, FaList, FaChartBar, FaTrophy, FaEllipsisH } from "react-icons/fa";

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/task-form" className="nav-item" title="Add Goal">
                <FaPlus />
            </NavLink>
            <NavLink to="/" className="nav-item" title="Goals List">
                <FaList />
            </NavLink>
            <NavLink to="/stats" className="nav-item" title="Statistics">
                <FaChartBar />
            </NavLink>
            <NavLink to="/achievements" className="nav-item" title="Achievements">
                <FaTrophy />
            </NavLink>
            <NavLink to="/extras" className="nav-item" title="More">
                <FaEllipsisH />
            </NavLink>
        </nav>
    );
};

export default BottomNav;
