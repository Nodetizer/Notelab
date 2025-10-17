import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { Logo, LogoHover, LogoClick, Incoming, Today } from "./../assets/icons";

const Sidebar: React.FC = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const location = useLocation();

  const getLogo = () => {
    if (isLogoClicked) return LogoClick;
    if (isLogoHovered) return LogoHover;
    return Logo;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo-wrapper">
        <Link
          to="/"
          className="sidebar-logo-container"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => {
            setIsLogoHovered(false);
            setIsLogoClicked(false);
          }}
          onMouseDown={() => setIsLogoClicked(true)}
          onMouseUp={() => setIsLogoClicked(false)}
        >
          <img src={getLogo()} alt="Notelab Logo" className="sidebar-logo" />
        </Link>
      </div>

      <div className="sidebar-divider"></div>

      {/* Входящие */}
      <div className="sidebar-links">
        <Link
          to="/incoming"
          className={`sidebar-link ${
            location.pathname === "/incoming" ? "active" : ""
          }`}
        >
          <img src={Incoming} alt="Incoming Icon" className="sidebar-icon" />
          <span className="sidebar-link-text">Входящие</span>
        </Link>
      </div>

      {/* Сегодня */}
      <div className="sidebar-links">
        <Link
          to="/today"
          className={`sidebar-link ${
            location.pathname === "/today" ? "active" : ""
          }`}
        >
          <img src={Today} alt="Today Icon" className="sidebar-icon" />
          <span className="sidebar-link-text">Сегодня</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
