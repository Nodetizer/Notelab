import React from "react";
import "./AddTaskButton.css";

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <button className="add-task-btn" onClick={onClick}>
      + Добавить задачу
    </button>
  );
};

export default AddTaskButton;
