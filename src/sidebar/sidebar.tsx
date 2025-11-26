import React, { useState } from "react";
import SidebarLogo from "./SidebarLogo";
import SidebarLink from "./SidebarLink";
import { SIDEBAR_ITEMS } from "./sidebarConfig";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);

  return (
    <div className="sidebar">
      <SidebarLogo
        isHovered={isLogoHovered}
        isClicked={isLogoClicked}
        onHover={setIsLogoHovered}
        onClick={setIsLogoClicked}
      />

      <div className="sidebar-divider" />

      {SIDEBAR_ITEMS.map((item) => (
        <SidebarLink
          key={item.to}
          to={item.to}
          icon={item.icon}
          text={item.text}
        />
      ))}
    </div>
  );
};

export default Sidebar;
