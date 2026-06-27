import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import LoadingSpinner from "../components/LoadingSpinner";
import SubtaskCard from "../components/SubtaskCard";
import { parseAiBreakdown } from "../services/parseAiBreakdown";
import { postJson } from "../services/api";
import { useTasks } from "../context/TaskContext";

export default function Planner() {
  const { addMultipleTasks } = useTasks();
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [planTask, setPlanTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    if (!task.trim()) return;

    setLoading(true);
    setError("");
    setSubtasks([]);
    setPlanTask("");

    try {
      const data = await postJson("/task-breakdown", {
        task: task.trim(),
        deadline: deadline || "Not specified",
        hours: Number(hours) || 8,
      });

      const plan = parseAiBreakdown(data.ai_breakdown);
      setSubtasks(plan.subtasks);
      setPlanTask(data.task ?? task.trim());
      toast.success("Plan generated successfully!");
      // Dispatch event for Dashboard tracking
      window.dispatchEvent(new CustomEvent("aiPlanGenerated"));
    } catch (err) {
      const message =
        err instanceof SyntaxError
          ? "AI returned an invalid plan format. Please try again."
          : err.message || "Failed to generate plan.";
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAllTasks = async () => {
    const tasksToSave = subtasks.map((subtask) => ({
      title: subtask.title,
      deadline: deadline || "Not specified",
      priority: subtask.priority,
      status: "Todo",
    }));

    try {
      const result = await addMultipleTasks(tasksToSave, deadline || "Not specified");
      if (result.added > 0) {
        toast.success(
          `Saved ${result.added} task${result.added > 1 ? "s" : ""} to your task list${result.skipped > 0 ? ` (${result.skipped} duplicate${result.skipped > 1 ? "s" : ""} skipped)` : ""}.`
        );
      } else {
        toast.info("No new tasks added (all duplicates).");
      }
    } catch (error) {
      toast.error("Failed to save tasks. Please try again.");
      console.error(error);
    }
  };

  const totalHours = subtasks.reduce((sum, item) => sum + item.hours, 0);
  const highPriorityCount = subtasks.filter((item) => item.priority === "High").length;

  return (
    <div className="space-y-6">
      {/* Input form */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <HiOutlineSparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Task Planner</h2>
              <p className="text-sm text-slate-500">
                Powered by Gemini — break any goal into actionable subtasks
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <label htmlFor="task-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Task name
              </label>
              <input
                id="task-name"
                type="text"
                placeholder="e.g. Build hackathon demo presentation"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              />
            </div>
            <div className="lg:col-span-3">
              <label htmlFor="deadline" className="mb-1.5 block text-sm font-medium text-slate-700">
                Deadline
              </label>
              <div className="relative">
                <HiOutlineCalendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <label htmlFor="hours" className="mb-1.5 block text-sm font-medium text-slate-700">
                Available hours
              </label>
              <div className="relative">
                <HiOutlineClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="hours"
                  type="number"
                  min="1"
                  placeholder="8"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generatePlan}
            disabled={loading || !task.trim()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating plan...
              </>
            ) : (
              <>
                <HiOutlineSparkles className="h-4 w-4" />
                Generate Plan
              </>
            )}
          </button>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <section className="rounded-2xl border border-indigo-100 bg-white px-6 py-16 shadow-sm">
          <LoadingSpinner size="lg" label="Gemini is building your plan..." />
          <p className="mt-4 text-center text-sm text-slate-400">
            Analyzing task scope, deadline, and available hours
          </p>
        </section>
      )}

      {/* Results */}
      {!loading && subtasks.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Your AI plan
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{planTask}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-xs text-slate-500">Subtasks</p>
                <p className="text-lg font-bold text-slate-900">{subtasks.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-xs text-slate-500">Total hours</p>
                <p className="text-lg font-bold text-slate-900">{totalHours}h</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-xs text-slate-500">High priority</p>
                <p className="text-lg font-bold text-rose-600">{highPriorityCount}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={saveAllTasks}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <HiOutlineCheckCircle className="h-4 w-4" />
            Save All Tasks
          </button>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subtasks.map((item, index) => (
              <SubtaskCard
                key={item.id}
                index={index + 1}
                title={item.title}
                hours={item.hours}
                priority={item.priority}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && subtasks.length === 0 && !error && (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <HiOutlineClipboardList className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No plan generated yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Enter a task, deadline, and available hours above, then click Generate Plan to get an
            AI-powered breakdown.
          </p>
        </section>
      )}
    </div>
  );
}
