import React, { useState, useEffect } from "react";
import "./incoming.css";
import TaskCounter from "../components/Pages/taskCounter";
import FilterIcon from "../assets/icons/Filter.svg";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Incoming: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("incoming-tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  const [creatingTask, setCreatingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("incoming-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Обработчик нажатия клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Удаление выбранной задачи по Delete
      if (e.key === "Delete" && selectedTaskId !== null) {
        e.preventDefault();
        deleteTask(selectedTaskId);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTaskId]);

  const handleAddTask = () => setCreatingTask(true);

  const createTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskText("");
    setCreatingTask(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTask();
    } else if (e.key === "Escape") {
      setCreatingTask(false);
      setNewTaskText("");
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskClick = (id: number) => {
    setSelectedTaskId(id === selectedTaskId ? null : id);
  };

  const handleDoubleClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEditing = (id: number) => {
    if (editingText.trim() === "") return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleEditKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === "Enter") {
      saveEditing(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  // Функция удаления задачи
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    // Снимаем выделение если удаляем выбранную задачу
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

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
        {creatingTask && (
          <div className="task-item creating">
            <input type="checkbox" className="task-checkbox" disabled />
            <input
              type="text"
              className="task-input creating"
              autoFocus
              placeholder="Введите название задачи..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${
              selectedTaskId === task.id ? "selected" : ""
            }`}
            onClick={() => handleTaskClick(task.id)}
            onDoubleClick={() => handleDoubleClick(task)}
          >
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />

            {editingTaskId === task.id ? (
              <input
                type="text"
                className="task-input editing"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                onBlur={() => saveEditing(task.id)}
                autoFocus
              />
            ) : (
              <span
                className={`task-text ${task.completed ? "completed" : ""}`}
              >
                {task.text}
              </span>
            )}
          </div>
        ))}

        {tasks.length === 0 && !creatingTask && (
          <p className="empty-text">Пока задач нет</p>
        )}
      </div>
    </div>
  );
};

export default Incoming;
