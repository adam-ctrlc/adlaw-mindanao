"use client";

import { useUnit } from "@/context/UnitContext";
import { toFahrenheit, toMph } from "@/lib/utils";

const weatherIcons = {
  sunny: { icon: "sunny", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  "partly cloudy": {
    icon: "partly_cloudy_day",
    color: "text-orange-300",
    bg: "bg-orange-300/10",
  },
  cloudy: { icon: "cloud", color: "text-gray-300", bg: "bg-white/10" },
  "mostly cloudy": {
    icon: "wb_cloudy",
    color: "text-yellow-200",
    bg: "bg-yellow-200/10",
  },
  rain: { icon: "rainy", color: "text-blue-400", bg: "bg-blue-400/10" },
  "light rain": { icon: "rainy", color: "text-blue-400", bg: "bg-blue-400/10" },
  thunderstorm: {
    icon: "thunderstorm",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  thunderstorms: {
    icon: "thunderstorm",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  default: {
    icon: "partly_cloudy_day",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
};

function getWeatherIcon(condition) {
  const key = condition?.toLowerCase() || "";
  for (const [pattern, value] of Object.entries(weatherIcons)) {
    if (key.includes(pattern)) {
      return value;
    }
  }
  return weatherIcons.default;
}

export default function WeatherCard({ entry, index }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === "metric";

  const conditionText =
    entry.current?.condition?.text || entry.current?.condition || "";
  const weatherStyle = getWeatherIcon(conditionText);
  const temp = isMetric
    ? `${Math.round(entry.current?.temp_c || 0)}°`
    : `${toFahrenheit(entry.current?.temp_c || 0)}°`;
  const humidity = entry.current?.humidity || 0;
  const wind = isMetric
    ? `${Math.round(entry.current?.wind_kph || 0)} km/h`
    : `${toMph(entry.current?.wind_kph || 0)} mph`;

  return (
    <div className="glass-card rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4
            className={`text-xl font-bold text-white group-hover:${weatherStyle.color} transition-colors`}
          >
            {entry.city}
          </h4>
          <p className="text-sm text-white/50 flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">
              location_on
            </span>
            {entry.location?.region || "Mindanao"}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${weatherStyle.bg}`}>
          <span
            className={`material-symbols-outlined ${weatherStyle.color} text-3xl`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {weatherStyle.icon}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-5xl font-bold text-white tracking-tighter">
            {temp}
          </span>
          <span className="text-base font-medium text-white/80 block mt-1">
            {conditionText || "Partly Cloudy"}
          </span>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2 text-sm text-white/60 justify-end">
            <span className="material-symbols-outlined text-[16px]">
              water_drop
            </span>
            {humidity}%
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60 justify-end">
            <span className="material-symbols-outlined text-[16px]">air</span>
            {wind}
          </div>
        </div>
      </div>
    </div>
  );
}
