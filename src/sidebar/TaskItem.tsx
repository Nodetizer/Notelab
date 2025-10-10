import React from "react";
import "./taskItem.css";

interface TaskItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  text,
  completed,
  onToggle,
}) => {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <span className={completed ? "task-text completed" : "task-text"}>
        {text}
      </span>
    </div>
  );
};

export default TaskItem;
