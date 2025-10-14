import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
  const handleTomorrow = () => onDateChange(new Date(Date.now() + 86400000));

  return (
    <div
      style={{
        border: "1px solid #555",
        padding: 10,
        borderRadius: 8,
        background: "#1b1b1b",
        color: "#fff",
        width: 250,
        marginTop: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <button
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          {"<"}
        </button>
        <span>
          {month.toLocaleString("ru-RU", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          {">"}
        </button>
      </div>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateChange(date)}
        month={month}
        onMonthChange={setMonth}
      />

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={handleToday}>Сегодня</button>
        <button onClick={handleTomorrow}>Завтра</button>
      </div>
    </div>
  );
};

export default TaskDatePicker;
