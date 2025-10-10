import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./sidebar/sidebar";
import PageContent from "./components/Sidebar/Pages/pageContent";
import Incoming from "./pages/incoming";
import "./sidebar/sidebar.css";

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <PageContent>
          <Routes>
            <Route path="/" element={null} />
            <Route path="/incoming" element={<Incoming />} />
          </Routes>
        </PageContent>
      </div>
    </Router>
  );
};

export default App;
