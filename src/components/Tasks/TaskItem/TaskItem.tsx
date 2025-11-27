import React from "react";
import dayjs from "dayjs";
import { List, Checkbox, Tag, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FlagOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { Task } from "../../../types/TaskTypes";
import {
  getPriorityColor,
  getComplexityColor,
  formatDate,
} from "../../../utils/TaskUtils";
import TaskEditForm from "../TaskEditForm/TaskEditForm";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  isEditing: boolean;
  editingText: string;
  editingPriority?: Task["priority"];
  editingComplexity?: Task["complexity"];
  editingTaskDate: dayjs.Dayjs | null; // ЗАМЕНЯЕМ any на правильный тип
  onSelect: (id: number) => void;
  onDoubleClick: (task: Task) => void;
  onToggleCompletion: (id: number) => void;
  onEditTextChange: (text: string) => void;
  onEditPriorityChange: (priority?: Task["priority"]) => void;
  onEditComplexityChange: (complexity?: Task["complexity"]) => void;
  onEditDateChange: (date: dayjs.Dayjs | null) => void; // ЗАМЕНЯЕМ any на правильный тип
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  isEditing,
  editingText,
  editingPriority,
  editingComplexity,
  editingTaskDate,
  onSelect,
  onDoubleClick,
  onToggleCompletion,
  onEditTextChange,
  onEditPriorityChange,
  onEditComplexityChange,
  onEditDateChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) => {
  const actions = [
    <EditOutlined
      key="edit"
      onClick={() => onDoubleClick(task)}
      className="task-action-icon edit-icon"
    />,
    <Popconfirm
      title="Удалить задачу?"
      onConfirm={() => onDelete(task.id)}
      okText="Да"
      cancelText="Нет"
    >
      <DeleteOutlined key="delete" className="task-action-icon delete-icon" />
    </Popconfirm>,
  ];

  return (
    <List.Item
      className={`task-item ${isSelected ? "task-item-selected" : ""}`}
      onClick={() => onSelect(task.id)}
      onDoubleClick={() => onDoubleClick(task)}
      actions={actions}
    >
      <List.Item.Meta
        avatar={
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleCompletion(task.id)}
            className="task-checkbox"
          />
        }
        title={
          isEditing ? (
            <TaskEditForm
              editingText={editingText}
              editingPriority={editingPriority}
              editingComplexity={editingComplexity}
              editingTaskDate={editingTaskDate}
              onTextChange={onEditTextChange}
              onPriorityChange={onEditPriorityChange}
              onComplexityChange={onEditComplexityChange}
              onDateChange={onEditDateChange}
              onSave={() => onSaveEdit(task.id)}
              onCancel={onCancelEdit}
            />
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
  );
};

export default TaskItem;
