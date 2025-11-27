import type { Task } from "../types/TaskTypes";
import dayjs from "dayjs";

export const getPriorityColor = (priority?: Task["priority"]) => {
  switch (priority) {
    case "Срочно":
      return "red";
    case "Высокий":
      return "orange";
    case "Средний":
      return "blue";
    case "Низкий":
      return "default";
    default:
      return "default";
  }
};

export const getComplexityColor = (complexity?: Task["complexity"]) => {
  switch (complexity) {
    case "Высокая":
      return "volcano";
    case "Средняя":
      return "gold";
    case "Низкая":
      return "green";
    default:
      return "default";
  }
};

// Создаем интерфейс для данных из localStorage
interface StoredTask {
  id: number;
  text: string;
  completed: boolean;
  priority?: string;
  complexity?: string;
  taskDate?: string;
}

export const loadTasksFromStorage = (): Task[] => {
  const savedTasks = localStorage.getItem("incoming-tasks");
  if (savedTasks) {
    const parsedTasks: StoredTask[] = JSON.parse(savedTasks);
    return parsedTasks.map((task) => ({
      ...task,
      priority: task.priority as Task["priority"],
      complexity: task.complexity as Task["complexity"],
      taskDate: task.taskDate,
    }));
  }
  return [];
};

export const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem("incoming-tasks", JSON.stringify(tasks));
};

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("DD.MM.YYYY");
};
