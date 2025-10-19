import React, { useRef, useEffect, useState } from "react";
import "./TaskItem.css";
import TaskDatePicker from "./TaskDatePicker";
import type { Task } from "../../pages/incoming";
import CompletedIcon from "../../assets/icons/Completed.svg";
import CompletedHoverIcon from "../../assets/icons/Completed_hover.svg";

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editingText: string;
  editingPriority: Task["priority"];
  editingDate?: Date;
  onEditingChange: (value: string) => void;
  onEditingPriorityChange: (value: Task["priority"]) => void;
  onEditingDateChange: (date: Date) => void;
  onToggleComplete: (id: number) => void;
  onStartEditing: (
    id: number,
    text: string,
    priority: Task["priority"],
    date?: Date
  ) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isEditing,
  editingText,
  editingPriority,
  editingDate,
  onEditingChange,
  onEditingPriorityChange,
  onEditingDateChange,
  onToggleComplete,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
}) => {
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSaveEditing();
    else if (e.key === "Escape") onCancelEditing();
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) editInputRef.current.focus();
  }, [isEditing]);

  return (
    <div className="task-item">
      {/* кастомный чекбокс */}
      <label
        className="custom-checkbox"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type="checkbox"
          className="custom-checkbox-input"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={task.text}
        />
        <span className="custom-checkbox-box" aria-hidden="true">
          {task.completed && (
            <img
              src={isHovered ? CompletedHoverIcon : CompletedIcon}
              alt="Completed"
            />
          )}
        </span>
      </label>

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

          <TaskDatePicker
            selectedDate={editingDate}
            onDateChange={onEditingDateChange}
          />
        </div>
      ) : (
        <span
          className={task.completed ? "task-text completed" : "task-text"}
          onDoubleClick={() =>
            onStartEditing(task.id, task.text, task.priority, task.dueDate)
          }
        >
          {task.text}{" "}
          <span className={`priority-label ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>{" "}
          {task.dueDate && (
            <span className="task-date">
              {task.dueDate.toLocaleDateString("ru-RU")}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default TaskItem;
