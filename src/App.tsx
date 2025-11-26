import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import PageContent from "./components/Layout/PageContent";
import Incoming from "./pages/Incoming/Incoming";
import Today from "./pages/today"; // Переименовал
import "./sidebar/sidebar.css";
import "./App.css"; // Добавим стили

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <PageContent>
          <Routes>
            <Route path="/" element={<div>Главная страница</div>} />
            <Route path="/incoming" element={<Incoming />} />
            <Route path="/today" element={<Today />} />
            {/* Добавь другие роуты здесь */}
          </Routes>
        </PageContent>
      </div>
    </Router>
  );
};

export default App;
