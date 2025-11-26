import React from "react";
import "./AddTaskButton.css";

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <button className="add-task-btn" onClick={onClick}>
      <span className="add-task-plus">+</span>
      <span className="add-task-text">Новая задача</span>
    </button>
  );
};

export default AddTaskButton;
