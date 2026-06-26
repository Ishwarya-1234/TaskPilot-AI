import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { PRIORITY_STYLES } from "../services/mockData";
import { useTasks } from "../context/TaskContext";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineArrowRight,
  HiOutlineExclamation,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function Dashboard() {
  const { tasks } = useTasks();
  const [loading, setLoading] = useState(true);
  const [aiPlansGenerated, setAiPlansGenerated] = useState(0);
  const [rescueSessions, setRescueSessions] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "Done").length,
    pendingTasks: tasks.filter((t) => t.status !== "Done").length,
    upcomingDeadlines: tasks.filter((t) => t.status !== "Done" && t.deadline && t.deadline !== "Not specified").length,
    overdueTasks: tasks.filter((t) => {
      if (t.status === "Done" || !t.deadline || t.deadline === "Not specified") return false;
      const deadlineDate = new Date(t.deadline);
      const today = new Date();
      return deadlineDate < today;
    }).length,
    aiPlansGenerated,
    rescueSessions,
  };

  const progress = {
    completionRate: stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0,
    weeklyCompleted: stats.completedTasks,
    weeklyGoal: stats.totalTasks,
  };

  const recentTasks = tasks.slice(0, 4).map((task) => ({
    id: task.id,
    title: task.title,
    due: task.deadline === "Not specified" ? "No deadline" : task.deadline,
    priority: task.priority,
    status: task.status,
  }));

  const todayTasks = tasks.filter((t) => {
    if (!t.deadline || t.deadline === "Not specified") return false;
    const deadlineDate = new Date(t.deadline);
    const today = new Date();
    return deadlineDate.toDateString() === today.toDateString();
  });

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "High").length, color: "#f43f5e" },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length, color: "#f59e0b" },
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length, color: "#10b981" },
  ].filter((item) => item.value > 0);

  const weeklyData = [
    { day: "Mon", completed: Math.floor(stats.completedTasks * 0.15), planned: Math.floor(stats.totalTasks * 0.2) },
    { day: "Tue", completed: Math.floor(stats.completedTasks * 0.2), planned: Math.floor(stats.totalTasks * 0.2) },
    { day: "Wed", completed: Math.floor(stats.completedTasks * 0.1), planned: Math.floor(stats.totalTasks * 0.15) },
    { day: "Thu", completed: Math.floor(stats.completedTasks * 0.25), planned: Math.floor(stats.totalTasks * 0.2) },
    { day: "Fri", completed: Math.floor(stats.completedTasks * 0.2), planned: Math.floor(stats.totalTasks * 0.2) },
    { day: "Sat", completed: Math.floor(stats.completedTasks * 0.05), planned: Math.floor(stats.totalTasks * 0.1) },
    { day: "Sun", completed: Math.floor(stats.completedTasks * 0.05), planned: Math.floor(stats.totalTasks * 0.05) },
  ];

  const upcomingDeadlines = tasks
    .filter((t) => t.status !== "Done" && t.deadline && t.deadline !== "Not specified")
    .slice(0, 4)
    .map((task) => {
      const deadlineDate = new Date(task.deadline);
      const today = new Date();
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        id: task.id,
        title: task.title,
        date: task.deadline,
        daysLeft: diffDays < 0 ? 0 : diffDays,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <SkeletonLoader className="h-32" />
            <SkeletonLoader className="h-32" />
            <SkeletonLoader className="h-32" />
            <SkeletonLoader className="h-32" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Tasks"
              value={stats.totalTasks}
              change="Across all projects"
              trend="neutral"
              icon={HiOutlineClipboardList}
            />
            <StatCard
              label="Completed Tasks"
              value={stats.completedTasks}
              change="+3 this week"
              trend="up"
              icon={HiOutlineCheckCircle}
            />
            <StatCard
              label="Pending Tasks"
              value={stats.pendingTasks}
              change="Need attention"
              trend="neutral"
              icon={HiOutlineClock}
            />
            <StatCard
              label="Overdue Tasks"
              value={stats.overdueTasks}
              change="Action required"
              trend="down"
              icon={HiOutlineExclamation}
            />
            <StatCard
              label="Productivity"
              value={`${progress.completionRate}%`}
              change="Completion rate"
              trend="up"
              icon={HiOutlineCheckCircle}
            />
            <StatCard
              label="AI Plans"
              value={stats.aiPlansGenerated}
              change="Generated this session"
              trend="up"
              icon={HiOutlineSparkles}
            />
            <StatCard
              label="Rescue Sessions"
              value={stats.rescueSessions}
              change="Deadline guardian"
              trend="neutral"
              icon={HiOutlineLightningBolt}
            />
            <StatCard
              label="Upcoming Deadlines"
              value={stats.upcomingDeadlines}
              change="Next 7 days"
              trend="down"
              icon={HiOutlineCalendar}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {loading ? (
          <>
            <SkeletonLoader className="h-40 lg:col-span-2" />
            <SkeletonLoader className="h-40" />
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Weekly Progress</h2>
                  <p className="text-sm text-slate-500">
                    {progress.weeklyCompleted} of {progress.weeklyGoal} tasks completed this week
                  </p>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{progress.completionRate}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                  style={{ width: `${progress.completionRate}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">Real-time data from TaskContext</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                <Link
                  to="/tasks"
                  className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Add New Task
                </Link>
                <Link
                  to="/planner"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Open Planner
                </Link>
                <Link
                  to="/rescue"
                  className="flex w-full items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                >
                  Deadline Guardian
                </Link>
              </div>
            </section>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {loading ? (
          <>
            <SkeletonLoader className="h-64" />
            <SkeletonLoader className="h-64" />
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Today's Tasks</h2>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {todayTasks.length} tasks
                </span>
              </div>
              {todayTasks.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No tasks due today</p>
              ) : (
                <ul className="space-y-3">
                  {todayTasks.slice(0, 5).map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-sm text-slate-500">{task.deadline}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Recent Tasks</h2>
                <Link to="/tasks" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  View all <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <ul className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{task.due}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {loading ? (
          <>
            <SkeletonLoader className="h-80" />
            <SkeletonLoader className="h-80" />
            <SkeletonLoader className="h-80" />
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Weekly Completion</h2>
              <p className="mb-4 text-sm text-slate-500">Tasks completed vs planned</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="planned" name="Planned" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Priority Distribution</h2>
              <p className="mb-4 text-sm text-slate-500">Tasks by priority level</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Upcoming Deadlines</h2>
              <p className="mb-4 text-sm text-slate-500">Tasks due soon</p>
              <ul className="space-y-3">
                {upcomingDeadlines.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.date}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.daysLeft === 0
                          ? "bg-rose-100 text-rose-700"
                          : item.daysLeft <= 2
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {item.daysLeft === 0 ? "Today" : `${item.daysLeft}d left`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      <div className="grid gap-6">
        {loading ? (
          <SkeletonLoader className="h-80" />
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Completion Trend</h2>
            <p className="mb-4 text-sm text-slate-500">Task completion over time</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    name="Planned"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    dot={{ fill: "#cbd5e1", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
