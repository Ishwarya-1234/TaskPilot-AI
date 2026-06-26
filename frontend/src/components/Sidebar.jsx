import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineChat,
  HiOutlineChartBar,
} from "react-icons/hi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { to: "/tasks", label: "Tasks", icon: HiOutlineClipboardList },
  { to: "/planner", label: "Planner", icon: HiOutlineCalendar },
  { to: "/rescue", label: "Deadline Guardian", icon: HiOutlineLightningBolt },
  { to: "/chat", label: "AI Chat", icon: HiOutlineChat },
  { to: "/analytics", label: "Analytics", icon: HiOutlineChartBar },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
          TP
        </div>
        <div>
          <p className="text-sm font-semibold text-white">TaskPilot AI</p>
          <p className="text-xs text-slate-400">Hackathon Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/10 p-4">
          <p className="text-xs font-medium text-indigo-300">Pro tip</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Use Deadline Guardian when deadlines are closing in fast.
          </p>
        </div>
      </div>
    </aside>
  );
}
