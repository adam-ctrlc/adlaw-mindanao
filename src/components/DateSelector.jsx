"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

export default function DateSelector({
  selectedDate,
  setSelectedDate,
  startDate,
}) {
  const getNext14Days = () => {
    const days = [];
    let baseDate;

    if (startDate) {
      // Parse YYYY-MM-DD explicitly to avoid local timezone issues
      const [year, month, day] = startDate.split("-").map(Number);
      baseDate = new Date(Date.UTC(year, month - 1, day));
    } else {
      // Fallback to today (UTC)
      const now = new Date();
      baseDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    for (let i = 0; i < 14; i++) {
      const date = new Date(baseDate);
      date.setUTCDate(baseDate.getUTCDate() + i);
      
      days.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        dayName: date.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
      });
    }
    return days;
  };

  const days = getNext14Days();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="w-full bg-white rounded-2xl border-2 border-gray-100 p-2"
    >
      <div className="flex items-center gap-2 px-4 py-2 mb-2 border-b border-gray-50">
        <CalendarIcon className="h-4 w-4 text-blue-500" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Forecast Date
        </span>
      </div>
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide px-2">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() =>
              setSelectedDate(day.date === selectedDate ? "" : day.date)
            }
            className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl border-2 transition-all duration-200",
              selectedDate === day.date
                ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200 scale-105"
                : "bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-gray-200 hover:text-gray-900"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide opacity-80 mb-1">
              {day.dayName}
            </span>
            <span className="text-lg font-bold">{day.display.split(" ")[1]}</span>
            <span className="text-[10px] font-medium opacity-60">
              {day.display.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
