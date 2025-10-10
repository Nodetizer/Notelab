import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo-wrapper">
        <Link to="/">
          <img src="/Logo.svg" alt="Notelab Logo" className="sidebar-logo" />
        </Link>
      </div>

      <div className="sidebar-links">
        <Link to="/incoming" className="sidebar-link">
          <img
            src="/Incoming.svg"
            alt="Incoming Icon"
            className="sidebar-icon"
          />
          <span className="sidebar-link-text">Входящие</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
