import React, { useState, useEffect } from "react";
import { Button, Space, Typography, Divider, List, Empty, message } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useTasks } from "../../hooks/UseTasks";
import TaskCounter from "../../components/UI/TaskCounter/TaskCounter";
import TaskCreateForm from "../../components/Tasks/TaskCreateForm/TaskCreateForm";
import TaskItem from "../../components/Tasks/TaskItem/TaskItem";
import type { Task } from "../../types/TaskTypes";
import dayjs from "dayjs";
import "./Incoming.css";

const { Title } = Typography;

const Incoming: React.FC = () => {
  const { tasks, createTask, deleteTask, toggleTaskCompletion } = useTasks();

  const [creatingTask, setCreatingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>();
  const [newTaskComplexity, setNewTaskComplexity] =
    useState<Task["complexity"]>();
  const [newTaskDate, setNewTaskDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState<Task["priority"]>();
  const [editingComplexity, setEditingComplexity] =
    useState<Task["complexity"]>();
  const [editingTaskDate, setEditingTaskDate] = useState<dayjs.Dayjs | null>(
    null
  );

  // Обработчики клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedTaskId !== null) {
        e.preventDefault();
        handleDeleteTask(selectedTaskId);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId]);

  const handleCreateTask = () => {
    if (newTaskText.trim() === "") {
      message.warning("Введите текст задачи");
      return;
    }

    createTask({
      text: newTaskText.trim(),
      priority: newTaskPriority,
      complexity: newTaskComplexity,
      taskDate: newTaskDate ? newTaskDate.toISOString() : undefined,
    });

    setNewTaskText("");
    setNewTaskPriority(undefined);
    setNewTaskComplexity(undefined);
    setNewTaskDate(null);
    setCreatingTask(false);
  };

  const handleDoubleClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
    setEditingPriority(task.priority);
    setEditingComplexity(task.complexity);
    setEditingTaskDate(task.taskDate ? dayjs(task.taskDate) : null);
  };

  const handleSaveEditing = () => {
    if (editingText.trim() === "") {
      message.warning("Текст задачи не может быть пустым");
      return;
    }

    // TODO: Добавить логику сохранения редактирования через хук
    // Например: updateTask(editingTaskId, { text: editingText.trim(), ... })

    setEditingTaskId(null);
    message.success("Задача обновлена");
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="incoming-content">
      <div className="incoming-header">
        <div className="incoming-title-section">
          <Title level={2} className="incoming-title">
            Входящие
          </Title>
          <TaskCounter count={activeTasksCount} />
        </div>

        <Space className="incoming-actions">
          <Button icon={<FilterOutlined />} className="filter-btn">
            Фильтр
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreatingTask(true)}
            className="new-task-btn"
          >
            Новая задача
          </Button>
        </Space>
      </div>

      <Divider className="incoming-divider" />

      {creatingTask && (
        <TaskCreateForm
          newTaskText={newTaskText}
          newTaskPriority={newTaskPriority}
          newTaskComplexity={newTaskComplexity}
          newTaskDate={newTaskDate}
          onTextChange={setNewTaskText}
          onPriorityChange={setNewTaskPriority}
          onComplexityChange={setNewTaskComplexity}
          onDateChange={setNewTaskDate}
          onCreate={handleCreateTask}
          onCancel={() => setCreatingTask(false)}
        />
      )}

      <List
        locale={{
          emptyText: (
            <Empty
              description="Пока задач нет"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        dataSource={tasks}
        renderItem={(task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedTaskId === task.id}
            isEditing={editingTaskId === task.id}
            editingText={editingText}
            editingPriority={editingPriority}
            editingComplexity={editingComplexity}
            editingTaskDate={editingTaskDate}
            onSelect={setSelectedTaskId}
            onDoubleClick={handleDoubleClick}
            onToggleCompletion={toggleTaskCompletion}
            onEditTextChange={setEditingText}
            onEditPriorityChange={setEditingPriority}
            onEditComplexityChange={setEditingComplexity}
            onEditDateChange={setEditingTaskDate}
            onSaveEdit={handleSaveEditing}
            onCancelEdit={() => setEditingTaskId(null)}
            onDelete={handleDeleteTask}
          />
        )}
      />
    </div>
  );
};

export default Incoming;
