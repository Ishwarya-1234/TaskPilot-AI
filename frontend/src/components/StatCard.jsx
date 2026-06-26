export default function StatCard({ label, value, change, icon: Icon, trend = "neutral" }) {
  const trendStyles = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-rose-600 bg-rose-50",
    neutral: "text-slate-600 bg-slate-100",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {change && (
        <span
          className={`mt-4 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${trendStyles[trend]}`}
        >
          {change}
        </span>
      )}
    </div>
  );
}
