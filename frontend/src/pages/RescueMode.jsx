import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineExclamation,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import LoadingSpinner from "../components/LoadingSpinner";
import { parseRescuePlan } from "../services/parseRescuePlan";
import { postJson } from "../services/api";
import { useTasks } from "../context/TaskContext";

export default function RescueMode() {
  const { addMultipleTasks } = useTasks();
  const [task, setTask] = useState("");
  const [hoursRemaining, setHoursRemaining] = useState("");
  const [deadline, setDeadline] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRescuePlan = async () => {
    if (!task.trim()) return;

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const data = await postJson("/rescue-plan", {
        task: task.trim(),
        hours_remaining: Number(hoursRemaining) || 1,
        deadline: deadline || "Not specified",
      });

      const parsed = parseRescuePlan(data.rescue_plan);
      setPlan({
        task: data.task ?? task.trim(),
        hoursRemaining: data.hours_remaining,
        deadline: data.deadline,
        ...parsed,
      });
      toast.success("Rescue plan created successfully!");
    } catch (err) {
      const message =
        err instanceof SyntaxError
          ? "AI returned an invalid rescue plan format. Please try again."
          : err.message?.includes("Failed to fetch")
            ? "Cannot reach the backend. Start FastAPI on port 8000 and restart the Vite dev server."
            : err.message || "Failed to generate rescue plan.";
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalActionHours = plan?.emergencyActionPlan.reduce(
    (sum, item) => sum + item.durationHours,
    0,
  );

  const totalAllocatedHours = plan?.timeAllocation.reduce((sum, item) => sum + item.hours, 0);

  const convertToTasks = () => {
    if (!plan) return;

    const tasksToSave = plan.emergencyActionPlan.map((action) => ({
      title: action.action,
      deadline: deadline || "Not specified",
      priority: "High",
      status: "Todo",
    }));

    const result = addMultipleTasks(tasksToSave, deadline || "Not specified");
    if (result.added > 0) {
      toast.success(
        `Converted ${result.added} emergency action${result.added > 1 ? "s" : ""} to task${result.added > 1 ? "s" : ""}${result.skipped > 0 ? ` (${result.skipped} duplicate${result.skipped > 1 ? "s" : ""} skipped)` : ""}.`
      );
    } else {
      toast.info("No new tasks added (all duplicates).");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 shadow-sm">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
            <HiOutlineLightningBolt className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Deadline Guardian
            </p>
            <h2 className="mt-1 text-xl font-bold text-rose-950">Emergency Rescue Mode</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-rose-800/80">
              Running out of time? Gemini will build an emergency action plan, a minimum viable
              completion strategy, and a hour-by-hour time allocation to help you ship before the
              deadline.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-semibold text-slate-900">Describe your crisis</h3>
          <p className="text-sm text-slate-500">Tell us what&apos;s due and how much time you have left.</p>
        </div>

        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <label htmlFor="rescue-task" className="mb-1.5 block text-sm font-medium text-slate-700">
                Task name
              </label>
              <input
                id="rescue-task"
                type="text"
                placeholder="e.g. Finish hackathon demo and slides"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-60"
              />
            </div>
            <div className="lg:col-span-3">
              <label htmlFor="rescue-hours" className="mb-1.5 block text-sm font-medium text-slate-700">
                Hours remaining
              </label>
              <div className="relative">
                <HiOutlineClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="rescue-hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="4"
                  value={hoursRemaining}
                  onChange={(e) => setHoursRemaining(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-60"
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <label htmlFor="rescue-deadline" className="mb-1.5 block text-sm font-medium text-slate-700">
                Deadline
              </label>
              <div className="relative">
                <HiOutlineCalendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="rescue-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-60"
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
            onClick={generateRescuePlan}
            disabled={loading || !task.trim()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-rose-700 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating rescue plan...
              </>
            ) : (
              <>
                <HiOutlineShieldCheck className="h-4 w-4" />
                Activate Deadline Guardian
              </>
            )}
          </button>
        </div>
      </section>

      {loading && (
        <section className="rounded-2xl border border-rose-100 bg-white px-6 py-16 shadow-sm">
          <LoadingSpinner size="lg" label="Deadline Guardian is analyzing your crisis..." />
          <p className="mt-4 text-center text-sm text-slate-400">
            Building emergency actions, MVP strategy, and time blocks
          </p>
        </section>
      )}

      {!loading && plan && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Rescue plan for
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{plan.task}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {plan.hoursRemaining}h remaining · Deadline: {plan.deadline}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-xs text-slate-500">Emergency steps</p>
                <p className="text-lg font-bold text-slate-900">{plan.emergencyActionPlan.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-xs text-slate-500">Action hours</p>
                <p className="text-lg font-bold text-slate-900">{totalActionHours}h</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-xs text-slate-500">Time blocks</p>
                <p className="text-lg font-bold text-slate-900">{totalAllocatedHours}h</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={convertToTasks}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <HiOutlineCheckCircle className="h-4 w-4" />
            Convert to Tasks
          </button>

          <div className="grid gap-6 xl:grid-cols-2">
            {/* Emergency action plan */}
            <section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <HiOutlineExclamation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Emergency Action Plan</h3>
                  <p className="text-sm text-slate-500">Do these steps in order, right now</p>
                </div>
              </div>
              <ol className="space-y-3">
                {plan.emergencyActionPlan.map((item) => (
                  <li
                    key={item.step}
                    className="flex gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{item.action}</p>
                      <p className="mt-1 text-sm text-rose-700">{item.durationHours}h</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Minimum viable strategy */}
            <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <HiOutlineShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Minimum Viable Strategy</h3>
                  <p className="text-sm text-slate-500">The smallest outcome that still counts as done</p>
                </div>
              </div>
              <p className="rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
                {plan.minimumViableStrategy.summary}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Must complete
                  </p>
                  <ul className="space-y-2">
                    {plan.minimumViableStrategy.mustComplete.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 text-emerald-600">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Scope to cut
                  </p>
                  <ul className="space-y-2">
                    {plan.minimumViableStrategy.scopeToCut.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 line-through decoration-slate-400"
                      >
                        <span className="mt-0.5 text-slate-400">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Time allocation */}
          <section className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <HiOutlineChartBar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Time Allocation</h3>
                <p className="text-sm text-slate-500">Hour-by-hour focus blocks until the deadline</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plan.timeAllocation.map((block) => (
                <article
                  key={block.id}
                  className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{block.block}</h4>
                    <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      {block.hours}h
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{block.activities}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {!loading && !plan && !error && (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
            <HiOutlineShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No rescue plan yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Enter your task, hours remaining, and deadline above to get an AI-powered emergency plan
            from Deadline Guardian.
          </p>
        </section>
      )}
    </div>
  );
}
