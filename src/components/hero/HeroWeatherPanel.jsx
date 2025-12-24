"use client";

import { useState, useEffect } from "react";
import { useUnit } from "@/context/UnitContext";
import { toFahrenheit, toMph, toMiles } from "@/lib/utils";

export default function HeroWeatherPanel({ data }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === "metric";
  const [currentIndex, setCurrentIndex] = useState(0);

  const weatherList = data?.weather || [];

  useEffect(() => {
    if (weatherList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % weatherList.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [weatherList.length]);

  const currentCity = weatherList[currentIndex];
  const temp = currentCity?.current?.temp_c || 31;
  const humidity = currentCity?.current?.humidity || 78;
  const wind = currentCity?.current?.wind_kph || 13;
  const uv = currentCity?.current?.uv || 8;
  const visibility = currentCity?.current?.vis_km || 9;
  const condition = currentCity?.current?.condition?.text || "Partly Cloudy";
  const cityName = currentCity?.city || "Davao City";

  const displayTemp = isMetric ? `${Math.round(temp)}°` : `${toFahrenheit(temp)}°`;
  const displayWind = isMetric ? `${Math.round(wind)} kph` : `${toMph(wind)} mph`;
  const displayVis = isMetric ? `${Math.round(visibility)} km` : `${toMiles(visibility)} mi`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="relative w-full max-w-md mx-auto lg:ml-auto">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
      <div className="glass-panel relative rounded-2xl p-6 md:p-8 shadow-2xl text-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {cityName}
              <span className="material-symbols-outlined text-primary text-base">
                near_me
              </span>
            </h2>
            <p className="text-white/60 text-sm mt-1">Today, {timeStr}</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            Current
          </div>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-7xl font-bold tracking-tighter">{displayTemp}</span>
            <span className="text-lg font-medium text-white/80 ml-1">{condition}</span>
          </div>
          <div className="text-yellow-400">
            <span
              className="material-symbols-outlined text-[80px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              partly_cloudy_day
            </span>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">water_drop</span>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase font-bold">Humidity</p>
              <p className="text-lg font-bold">{humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="size-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
              <span className="material-symbols-outlined">air</span>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase font-bold">Wind</p>
              <p className="text-lg font-bold">{displayWind}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="size-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
              <span className="material-symbols-outlined">wb_sunny</span>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase font-bold">UV Index</p>
              <p className="text-lg font-bold">{uv >= 8 ? "Extreme" : uv >= 6 ? "High" : "Moderate"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase font-bold">Visibility</p>
              <p className="text-lg font-bold">{displayVis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
