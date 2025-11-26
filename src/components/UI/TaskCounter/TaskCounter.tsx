import React from "react";

interface TaskCounterProps {
  count: number;
}

const TaskCounter: React.FC<TaskCounterProps> = ({ count }) => {
  const getTaskLabel = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) return "активная задача";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
      return "активные задачи";
    return "активных задач";
  };

  return (
    <div className="task-counter">
      {count} {getTaskLabel(count)}
    </div>
  );
};

export default TaskCounter;
