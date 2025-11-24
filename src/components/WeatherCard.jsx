"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Thermometer,
  Droplets,
  Cloud,
  Wind,
  Sun,
  Clock,
} from "lucide-react";
import {
  formatDate,
  getBisayaPhrase,
  cn,
  toFahrenheit,
  toMiles,
  toMph,
  toInHg,
} from "@/lib/utils";
import { useUnit } from "@/context/UnitContext";

export default function WeatherCard({ entry, selectedDate, index }) {
  const { unitSystem } = useUnit();
  const phrase = getBisayaPhrase(
    entry.current.condition,
    entry.current.temp_c,
    entry.current.humidity
  );

  const severityStyles = {
    danger: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    caution: "bg-yellow-50 border-yellow-200 text-yellow-800",
    neutral: "bg-gray-50 border-gray-200 text-gray-800",
    good: "bg-green-50 border-green-200 text-green-800",
  };

  const isMetric = unitSystem === "metric";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{
        borderColor: "var(--color-blue-400)",
        backgroundColor: "var(--color-blue-50)",
      }}
      className="bg-white border-2 border-gray-100 rounded-xl p-4 transition-colors duration-300 h-full flex flex-col"
    >
      <div className="border-b border-gray-100 pb-3 mb-3">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight truncate" title={entry.city}>
          {entry.city}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            {selectedDate
              ? formatDate(selectedDate)
              : formatDate(entry.location.localtime)}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "border rounded-lg p-3 mb-4 transition-colors duration-300 flex-grow",
          severityStyles[phrase.severity]
        )}
      >
        <p className="text-xs italic font-medium leading-relaxed">
          "{phrase.text}"
        </p>
      </div>

      <div className="space-y-2.5">
        <WeatherRow
          icon={Thermometer}
          label="Temp"
          value={
            isMetric
              ? `${entry.current.temp_c}°C`
              : `${toFahrenheit(entry.current.temp_c)}°F`
          }
        />
        <WeatherRow
          icon={Sun}
          label="Feels"
          value={
            isMetric
              ? `${entry.current.feelslike_c}°C`
              : `${toFahrenheit(entry.current.feelslike_c)}°F`
          }
          isTextIcon
        />
        <WeatherRow
          icon={Droplets}
          label="Humidity"
          value={`${entry.current.humidity}%`}
        />
        <WeatherRow
          icon={Cloud}
          label="Cloud"
          value={`${entry.current.cloud}%`}
        />
        <WeatherRow
          icon={Wind}
          label="Wind"
          value={
            isMetric
              ? `${entry.current.wind_kph} kph`
              : `${toMph(entry.current.wind_kph)} mph`
          }
        />
        <WeatherRow
          icon={Sun}
          label="UV"
          value={entry.current.uv}
        />
        <WeatherRow
          icon={Sun}
          label="Vis"
          value={
            isMetric
              ? `${entry.current.vis_km} km`
              : `${toMiles(entry.current.vis_km)} mi`
          }
          isTextIcon
        />
        <WeatherRow
          icon={Sun}
          label="Press"
          value={
            isMetric
              ? `${Math.round(entry.current.pressure_mb)} mb`
              : `${toInHg(entry.current.pressure_mb)} in`
          }
          isTextIcon
        />

        <div className="pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Updated: {entry.current.last_updated.split(' ')[1]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WeatherRow({ icon: Icon, label, value, isTextIcon = false }) {
  return (
    <div className="flex justify-between items-center group gap-2">
      <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors min-w-0">
        {isTextIcon ? (
          <span className="text-[10px] font-bold uppercase tracking-wider w-3.5 text-center flex-shrink-0">
            •
          </span>
        ) : (
          <Icon className="h-3.5 w-3.5 flex-shrink-0" />
        )}
        <span className="text-xs font-medium truncate">{label}</span>
      </div>
      <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{value}</span>
    </div>
  );
}
