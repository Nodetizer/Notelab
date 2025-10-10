import React, { useState } from "react";
import type { KeyboardEvent } from "react";
import "./incoming.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Incoming: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  const handleAddTask = () => {
    setCreatingTask(true);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTaskText.trim(), completed: false },
      ]);
      setNewTaskText("");
      setCreatingTask(false);
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const activeTasksCount = tasks.filter((task) => !task.completed).length;

  const getTaskLabel = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) return "активная задача";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
      return "активные задачи";
    return "активных задач";
  };

  return (
    <div className="incoming-page">
      <div className="incoming-header">
        <div>
          <h1>Входящие</h1>
          <div className="task-counter">
            {activeTasksCount} {getTaskLabel(activeTasksCount)}
          </div>
        </div>
        <button className="add-task-btn" onClick={handleAddTask}>
          + Добавить задачу
        </button>
      </div>

      <div className="incoming-content">
        {creatingTask && (
          <div className="task-item">
            <input
              type="text"
              className="task-input"
              autoFocus
              placeholder="Введите название задачи..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        )}

        {tasks.length === 0 && !creatingTask && (
          <p className="empty-text">Пока задач нет</p>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span
              className={task.completed ? "task-text completed" : "task-text"}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Incoming;
