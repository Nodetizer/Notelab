import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./sidebar/sidebar";
import PageContent from "./components/Pages/pageContent";
import Incoming from "./pages/incoming";
import Incoming_test from "./pages/today";
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

          <Routes>
            <Route path="/" element={null} />
            <Route path="/incoming_test" element={<Incoming_test />} />
          </Routes>
        </PageContent>
      </div>
    </Router>
  );
};

export default App;
