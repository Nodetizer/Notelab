export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority?: "Срочно" | "Высокий" | "Средний" | "Низкий";
  complexity?: "Высокая" | "Средняя" | "Низкая";
  taskDate?: string;
}

export type HistoryAction =
  | { type: "CREATE"; task: Task }
  | { type: "DELETE"; task: Task }
  | { type: "EDIT"; taskId: number; oldText: string; newText: string }
  | {
      type: "TOGGLE";
      taskId: number;
      oldCompleted: boolean;
      newCompleted: boolean;
    }
  | {
      type: "PRIORITY";
      taskId: number;
      oldPriority?: Task["priority"];
      newPriority?: Task["priority"];
    }
  | {
      type: "COMPLEXITY";
      taskId: number;
      oldComplexity?: Task["complexity"];
      newComplexity?: Task["complexity"];
    }
  | {
      type: "TASKDATE";
      taskId: number;
      oldTaskDate?: string;
      newTaskDate?: string;
    };
