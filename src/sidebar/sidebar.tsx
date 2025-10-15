import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import {
  Logo,
  LogoHover,
  LogoClick,
  Incoming,
  CloseSidebar,
  CloseSidebarHover,
  CloseSidebarClick,
  Progress, // иконка уровня
} from "./../assets/icons";

const Sidebar: React.FC = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isCloseClicked, setIsCloseClicked] = useState(false);

  const getLogo = () => {
    if (isLogoClicked) return LogoClick;
    if (isLogoHovered) return LogoHover;
    return Logo;
  };

  const getCloseIcon = () => {
    if (isCloseClicked) return CloseSidebarClick;
    if (isCloseHovered) return CloseSidebarHover;
    return CloseSidebar;
  };

  // пример уровня, можно передавать через пропсы
  const level = 35; // %

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
          src={getCloseIcon()}
          alt="Close Sidebar Icon"
          className="sidebar-close-icon"
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => {
            setIsCloseHovered(false);
            setIsCloseClicked(false);
          }}
          onMouseDown={() => setIsCloseClicked(true)}
          onMouseUp={() => setIsCloseClicked(false)}
        />
      </div>

      <div className="sidebar-divider"></div>

      {/* Уровень */}
      <div className="sidebar-level">
        <div className="sidebar-level-header">
          <img src={Progress} alt="Level Icon" className="sidebar-level-icon" />
          <span className="sidebar-level-text">Уровень 7</span>
        </div>
        <div className="sidebar-level-bar-container">
          <div
            className="sidebar-level-bar-fill"
            style={{ width: `${level}%` }}
          ></div>
        </div>
      </div>

      {/* Ссылки */}
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
