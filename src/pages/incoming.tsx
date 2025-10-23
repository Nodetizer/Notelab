import React, { useState } from "react";
import "./incoming.css";
import TaskCounter from "../components/Pages/taskCounter";
import FilterIcon from "../assets/icons/Filter.svg";

interface Task {
  id: number;
  completed: boolean;
}

const Incoming: React.FC = () => {
  const [tasks] = useState<Task[]>([]);
  const [creatingTask, setCreatingTask] = useState(false);

  const handleAddTask = () => setCreatingTask(true);

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="incoming-page">
      <div className="incoming-header">
        <div className="incoming-title">
          <h1>Входящие</h1>
          <TaskCounter count={activeTasksCount} />
        </div>

        <div className="incoming-buttons">
          <button className="filter-btn">
            <img src={FilterIcon} alt="Filter" className="filter-icon" />
            <span>Фильтр</span>
          </button>

          <button className="new-task-btn" onClick={handleAddTask}>
            <span className="new-task-plus">+</span>
            <span>Новая задача</span>
          </button>
        </div>
      </div>

      <div className="incoming-content">
        {tasks.length === 0 && !creatingTask && (
          <p className="empty-text">Пока задач нет</p>
        )}
      </div>
    </div>
  );
};

export default Incoming;
