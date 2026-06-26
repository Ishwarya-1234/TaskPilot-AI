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
} from "recharts";
import StatCard from "../components/StatCard";
import { useTasks } from "../context/TaskContext";
import {
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChartBar,
} from "react-icons/hi";

export default function Analytics() {
  const { tasks } = useTasks();

  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Done").length;
  const totalTasks = tasks.length;
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusBreakdown = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length, color: "#6366f1" },
    { name: "Pending", value: tasks.filter((t) => t.status === "Todo").length, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  const weeklyTrend = [
    { day: "Mon", completed: Math.floor(completedTasks * 0.15), planned: Math.floor(totalTasks * 0.2) },
    { day: "Tue", completed: Math.floor(completedTasks * 0.2), planned: Math.floor(totalTasks * 0.2) },
    { day: "Wed", completed: Math.floor(completedTasks * 0.1), planned: Math.floor(totalTasks * 0.15) },
    { day: "Thu", completed: Math.floor(completedTasks * 0.25), planned: Math.floor(totalTasks * 0.2) },
    { day: "Fri", completed: Math.floor(completedTasks * 0.2), planned: Math.floor(totalTasks * 0.2) },
    { day: "Sat", completed: Math.floor(completedTasks * 0.05), planned: Math.floor(totalTasks * 0.1) },
    { day: "Sun", completed: Math.floor(completedTasks * 0.05), planned: Math.floor(totalTasks * 0.05) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Productivity Score"
          value={`${productivityScore}%`}
          change="+5% vs last week"
          trend="up"
          icon={HiOutlineTrendingUp}
        />
        <StatCard
          label="Completed Tasks"
          value={completedTasks}
          change="All time"
          trend="up"
          icon={HiOutlineCheckCircle}
        />
        <StatCard
          label="Pending Tasks"
          value={pendingTasks}
          change="Needs action"
          trend="neutral"
          icon={HiOutlineClock}
        />
        <StatCard
          label="Weekly Average"
          value="6.0"
          change="Tasks per day"
          trend="up"
          icon={HiOutlineChartBar}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Weekly Trend</h2>
          <p className="mb-4 text-sm text-slate-500">Completed vs planned tasks (estimated from current data)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
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
          <h2 className="text-base font-semibold text-slate-900">Task Status Breakdown</h2>
          <p className="mb-4 text-sm text-slate-500">Distribution across all tasks</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
