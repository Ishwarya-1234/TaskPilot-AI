import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Planner from "../pages/Planner";
import RescueMode from "../pages/RescueMode";
import Chat from "../pages/Chat";
import Analytics from "../pages/Analytics";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/rescue" element={<RescueMode />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
