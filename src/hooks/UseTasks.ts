import { useState, useEffect, useCallback } from "react";
import { Task, HistoryAction } from "../types/taskTypes";
import { loadTasksFromStorage, saveTasksToStorage } from "../utils/taskUtils";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Вся логика работы с задачами и историей...
};
