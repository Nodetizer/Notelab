import React, { useState, useEffect, useCallback } from "react";
import "./incoming.css";
import TaskCounter from "../components/Pages/taskCounter";
import FilterIcon from "../assets/icons/Filter.svg";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type HistoryAction =
  | { type: "CREATE"; task: Task }
  | { type: "DELETE"; task: Task }
  | { type: "EDIT"; taskId: number; oldText: string; newText: string }
  | {
      type: "TOGGLE";
      taskId: number;
      oldCompleted: boolean;
      newCompleted: boolean;
    };

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

  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    localStorage.setItem("incoming-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Сохраняем действие в историю
  const pushToHistory = useCallback(
    (action: HistoryAction) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(action);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Отмена действия
  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];

      switch (action.type) {
        case "CREATE":
          // Отмена создания - удаляем задачу
          setTasks((prev) => prev.filter((task) => task.id !== action.task.id));
          break;
        case "DELETE":
          // Отмена удаления - восстанавливаем задачу
          setTasks((prev) => [...prev, action.task]);
          break;
        case "EDIT":
          // Отмена редактирования - восстанавливаем старый текст
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, text: action.oldText }
                : task
            )
          );
          break;
        case "TOGGLE":
          // Отмена переключения - восстанавливаем старый статус
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, completed: action.oldCompleted }
                : task
            )
          );
          break;
      }

      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex]);

  // Обработчик нажатия клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Удаление выбранной задачи по Delete
      if (e.key === "Delete" && selectedTaskId !== null) {
        e.preventDefault();
        deleteTask(selectedTaskId);
      }

      // Отмена действия по Ctrl+Z
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTaskId, undo]);

  const handleAddTask = () => setCreatingTask(true);

  const createTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };

    // Сохраняем в историю
    pushToHistory({
      type: "CREATE",
      task: newTask,
    });

    setTasks((prev) => [...prev, newTask]);
    setNewTaskText("");
    setCreatingTask(false);
  };

  const cancelCreateTask = () => {
    setCreatingTask(false);
    setNewTaskText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTask();
    } else if (e.key === "Escape") {
      cancelCreateTask();
    }
  };

  const toggleTaskCompletion = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Сохраняем в историю ДО изменения
    pushToHistory({
      type: "TOGGLE",
      taskId: id,
      oldCompleted: task.completed,
      newCompleted: !task.completed,
    });

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

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Сохраняем в историю ДО изменения
    pushToHistory({
      type: "EDIT",
      taskId: id,
      oldText: task.text,
      newText: editingText.trim(),
    });

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
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) return;

    // Сохраняем в историю ДО удаления
    pushToHistory({
      type: "DELETE",
      task: taskToDelete,
    });

    setTasks((prev) => prev.filter((task) => task.id !== id));

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
