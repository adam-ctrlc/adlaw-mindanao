"use client";

import { motion } from "framer-motion";
import { useUnit } from "@/context/UnitContext";

export default function UnitToggle() {
  const { unitSystem, toggleUnit } = useUnit();

  return (
    <button
      onClick={toggleUnit}
      className="relative w-48 h-12 bg-gray-100 rounded-full p-1.5 cursor-pointer transition-colors hover:bg-gray-200"
      aria-label="Toggle Unit System"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm border border-gray-200 ${
          unitSystem === "metric" ? "left-1.5" : "left-[calc(50%+3px)]"
        }`}
      />
      <div className="relative z-10 grid grid-cols-2 h-full w-full items-center">
        <span
          className={`text-sm font-medium text-center transition-colors ${
            unitSystem === "metric" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          Metric
        </span>
        <span
          className={`text-sm font-medium text-center transition-colors ${
            unitSystem === "imperial" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          Imperial
        </span>
      </div>
    </button>
  );
}
