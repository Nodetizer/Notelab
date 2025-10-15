import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import {
  Logo,
  LogoHover,
  LogoClick,
  Incoming,
  CloseSidebar,
} from "./../assets/icons";

const Sidebar: React.FC = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);

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

        <img
          src={CloseSidebar}
          alt="Close Sidebar Icon"
          className="sidebar-close-icon"
        />
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-links">
        <Link to="/incoming" className="sidebar-link">
          <img src={Incoming} alt="Incoming Icon" className="sidebar-icon" />
          <span className="sidebar-link-text">Входящие</span>
        </Link>
      </div>

      <div className="sidebar-links">
        <Link to="/incoming_test" className="sidebar-link">
          <img src={Incoming} alt="Incoming Icon" className="sidebar-icon" />
          <span className="sidebar-link-text">Тест камминг</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
