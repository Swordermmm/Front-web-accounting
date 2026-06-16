import { Routes, Route } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Login from "./components/Login";
import Register from "./components/Register";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import DiscussionPage from "./pages/DiscussionPage/DiscussionPage";
import TeamsPage from "./pages/TeamsPage/TeamsPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import CuratorPage from "./pages/CuratorPage/CuratorPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import TeamDetailPage from "./pages/TeamDetailPage/TeamDetailPage";
import MeetingDetailPage from "./pages/MeetingDetailPage/MeetingDetailPage";
import DiscussionCommentsPage from "./pages/DiscussionCommentsPage/DiscussionCommentsPage";

import "./App.css";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Глобальная ошибка загрузки данных:", error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error("Глобальная ошибка мутации (отправки):", error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/discussion" element={<DiscussionPage />} />
        <Route path="/idea/:id" element={<DiscussionCommentsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/team/:id" element={<TeamDetailPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/curators" element={<CuratorPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/meeting/:id" element={<MeetingDetailPage />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
