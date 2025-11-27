import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  getTomorrow,
  formatMonthYear,
  getPreviousMonth,
  getNextMonth,
} from "../../../utils/DateUtils";
import "react-day-picker/dist/style.css";
import "./TaskDatePicker.css";

interface TaskDatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
}

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [month, setMonth] = useState(selectedDate || new Date());

  const handleToday = () => onDateChange(new Date());
  const handleTomorrow = () => onDateChange(getTomorrow());

  const handlePreviousMonth = () => setMonth(getPreviousMonth(month));
  const handleNextMonth = () => setMonth(getNextMonth(month));

  return (
    <div className="task-date-picker">
      <div className="date-picker-header">
        <button onClick={handlePreviousMonth} className="month-nav-button">
          {"<"}
        </button>
        <span className="month-year-text">{formatMonthYear(month)}</span>
        <button onClick={handleNextMonth} className="month-nav-button">
          {">"}
        </button>
      </div>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateChange(date)}
        month={month}
        onMonthChange={setMonth}
        className="custom-day-picker"
      />

      <div className="quick-actions">
        <button onClick={handleToday} className="quick-action-button">
          Сегодня
        </button>
        <button onClick={handleTomorrow} className="quick-action-button">
          Завтра
        </button>
      </div>
    </div>
  );
};

export default TaskDatePicker;
