import { HiOutlineClock, HiOutlineFlag } from "react-icons/hi";

const priorityStyles = {
  High: {
    badge: "bg-rose-100 text-rose-700 ring-rose-200",
    accent: "border-rose-400",
    dot: "bg-rose-500",
  },
  Medium: {
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
    accent: "border-amber-400",
    dot: "bg-amber-500",
  },
  Low: {
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    accent: "border-emerald-400",
    dot: "bg-emerald-500",
  },
};

export default function SubtaskCard({ index, title, hours, priority }) {
  const styles = priorityStyles[priority] ?? priorityStyles.Medium;

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600">
            {index}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug text-slate-900">{title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <HiOutlineClock className="h-4 w-4 text-slate-400" />
                {hours}h estimated
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles.badge}`}
              >
                <HiOutlineFlag className="h-3.5 w-3.5" />
                {priority}
              </span>
            </div>
          </div>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} aria-hidden="true" />
      </div>
    </article>
  );
}
