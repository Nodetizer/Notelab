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
  Dropdown,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CalendarOutlined,
  FlagOutlined,
  BarChartOutlined,
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
  priority?: "Срочно" | "Высокий" | "Средний" | "Низкий";
  complexity?: "Высокая" | "Средняя" | "Низкая";
  taskDate?: string;
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
      oldPriority?: Task["priority"];
      newPriority?: Task["priority"];
    }
  | {
      type: "COMPLEXITY";
      taskId: number;
      oldComplexity?: Task["complexity"];
      newComplexity?: Task["complexity"];
    }
  | {
      type: "TASKDATE";
      taskId: number;
      oldTaskDate?: string;
      newTaskDate?: string;
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
        taskDate?: string;
      }> = JSON.parse(savedTasks);
      return parsedTasks.map((task) => ({
        ...task,
        priority: task.priority as Task["priority"],
        complexity: task.complexity as Task["complexity"],
        taskDate: task.taskDate,
      }));
    }
    return [];
  });

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
        case "TASKDATE":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === action.taskId
                ? { ...task, taskDate: action.oldTaskDate }
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
      taskDate: newTaskDate ? newTaskDate.toISOString() : undefined,
    };

    pushToHistory({ type: "CREATE", task: newTask });
    setTasks((prev) => [...prev, newTask]);
    setNewTaskText("");
    setNewTaskPriority(undefined);
    setNewTaskComplexity(undefined);
    setNewTaskDate(null);
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
    setEditingTaskDate(task.taskDate ? dayjs(task.taskDate) : null);
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

    const newTaskDate = editingTaskDate
      ? editingTaskDate.toISOString()
      : undefined;
    if (task.taskDate !== newTaskDate) {
      pushToHistory({
        type: "TASKDATE",
        taskId: id,
        oldTaskDate: task.taskDate,
        newTaskDate: newTaskDate,
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
              taskDate: newTaskDate,
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

  const getPriorityColor = (priority?: Task["priority"]) => {
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

  const getComplexityColor = (complexity?: Task["complexity"]) => {
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

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD.MM.YYYY");
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  // Dropdown меню для приоритета
  const priorityMenu = {
    items: [
      {
        key: "1",
        label: "Срочно",
        onClick: () => setNewTaskPriority("Срочно"),
      },
      {
        key: "2",
        label: "Высокий",
        onClick: () => setNewTaskPriority("Высокий"),
      },
      {
        key: "3",
        label: "Средний",
        onClick: () => setNewTaskPriority("Средний"),
      },
      {
        key: "4",
        label: "Низкий",
        onClick: () => setNewTaskPriority("Низкий"),
      },
      {
        key: "5",
        label: "Убрать приоритет",
        onClick: () => setNewTaskPriority(undefined),
      },
    ],
  };

  // Dropdown меню для сложности
  const complexityMenu = {
    items: [
      {
        key: "1",
        label: "Высокая",
        onClick: () => setNewTaskComplexity("Высокая"),
      },
      {
        key: "2",
        label: "Средняя",
        onClick: () => setNewTaskComplexity("Средняя"),
      },
      {
        key: "3",
        label: "Низкая",
        onClick: () => setNewTaskComplexity("Низкая"),
      },
      {
        key: "4",
        label: "Убрать сложность",
        onClick: () => setNewTaskComplexity(undefined),
      },
    ],
  };

  return (
    <div className="incoming-content">
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
        </Space>
      </div>

      <Divider className="incoming-divider" />

      {/* Creating Task */}
      {creatingTask && (
        <Card className="creating-task-card">
          <div className="creating-task-content">
            <div className="creating-task-header">
              <Checkbox className="creating-task-checkbox" />
              <Input
                placeholder="Введите название задачи"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onPressEnter={createTask}
                onKeyDown={(e) => e.key === "Escape" && setCreatingTask(false)}
                autoFocus
                className="creating-task-input"
              />
            </div>
            <div className="creating-task-meta">
              <div className="creating-task-tags">
                <Dropdown menu={priorityMenu} trigger={["click"]}>
                  <Button
                    type="text"
                    icon={<FlagOutlined />}
                    className={`creating-task-icon-btn ${
                      newTaskPriority ? "has-value" : ""
                    }`}
                  >
                    {newTaskPriority || "Приоритет"}
                  </Button>
                </Dropdown>

                <Dropdown menu={complexityMenu} trigger={["click"]}>
                  <Button
                    type="text"
                    icon={<BarChartOutlined />}
                    className={`creating-task-icon-btn ${
                      newTaskComplexity ? "has-value" : ""
                    }`}
                  >
                    {newTaskComplexity || "Сложность"}
                  </Button>
                </Dropdown>

                <DatePicker
                  placeholder="Дата задачи"
                  value={newTaskDate}
                  onChange={setNewTaskDate}
                  className="custom-task-datepicker"
                  format="DD.MM.YYYY"
                  suffixIcon={<CalendarOutlined />}
                />
              </div>
            </div>
          </div>
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
                  <Space direction="vertical" className="editing-task-content">
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
                        placeholder="Приоритет"
                      >
                        <Option value={undefined}>Без приоритета</Option>
                        <Option value="Срочно">Срочно</Option>
                        <Option value="Высокий">Высокий</Option>
                        <Option value="Средний">Средний</Option>
                        <Option value="Низкий">Низкий</Option>
                      </Select>
                      <Select
                        value={editingComplexity}
                        onChange={setEditingComplexity}
                        className="complexity-select"
                        placeholder="Сложность"
                      >
                        <Option value={undefined}>Без сложности</Option>
                        <Option value="Высокая">Высокая</Option>
                        <Option value="Средняя">Средняя</Option>
                        <Option value="Низкая">Низкая</Option>
                      </Select>
                      <DatePicker
                        placeholder="Дата задачи"
                        value={editingTaskDate}
                        onChange={setEditingTaskDate}
                        className="custom-task-datepicker"
                        format="DD.MM.YYYY"
                      />
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
                        {task.priority && (
                          <Tag
                            color={getPriorityColor(task.priority)}
                            className="priority-tag"
                          >
                            <FlagOutlined /> {task.priority}
                          </Tag>
                        )}
                        {task.complexity && (
                          <Tag
                            color={getComplexityColor(task.complexity)}
                            className="complexity-tag"
                          >
                            <BarChartOutlined /> {task.complexity}
                          </Tag>
                        )}
                      </div>
                      <div className="task-dates">
                        {task.taskDate && (
                          <span className="task-date">
                            <CalendarOutlined /> {formatDate(task.taskDate)}
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
    </div>
  );
};

export default Incoming;
