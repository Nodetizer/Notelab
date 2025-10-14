import React, { useState, useEffect, useRef } from "react";
import "./incoming.css";
import TaskCounter from "../components/Pages/taskCounter";
import AddTaskButton from "../components/Pages/AddTaskButton";
import TaskItem from "../components/Pages/TaskItem";

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
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleAddTask = () => setCreatingTask(true);

  const createTask = () => {
    if (newTaskText.trim() === "") return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: newTaskText.trim(), completed: false },
    ]);
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

  // Удаление задачи при Delete
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

  // Клик вне инпута и вне задач
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Клик вне инпута создания задачи
      if (
        creatingTask &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        if (newTaskText.trim() !== "") {
          createTask();
        } else {
          setCreatingTask(false);
          setNewTaskText("");
        }
      }

      // Клик вне списка задач — снимаем выделение
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setSelectedTaskId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [creatingTask, newTaskText]);

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

      <div className="incoming-content" ref={contentRef}>
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
          <TaskItem
            key={task.id}
            task={task}
            selected={selectedTaskId === task.id}
            isEditing={editingTaskId === task.id}
            editingText={editingText}
            onSelect={setSelectedTaskId}
            onToggleComplete={toggleTaskCompletion}
            onStartEditing={startEditing}
            onEditingChange={setEditingText}
            onSaveEditing={saveEditing}
            onCancelEditing={cancelEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default Incoming;
