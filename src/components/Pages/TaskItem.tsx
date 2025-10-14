import React, { useRef, useEffect } from "react";
import "./TaskItem.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "Срочно" | "Высокое" | "Среднее" | "Низкое";
}

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editingText: string;
  editingPriority: Task["priority"];
  onEditingPriorityChange: (value: Task["priority"]) => void;
  onToggleComplete: (id: number) => void;
  onStartEditing: (
    id: number,
    text: string,
    priority: Task["priority"]
  ) => void;
  onEditingChange: (value: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isEditing,
  editingText,
  editingPriority,
  onEditingPriorityChange,
  onToggleComplete,
  onStartEditing,
  onEditingChange,
  onSaveEditing,
  onCancelEditing,
}) => {
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSaveEditing();
    else if (e.key === "Escape") onCancelEditing();
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) editInputRef.current.focus();
  }, [isEditing]);

  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
      />
      {isEditing ? (
        <div className="editing-container">
          <input
            ref={editInputRef}
            type="text"
            className="task-input editing"
            value={editingText}
            onChange={(e) => onEditingChange(e.target.value)}
            onKeyDown={handleEditKey}
          />
          <select
            className="priority-select editing-priority"
            value={editingPriority}
            onChange={(e) =>
              onEditingPriorityChange(e.target.value as Task["priority"])
            }
          >
            <option value="Срочно">Срочно</option>
            <option value="Высокое">Высокое</option>
            <option value="Среднее">Среднее</option>
            <option value="Низкое">Низкое</option>
          </select>
        </div>
      ) : (
        <span
          className={task.completed ? "task-text completed" : "task-text"}
          onDoubleClick={() =>
            onStartEditing(task.id, task.text, task.priority)
          }
        >
          {task.text}{" "}
          <span className={`priority-label ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </span>
      )}
    </div>
  );
};

export default TaskItem;
