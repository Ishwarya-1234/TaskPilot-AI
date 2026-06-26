import { HiOutlineCalendar, HiOutlineTrash, HiOutlineCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import { PRIORITY_STYLES, STATUS_STYLES } from "../services/mockData";

const PRIORITY_BORDER = {
  High: "border-l-rose-500",
  Medium: "border-l-amber-500",
  Low: "border-l-emerald-500",
};

export default function TaskCard({ task, onComplete, onDelete, onStatusChange }) {
  const isDone = task.status === "Done";

  return (
    <article
      className={`rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md ${PRIORITY_BORDER[task.priority] ?? PRIORITY_BORDER.Medium}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold text-slate-900 ${isDone ? "line-through text-slate-400" : ""}`}
          >
            {task.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {task.deadline && (
              <span className="inline-flex items-center gap-1.5">
                <HiOutlineCalendar className="h-4 w-4" />
                {task.deadline}
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}
            >
              {task.status}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onStatusChange && !isDone && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          )}
          {onComplete && !isDone && (
            <button
              type="button"
              onClick={() => {
                onComplete(task.id);
                toast.success("Task completed!");
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-emerald-700 hover:scale-105 active:scale-95"
            >
              <HiOutlineCheck className="h-3.5 w-3.5" />
              Complete
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                toast.success("Task deleted!");
              }}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-95"
              aria-label="Delete task"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
