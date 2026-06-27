import { createContext, useContext, useState, useEffect } from "react";
import { getTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "../services/api";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from backend on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const addTask = async ({ title, deadline, priority, status }) => {
    try {
      const newTask = await apiCreateTask({
        title,
        deadline: deadline || "Not specified",
        priority: priority || "Medium",
        status: status || "Todo",
      });
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  };

  const markComplete = async (id) => {
    try {
      const updatedTask = await apiUpdateTask(id, { status: "Done" });
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Failed to mark task complete:", error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const updatedTask = await apiUpdateTask(id, { status });
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Failed to update task status:", error);
      throw error;
    }
  };

  const isDuplicate = (title, deadline) => {
    return tasks.some(
      (task) =>
        task.title.toLowerCase().trim() === title.toLowerCase().trim() &&
        task.deadline === deadline
    );
  };

  const addMultipleTasks = async (taskArray, baseDeadline = "") => {
    const newTasks = taskArray.filter((task) => !isDuplicate(task.title, baseDeadline));
    const createdTasks = [];

    for (const task of newTasks) {
      try {
        const created = await apiCreateTask({
          title: task.title,
          deadline: task.deadline || baseDeadline || "Not specified",
          priority: task.priority || "Medium",
          status: task.status || "Todo",
        });
        createdTasks.push(created);
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    }

    if (createdTasks.length > 0) {
      setTasks((prev) => [...createdTasks, ...prev]);
    }

    return { added: createdTasks.length, skipped: taskArray.length - createdTasks.length };
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
