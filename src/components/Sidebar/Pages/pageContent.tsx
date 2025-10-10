import React from "react";
// import "./sidebar.css";

interface PageContentProps {
  children: React.ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return <div className="page-content">{children}</div>;
};

export default PageContent;
