import React from "react";
import { Card, Input, Button, Dropdown, DatePicker, Space } from "antd";
import { BarChartOutlined, CalendarOutlined } from "@ant-design/icons";
import type { TaskPriority, TaskComplexity } from "../../../types/TaskTypes";
import dayjs from "dayjs";
import "./TaskCreateForm.css";

interface TaskCreateFormProps {
  newTaskText: string;
  newTaskPriority?: TaskPriority;
  newTaskComplexity?: TaskComplexity;
  newTaskDate: dayjs.Dayjs | null;
  onTextChange: (text: string) => void;
  onPriorityChange: (priority?: TaskPriority) => void;
  onComplexityChange: (complexity?: TaskComplexity) => void;
  onDateChange: (date: dayjs.Dayjs | null) => void;
  onCreate: () => void;
  onCancel: () => void;
}

const TaskCreateForm: React.FC<TaskCreateFormProps> = ({
  newTaskText,
  newTaskPriority = "Срочно", // ДЕЛАЕМ "СРОЧНО" ПО УМОЛЧАНИЮ
  newTaskComplexity,
  newTaskDate,
  onTextChange,
  onPriorityChange,
  onComplexityChange,
  onDateChange,
  onCreate,
  onCancel,
}) => {
  const priorityMenu = {
    items: [
      {
        key: "1",
        label: (
          <div className="priority-menu-item">
            <span className="priority-dot urgent"></span>
            Срочно
          </div>
        ),
        onClick: () => onPriorityChange("Срочно"),
      },
      {
        key: "2",
        label: (
          <div className="priority-menu-item">
            <span className="priority-dot high"></span>
            Высокий
          </div>
        ),
        onClick: () => onPriorityChange("Высокий"),
      },
      {
        key: "3",
        label: (
          <div className="priority-menu-item">
            <span className="priority-dot medium"></span>
            Средний
          </div>
        ),
        onClick: () => onPriorityChange("Средний"),
      },
      {
        key: "4",
        label: (
          <div className="priority-menu-item">
            <span className="priority-dot low"></span>
            Низкий
          </div>
        ),
        onClick: () => onPriorityChange("Низкий"),
      },
      {
        key: "5",
        label: "Убрать приоритет",
        onClick: () => onPriorityChange(undefined),
      },
    ],
  };

  const complexityMenu = {
    items: [
      {
        key: "1",
        label: "Высокая",
        onClick: () => onComplexityChange("Высокая"),
      },
      {
        key: "2",
        label: "Средняя",
        onClick: () => onComplexityChange("Средняя"),
      },
      {
        key: "3",
        label: "Низкая",
        onClick: () => onComplexityChange("Низкая"),
      },
      {
        key: "4",
        label: "Убрать сложность",
        onClick: () => onComplexityChange(undefined),
      },
    ],
  };

  const getPriorityDot = (priority?: TaskPriority) => {
    if (!priority) return null;

    return (
      <span className={`priority-dot ${getPriorityClass(priority)}`}></span>
    );
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case "Срочно":
        return "urgent";
      case "Высокий":
        return "high";
      case "Средний":
        return "medium";
      case "Низкий":
        return "low";
      default:
        return "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onCreate();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <Card className="creating-task-card">
      <div className="creating-task-content">
        <div className="creating-task-header">
          <Input
            placeholder="Введите название задачи"
            value={newTaskText}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="creating-task-input"
          />
        </div>
        <div className="creating-task-meta">
          <div className="creating-task-tags">
            <Dropdown menu={priorityMenu} trigger={["click"]}>
              <Button
                type="text"
                className={`priority-btn ${getPriorityClass(
                  newTaskPriority || "Срочно"
                )}`}
              >
                {getPriorityDot(newTaskPriority || "Срочно")}
                {newTaskPriority || "Срочно"}
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
              onChange={onDateChange}
              className="custom-task-datepicker"
              format="DD.MM.YYYY"
              suffixIcon={<CalendarOutlined />}
            />
          </div>
          <Space>
            <Button onClick={onCancel}>Отмена</Button>
            <Button type="primary" onClick={onCreate}>
              Создать
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default TaskCreateForm;
