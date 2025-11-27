import { useState, useEffect, useCallback } from "react";
import type { Task, HistoryAction } from "../types/TaskTypes";
import { loadTasksFromStorage, saveTasksToStorage } from "../utils/TaskUtils";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const pushToHistory = useCallback(
    (action: HistoryAction) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(action);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      switch (action.type) {
        case "CREATE":
          setTasks((prev) => prev.filter((task) => task.id !== action.task.id));
          break;
        case "DELETE":
          setTasks((prev) => [...prev, action.task]);
          break;
        case "EDIT":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, text: action.oldText }
                : task
            )
          );
          break;
        case "TOGGLE":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, completed: action.oldCompleted }
                : task
            )
          );
          break;
        case "PRIORITY":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, priority: action.oldPriority }
                : task
            )
          );
          break;
        case "COMPLEXITY":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, complexity: action.oldComplexity }
                : task
            )
          );
          break;
        case "TASKDATE":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, taskDate: action.oldTaskDate }
                : task
            )
          );
          break;
      }
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex]);

  const createTask = useCallback(
    (taskData: {
      text: string;
      priority?: Task["priority"];
      complexity?: Task["complexity"];
      taskDate?: string;
    }) => {
      const newTask: Task = {
        id: Date.now(),
        text: taskData.text.trim(),
        completed: false,
        priority: taskData.priority,
        complexity: taskData.complexity,
        taskDate: taskData.taskDate,
      };

      pushToHistory({ type: "CREATE", task: newTask });
      setTasks((prev) => [...prev, newTask]);

      return newTask;
    },
    [pushToHistory]
  );

  const updateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback(
    (taskId: number) => {
      const taskToDelete = tasks.find((task) => task.id === taskId);
      if (!taskToDelete) return;

      pushToHistory({ type: "DELETE", task: taskToDelete });
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      return taskToDelete;
    },
    [tasks, pushToHistory]
  );

  const toggleTaskCompletion = useCallback(
    (taskId: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      pushToHistory({
        type: "TOGGLE",
        taskId,
        oldCompleted: task.completed,
        newCompleted: !task.completed,
      });

      updateTask(taskId, { completed: !task.completed });
    },
    [tasks, pushToHistory, updateTask]
  );

  // ВОТ ВАЖНАЯ ЧАСТЬ - возвращаем объект с методами и данными
  return {
    tasks,
    history,
    historyIndex,
    undo,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    pushToHistory,
  };
};
