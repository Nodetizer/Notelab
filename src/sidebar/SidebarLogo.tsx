import React from "react";
import { Link } from "react-router-dom";
import { Logo, LogoHover, LogoClick } from "../assets/icons";

interface SidebarLogoProps {
  isHovered: boolean;
  isClicked: boolean;
  onHover: (hovered: boolean) => void;
  onClick: (clicked: boolean) => void;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({
  isHovered,
  isClicked,
  onHover,
  onClick,
}) => {
  const getLogo = () => {
    if (isClicked) return LogoClick;
    if (isHovered) return LogoHover;
    return Logo;
  };

  return (
    <div className="sidebar-logo-wrapper">
      <Link
        to="/"
        className="sidebar-logo-container"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => {
          onHover(false);
          onClick(false);
        }}
        onMouseDown={() => onClick(true)}
        onMouseUp={() => onClick(false)}
      >
        <img src={getLogo()} alt="Notelab Logo" className="sidebar-logo" />
      </Link>
    </div>
  );
};

export default SidebarLogo;
