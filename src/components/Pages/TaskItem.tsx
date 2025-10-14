import React, { useRef, useEffect } from "react";
import "./TaskItem.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  selected: boolean;
  isEditing: boolean;
  editingText: string;
  onSelect: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onStartEditing: (id: number, text: string) => void;
  onEditingChange: (value: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  selected,
  isEditing,
  editingText,
  onSelect,
  onToggleComplete,
  onStartEditing,
  onEditingChange,
  onSaveEditing,
  onCancelEditing,
}) => {
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSaveEditing();
    } else if (e.key === "Escape") {
      onCancelEditing();
    }
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={`task-item ${selected ? "selected" : ""}`}
      onClick={() => onSelect(task.id)}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
      />
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          className="task-input editing"
          value={editingText}
          onChange={(e) => onEditingChange(e.target.value)}
          onKeyDown={handleEditKey}
          onBlur={onSaveEditing}
        />
      ) : (
        <span
          className={task.completed ? "task-text completed" : "task-text"}
          onDoubleClick={() => onStartEditing(task.id, task.text)}
        >
          {task.text}
        </span>
      )}
    </div>
  );
};

export default TaskItem;
