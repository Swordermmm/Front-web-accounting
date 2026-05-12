import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import DiscussionPage from "./pages/DiscussionPage/DiscussionPage";
import TeamsPage from "./pages/TeamsPage/TeamsPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import CuratorPage from "./pages/CuratorPage/CuratorPage";
CuratorPage;

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/discussion" element={<DiscussionPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/curators" element={<CuratorPage />} />
    </Routes>
  );
}

export default App;
