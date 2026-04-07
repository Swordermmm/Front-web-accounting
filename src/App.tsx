import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import DiscussionPage from "./pages/DiscussionPage/DiscussionPage";
import TeamsPage from "./pages/TeamsPage/TeamsPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/discussion" element={<DiscussionPage />} />
      <Route path="/teams" element={<TeamsPage />} />
    </Routes>
  );
}

export default App;
