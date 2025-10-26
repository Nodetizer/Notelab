import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Input,
  Button,
  Checkbox,
  List,
  Tag,
  Select,
  Space,
  Typography,
  message,
  Empty,
  Popconfirm,
  Divider,
  DatePicker,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import TaskCounter from "../components/Pages/taskCounter";
import "./incoming.css";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "Срочно" | "Высокий" | "Средний" | "Низкий";
  complexity: "Высокая" | "Средняя" | "Низкая";
  createdAt: string; // Дата создания
  dueDate?: string; // Дедлайн (опционально)
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
    }
  | {
      type: "PRIORITY";
      taskId: number;
      oldPriority: Task["priority"];
      newPriority: Task["priority"];
    }
  | {
      type: "COMPLEXITY";
      taskId: number;
      oldComplexity: Task["complexity"];
      newComplexity: Task["complexity"];
    }
  | {
      type: "DUEDATE";
      taskId: number;
      oldDueDate?: string;
      newDueDate?: string;
    };

const Incoming: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("incoming-tasks");
    if (savedTasks) {
      const parsedTasks: Array<{
        id: number;
        text: string;
        completed: boolean;
        priority?: string;
        complexity?: string;
        createdAt?: string;
        dueDate?: string;
      }> = JSON.parse(savedTasks);
      return parsedTasks.map((task) => ({
        ...task,
        priority: (task.priority as Task["priority"]) || "Средний",
        complexity: (task.complexity as Task["complexity"]) || "Средняя",
        createdAt: task.createdAt || new Date().toISOString(),
        dueDate: task.dueDate,
      }));
    }
    return [];
  });

  const [creatingTask, setCreatingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task["priority"]>("Средний");
  const [newTaskComplexity, setNewTaskComplexity] =
    useState<Task["complexity"]>("Средняя");
  const [newTaskDueDate, setNewTaskDueDate] = useState<dayjs.Dayjs | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] =
    useState<Task["priority"]>("Средний");
  const [editingComplexity, setEditingComplexity] =
    useState<Task["complexity"]>("Средняя");
  const [editingDueDate, setEditingDueDate] = useState<dayjs.Dayjs | null>(
    null
  );

  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    localStorage.setItem("incoming-tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      switch (action.type) {
        case "CREATE":
          setTasks((prev) => prev.filter((task) => task.id !== action.task.id));
          break;
        case "DELETE":
          setTasks((prev) => [...prev, action.task]);
          break;
        case "EDIT":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, text: action.oldText }
                : task
            )
          );
          break;
        case "TOGGLE":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, completed: action.oldCompleted }
                : task
            )
          );
          break;
        case "PRIORITY":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, priority: action.oldPriority }
                : task
            )
          );
          break;
        case "COMPLEXITY":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, complexity: action.oldComplexity }
                : task
            )
          );
          break;
        case "DUEDATE":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, dueDate: action.oldDueDate }
                : task
            )
          );
          break;
      }
      setHistoryIndex((prev) => prev - 1);
      message.success("Действие отменено");
    }
  }, [history, historyIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedTaskId !== null) {
        e.preventDefault();
        deleteTask(selectedTaskId);
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId, undo]);

  const createTask = () => {
    if (newTaskText.trim() === "") {
      message.warning("Введите текст задачи");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      complexity: newTaskComplexity,
      createdAt: new Date().toISOString(),
      dueDate: newTaskDueDate ? newTaskDueDate.toISOString() : undefined,
    };

    pushToHistory({ type: "CREATE", task: newTask });
    setTasks((prev) => [...prev, newTask]);
    setNewTaskText("");
    setNewTaskPriority("Средний");
    setNewTaskComplexity("Средняя");
    setNewTaskDueDate(null);
    setCreatingTask(false);
    message.success("Задача добавлена");
  };

  const toggleTaskCompletion = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

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

  const handleDoubleClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
    setEditingPriority(task.priority);
    setEditingComplexity(task.complexity);
    setEditingDueDate(task.dueDate ? dayjs(task.dueDate) : null);
  };

  const saveEditing = (id: number) => {
    if (editingText.trim() === "") {
      message.warning("Текст задачи не может быть пустым");
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.text !== editingText.trim()) {
      pushToHistory({
        type: "EDIT",
        taskId: id,
        oldText: task.text,
        newText: editingText.trim(),
      });
    }

    if (task.priority !== editingPriority) {
      pushToHistory({
        type: "PRIORITY",
        taskId: id,
        oldPriority: task.priority,
        newPriority: editingPriority,
      });
    }

    if (task.complexity !== editingComplexity) {
      pushToHistory({
        type: "COMPLEXITY",
        taskId: id,
        oldComplexity: task.complexity,
        newComplexity: editingComplexity,
      });
    }

    const newDueDate = editingDueDate
      ? editingDueDate.toISOString()
      : undefined;
    if (task.dueDate !== newDueDate) {
      pushToHistory({
        type: "DUEDATE",
        taskId: id,
        oldDueDate: task.dueDate,
        newDueDate: newDueDate,
      });
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text: editingText.trim(),
              priority: editingPriority,
              complexity: editingComplexity,
              dueDate: newDueDate,
            }
          : task
      )
    );
    setEditingTaskId(null);
    message.success("Задача обновлена");
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) return;

    pushToHistory({ type: "DELETE", task: taskToDelete });
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
    message.success("Задача удалена");
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "Срочно":
        return "red";
      case "Высокий":
        return "orange";
      case "Средний":
        return "blue";
      case "Низкий":
        return "default";
      default:
        return "default";
    }
  };

  const getComplexityColor = (complexity: Task["complexity"]) => {
    switch (complexity) {
      case "Высокая":
        return "volcano";
      case "Средняя":
        return "gold";
      case "Низкая":
        return "green";
      default:
        return "default";
    }
  };

  const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;

    const now = dayjs();
    const due = dayjs(dueDate);
    const diffDays = due.diff(now, "day");

    if (due.isBefore(now, "day")) return "overdue";
    if (diffDays <= 1) return "urgent";
    if (diffDays <= 3) return "soon";
    return "normal";
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD.MM.YYYY");
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="incoming-page">
      <Card className="incoming-card">
        {/* Header */}
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
            <Button
              icon={<UndoOutlined />}
              onClick={undo}
              disabled={historyIndex < 0}
              className="undo-btn"
            >
              Отменить
            </Button>
          </Space>
        </div>

        <Divider className="incoming-divider" />

        {/* Creating Task */}
        {creatingTask && (
          <Card className="creating-task-card">
            <Space className="creating-task-content" direction="vertical">
              <Input
                placeholder="Введите название задачи..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onPressEnter={createTask}
                onKeyDown={(e) => e.key === "Escape" && setCreatingTask(false)}
                autoFocus
                className="creating-task-input"
              />
              <Space wrap>
                <Select
                  value={newTaskPriority}
                  onChange={setNewTaskPriority}
                  className="priority-select"
                >
                  <Option value="Срочно">Срочно</Option>
                  <Option value="Высокий">Высокий</Option>
                  <Option value="Средний">Средний</Option>
                  <Option value="Низкий">Низкий</Option>
                </Select>
                <Select
                  value={newTaskComplexity}
                  onChange={setNewTaskComplexity}
                  className="complexity-select"
                >
                  <Option value="Высокая">Высокая</Option>
                  <Option value="Средняя">Средняя</Option>
                  <Option value="Низкая">Низкая</Option>
                </Select>
                <DatePicker
                  placeholder="Дедлайн"
                  value={newTaskDueDate}
                  onChange={setNewTaskDueDate}
                  className="due-date-picker"
                  format="DD.MM.YYYY"
                />
                <Button
                  type="primary"
                  onClick={createTask}
                  icon={<SaveOutlined />}
                >
                  Сохранить
                </Button>
                <Button
                  onClick={() => setCreatingTask(false)}
                  icon={<CloseOutlined />}
                >
                  Отмена
                </Button>
              </Space>
            </Space>
          </Card>
        )}

        {/* Tasks List */}
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
            <List.Item
              className={`task-item ${
                selectedTaskId === task.id ? "task-item-selected" : ""
              }`}
              onClick={() =>
                setSelectedTaskId(task.id === selectedTaskId ? null : task.id)
              }
              onDoubleClick={() => handleDoubleClick(task)}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => handleDoubleClick(task)}
                  className="edit-icon"
                />,
                <Popconfirm
                  title="Удалить задачу?"
                  onConfirm={() => deleteTask(task.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <DeleteOutlined key="delete" className="delete-icon" />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="task-checkbox"
                  />
                }
                title={
                  editingTaskId === task.id ? (
                    <Space
                      direction="vertical"
                      className="editing-task-content"
                    >
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onPressEnter={() => saveEditing(task.id)}
                        onKeyDown={(e) =>
                          e.key === "Escape" && setEditingTaskId(null)
                        }
                        onBlur={() => saveEditing(task.id)}
                        autoFocus
                        className="editing-task-input"
                      />
                      <Space wrap>
                        <Select
                          value={editingPriority}
                          onChange={setEditingPriority}
                          className="priority-select"
                        >
                          <Option value="Срочно">Срочно</Option>
                          <Option value="Высокий">Высокий</Option>
                          <Option value="Средний">Средний</Option>
                          <Option value="Низкий">Низкий</Option>
                        </Select>
                        <Select
                          value={editingComplexity}
                          onChange={setEditingComplexity}
                          className="complexity-select"
                        >
                          <Option value="Высокая">Высокая</Option>
                          <Option value="Средняя">Средняя</Option>
                          <Option value="Низкая">Низкая</Option>
                        </Select>
                        <DatePicker
                          placeholder="Дедлайн"
                          value={editingDueDate}
                          onChange={setEditingDueDate}
                          className="due-date-picker"
                          format="DD.MM.YYYY"
                        />
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => saveEditing(task.id)}
                          icon={<SaveOutlined />}
                        >
                          Сохранить
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <div className="task-content">
                      <span
                        className={`task-text ${
                          task.completed ? "task-text-completed" : ""
                        }`}
                      >
                        {task.text}
                      </span>
                      <div className="task-meta">
                        <div className="task-tags">
                          <Tag
                            color={getPriorityColor(task.priority)}
                            className="priority-tag"
                          >
                            {task.priority}
                          </Tag>
                          <Tag
                            color={getComplexityColor(task.complexity)}
                            className="complexity-tag"
                          >
                            {task.complexity}
                          </Tag>
                        </div>
                        <div className="task-dates">
                          <span className="created-date">
                            <CalendarOutlined /> {formatDate(task.createdAt)}
                          </span>
                          {task.dueDate && (
                            <span
                              className={`due-date due-date-${getDueDateStatus(
                                task.dueDate
                              )}`}
                            >
                              <ClockCircleOutlined /> {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Incoming;
