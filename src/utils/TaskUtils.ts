import { Task } from "../types/TaskTypes";

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

export const loadTasksFromStorage = (): Task[] => {
  const savedTasks = localStorage.getItem("incoming-tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
};

export const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem("incoming-tasks", JSON.stringify(tasks));
};
