import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your productivity command center",
  },
  "/tasks": {
    title: "Tasks",
    subtitle: "Manage and prioritize your work",
  },
  "/planner": {
    title: "Planner",
    subtitle: "Break big goals into actionable steps",
  },
  "/rescue": {
    title: "Deadline Guardian",
    subtitle: "Emergency rescue plans powered by Gemini AI",
  },
  "/chat": {
    title: "AI Chat",
    subtitle: "Your personal productivity coach",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Track productivity and task trends",
  },
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] ?? { title: "TaskPilot AI", subtitle: "" };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="pl-64">
        <Navbar title={meta.title} subtitle={meta.subtitle} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
