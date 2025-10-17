import React, { useState, useRef } from "react";
import "./incoming.css";
import TaskCounter from "../components/Pages/taskCounter";
import TaskItem from "../components/Pages/TaskItem";
import FilterIcon from "../assets/icons/Filter.svg";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "Срочно" | "Высокое" | "Среднее" | "Низкое";
  dueDate?: Date;
}

const Incoming: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task["priority"]>("Среднее");
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>(undefined);
  const [creatingTask, setCreatingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] =
    useState<Task["priority"]>("Среднее");
  const [editingDate, setEditingDate] = useState<Date | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddTask = () => setCreatingTask(true);

  const createTask = () => {
    if (newTaskText.trim() === "") return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false,
        priority: newTaskPriority,
        dueDate: newTaskDate,
      },
    ]);
    setNewTaskText("");
    setNewTaskPriority("Среднее");
    setNewTaskDate(undefined);
    setCreatingTask(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") createTask();
    else if (e.key === "Escape") {
      setCreatingTask(false);
      setNewTaskText("");
      setNewTaskPriority("Среднее");
      setNewTaskDate(undefined);
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (
    taskId: number,
    currentText: string,
    currentPriority: Task["priority"],
    currentDate?: Date
  ) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
    setEditingPriority(currentPriority);
    setEditingDate(currentDate);
  };

  const saveEditing = () => {
    if (editingTaskId !== null && editingText.trim() !== "") {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                text: editingText,
                priority: editingPriority,
                dueDate: editingDate,
              }
            : task
        )
      );
      cancelEditing();
    } else {
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText("");
    setEditingPriority("Среднее");
    setEditingDate(undefined);
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
            <select
              className="priority-select"
              value={newTaskPriority}
              onChange={(e) =>
                setNewTaskPriority(e.target.value as Task["priority"])
              }
            >
              <option value="Срочно">Срочно</option>
              <option value="Высокое">Высокое</option>
              <option value="Среднее">Среднее</option>
              <option value="Низкое">Низкое</option>
            </select>
          </div>
        )}

        {tasks.length === 0 && !creatingTask && (
          <p className="empty-text">Пока задач нет</p>
        )}

        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            editingText={editingText}
            editingPriority={editingPriority}
            editingDate={editingDate}
            onEditingChange={setEditingText}
            onEditingPriorityChange={setEditingPriority}
            onEditingDateChange={setEditingDate}
            onToggleComplete={toggleTaskCompletion}
            onStartEditing={startEditing}
            onSaveEditing={saveEditing}
            onCancelEditing={cancelEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default Incoming;
