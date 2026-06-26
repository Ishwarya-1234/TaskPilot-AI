export const MOCK_DASHBOARD = {
  stats: {
    totalTasks: 18,
    completedTasks: 12,
    pendingTasks: 6,
    upcomingDeadlines: 4,
  },
  progress: {
    completionRate: 67,
    weeklyCompleted: 8,
    weeklyGoal: 12,
  },
  recentTasks: [
    {
      id: 1,
      title: "Finalize hackathon pitch deck",
      due: "Today, 6:00 PM",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Review frontend routing setup",
      due: "Tomorrow",
      priority: "Medium",
      status: "Todo",
    },
    {
      id: 3,
      title: "Prepare demo script",
      due: "Fri, Jun 27",
      priority: "Low",
      status: "Todo",
    },
    {
      id: 4,
      title: "Wire Gemini chat endpoint",
      due: "Sat, Jun 28",
      priority: "High",
      status: "Done",
    },
  ],
  upcomingDeadlines: [
    { id: 1, title: "Pitch deck", date: "Jun 25", daysLeft: 0 },
    { id: 2, title: "Router refactor", date: "Jun 26", daysLeft: 1 },
    { id: 3, title: "Demo script", date: "Jun 27", daysLeft: 2 },
    { id: 4, title: "Analytics polish", date: "Jun 28", daysLeft: 3 },
  ],
};

export const MOCK_ANALYTICS = {
  productivityScore: 87,
  completedTasks: 42,
  pendingTasks: 11,
  weeklyTrend: [
    { day: "Mon", completed: 4, planned: 6 },
    { day: "Tue", completed: 6, planned: 6 },
    { day: "Wed", completed: 3, planned: 5 },
    { day: "Thu", completed: 7, planned: 7 },
    { day: "Fri", completed: 5, planned: 8 },
    { day: "Sat", completed: 8, planned: 8 },
    { day: "Sun", completed: 9, planned: 10 },
  ],
  statusBreakdown: [
    { name: "Completed", value: 42, color: "#10b981" },
    { name: "In Progress", value: 7, color: "#6366f1" },
    { name: "Pending", value: 4, color: "#f59e0b" },
  ],
};

export const PRIORITY_STYLES = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

export const STATUS_STYLES = {
  Todo: "bg-slate-100 text-slate-600",
  "In Progress": "bg-indigo-100 text-indigo-700",
  Done: "bg-emerald-100 text-emerald-700",
};
