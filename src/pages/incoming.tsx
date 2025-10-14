import React, { useState, useEffect, useRef } from "react";
import "./incoming.css";
import TaskCounter from "../components/Pages/taskCounter";
import AddTaskButton from "../components/Pages/AddTaskButton";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Incoming: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddTask = () => {
    setCreatingTask(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), text: newTaskText.trim(), completed: false },
      ]);
      setNewTaskText("");
      setCreatingTask(false);
    }

    if (e.key === "Escape") {
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

  // Удаление задачи при нажатии Delete
  useEffect(() => {
    const handleDeleteKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedTaskId !== null) {
        setTasks((prev) => prev.filter((t) => t.id !== selectedTaskId));
        setSelectedTaskId(null);
      }
    };

    document.addEventListener("keydown", handleDeleteKey);
    return () => document.removeEventListener("keydown", handleDeleteKey);
  }, [selectedTaskId]);

  // Клик вне поля — отмена пустой задачи
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        creatingTask &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        if (newTaskText.trim() === "") {
          setCreatingTask(false);
          setNewTaskText("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [creatingTask, newTaskText]);

  // Редактирование задачи
  const startEditing = (taskId: number, currentText: string) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const saveEditing = () => {
    if (editingTaskId !== null && editingText.trim() !== "") {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId ? { ...task, text: editingText } : task
        )
      );
      setEditingTaskId(null);
      setEditingText("");
    } else {
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="incoming-page">
      <div className="incoming-header">
        <div>
          <h1>Входящие</h1>
          <TaskCounter count={activeTasksCount} />
        </div>
        <AddTaskButton onClick={handleAddTask} />
      </div>

      <div className="incoming-content">
        {creatingTask && (
          <div className="task-item">
            <input
              ref={inputRef}
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
          <div
            key={task.id}
            className={`task-item ${
              selectedTaskId === task.id ? "selected" : ""
            }`}
            onClick={() => setSelectedTaskId(task.id)}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {editingTaskId === task.id ? (
              <input
                ref={editInputRef}
                type="text"
                className="task-input editing"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={handleEditKey}
                onBlur={saveEditing}
                autoFocus
              />
            ) : (
              <span
                className={task.completed ? "task-text completed" : "task-text"}
                onDoubleClick={() => startEditing(task.id, task.text)}
              >
                {task.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Incoming;
