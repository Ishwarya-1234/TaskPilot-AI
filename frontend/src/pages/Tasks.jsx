import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineDownload, HiOutlinePrinter, HiOutlineInbox } from "react-icons/hi";
import TaskCard from "../components/TaskCard";
import NumberAnimation from "../components/NumberAnimation";
import { useTasks } from "../context/TaskContext";

export default function Tasks() {
  const { tasks, addTask, markComplete, deleteTask, updateTaskStatus } = useTasks();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addTask({ title: title.trim(), deadline, priority, status });
      toast.success("Task added successfully!");
      setTitle("");
      setDeadline("");
      setPriority("Medium");
      setStatus("Todo");
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCSV = () => {
    if (tasks.length === 0) {
      toast.error("No tasks to export");
      return;
    }

    const headers = ["ID", "Title", "Deadline", "Priority", "Status", "Created At"];
    const rows = tasks.map((task) => [
      task.id,
      task.title,
      task.deadline,
      task.priority,
      task.status,
      task.created_at,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tasks_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tasks exported to CSV");
  };

  const printTasks = () => {
    if (tasks.length === 0) {
      toast.error("No tasks to print");
      return;
    }
    window.print();
  };

  const pending = tasks.filter((t) => t.status !== "Done").length;
  const completed = tasks.filter((t) => t.status === "Done").length;
  const total = tasks.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900"><NumberAnimation value={total} /></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600"><NumberAnimation value={pending} /></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-emerald-600"><NumberAnimation value={completed} /></p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Add Task</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Task title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="flex items-end lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Adding...
                </>
              ) : (
                <>
                  <HiOutlinePlus className="h-4 w-4" />
                  Add Task
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Your Tasks</h2>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <HiOutlineDownload className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={printTasks}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <HiOutlinePrinter className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <HiOutlineInbox className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">No tasks yet</h3>
            <p className="mt-2 text-sm text-slate-500">Create your first task above to get started with TaskPilot AI.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={markComplete}
              onDelete={deleteTask}
              onStatusChange={updateTaskStatus}
            />
          ))
        )}
      </section>
    </div>
  );
}
