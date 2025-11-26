import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: string;
  text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <div className="sidebar-links">
      <Link to={to} className={`sidebar-link ${isActive ? "active" : ""}`}>
        <img src={icon} alt={`${text} Icon`} className="sidebar-icon" />
        <span className="sidebar-link-text">{text}</span>
      </Link>
    </div>
  );
};

export default SidebarLink;
