import { createContext, useContext, useState } from "react";

const TaskContext = createContext(null);

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Build TaskPilot dashboard UI",
    deadline: "2026-06-25",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Wire up React Router pages",
    deadline: "2026-06-24",
    priority: "Medium",
    status: "Done",
  },
  {
    id: 3,
    title: "Design Rescue Mode flow",
    deadline: "2026-06-26",
    priority: "High",
    status: "Todo",
  },
  {
    id: 4,
    title: "Prepare hackathon demo script",
    deadline: "2026-06-27",
    priority: "Low",
    status: "Todo",
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addTask = ({ title, deadline, priority, status }) => {
    setTasks((prev) => [
      {
        id: Date.now(),
        title,
        deadline: deadline || "",
        priority: priority || "Medium",
        status: status || "Todo",
      },
      ...prev,
    ]);
  };

  const markComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: "Done" } : task)),
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id, status) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  const isDuplicate = (title, deadline) => {
    return tasks.some(
      (task) =>
        task.title.toLowerCase().trim() === title.toLowerCase().trim() &&
        task.deadline === deadline
    );
  };

  const addMultipleTasks = (taskArray, baseDeadline = "") => {
    const newTasks = taskArray
      .filter((task) => !isDuplicate(task.title, baseDeadline))
      .map((task) => ({
        id: Date.now() + Math.random(),
        title: task.title,
        deadline: task.deadline || baseDeadline,
        priority: task.priority || "Medium",
        status: task.status || "Todo",
      }));

    if (newTasks.length > 0) {
      setTasks((prev) => [...newTasks, ...prev]);
    }

    return { added: newTasks.length, skipped: taskArray.length - newTasks.length };
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, addMultipleTasks, markComplete, deleteTask, updateTaskStatus }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
}
