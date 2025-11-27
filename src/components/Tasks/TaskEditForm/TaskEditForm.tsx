import React from "react";
import { Input, Select, DatePicker, Space } from "antd";
import type { Task } from "../../../types/TaskTypes"; // ИМПОРТИМ ТОЛЬКО Task
import dayjs from "dayjs";
import "./TaskEditForm.css";

const { Option } = Select;

interface TaskEditFormProps {
  editingText: string;
  editingPriority?: Task["priority"]; // ИСПОЛЬЗУЕМ Task["priority"]
  editingComplexity?: Task["complexity"]; // ИСПОЛЬЗУЕМ Task["complexity"]
  editingTaskDate: dayjs.Dayjs | null;
  onTextChange: (text: string) => void;
  onPriorityChange: (priority?: Task["priority"]) => void;
  onComplexityChange: (complexity?: Task["complexity"]) => void;
  onDateChange: (date: dayjs.Dayjs | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  editingText,
  editingPriority,
  editingComplexity,
  editingTaskDate,
  onTextChange,
  onPriorityChange,
  onComplexityChange,
  onDateChange,
  onSave,
  onCancel,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <Space direction="vertical" className="editing-task-content">
      <Input
        value={editingText}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onSave}
        autoFocus
        className="editing-task-input"
      />
      <Space wrap className="editing-task-controls">
        <Select
          value={editingPriority}
          onChange={onPriorityChange}
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
          onChange={onComplexityChange}
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
          onChange={onDateChange}
          className="custom-task-datepicker"
          format="DD.MM.YYYY"
        />
      </Space>
    </Space>
  );
};

export default TaskEditForm;
