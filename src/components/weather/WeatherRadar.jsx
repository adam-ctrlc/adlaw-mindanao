"use client";

import { useState } from "react";
import { useUnit } from "@/context/UnitContext";
import { toFahrenheit } from "@/lib/utils";

// Mindanao bounds for positioning
const MINDANAO_BOUNDS = {
  minLat: 5.5,
  maxLat: 9.8,
  minLon: 121.5,
  maxLon: 126.8,
};

function latLonToPosition(lat, lon) {
  const x = ((lon - MINDANAO_BOUNDS.minLon) / (MINDANAO_BOUNDS.maxLon - MINDANAO_BOUNDS.minLon)) * 100;
  const y = ((MINDANAO_BOUNDS.maxLat - lat) / (MINDANAO_BOUNDS.maxLat - MINDANAO_BOUNDS.minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

function getWeatherColor(condition, layer) {
  const conditionLower = condition?.toLowerCase() || "";

  if (layer === "Rain") {
    if (conditionLower.includes("thunder")) return { bg: "bg-purple-500", glow: "bg-purple-500/30" };
    if (conditionLower.includes("heavy rain")) return { bg: "bg-blue-600", glow: "bg-blue-600/30" };
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return { bg: "bg-blue-400", glow: "bg-blue-400/30" };
    if (conditionLower.includes("cloud")) return { bg: "bg-gray-400", glow: "bg-gray-400/20" };
    return { bg: "bg-yellow-400", glow: "bg-yellow-400/20" };
  }

  if (layer === "Wind") {
    return { bg: "bg-teal-400", glow: "bg-teal-400/30" };
  }

  if (layer === "Clouds") {
    if (conditionLower.includes("overcast") || conditionLower.includes("cloudy")) return { bg: "bg-gray-300", glow: "bg-gray-300/30" };
    if (conditionLower.includes("partly")) return { bg: "bg-gray-400", glow: "bg-gray-400/20" };
    return { bg: "bg-blue-200", glow: "bg-blue-200/20" };
  }

  return { bg: "bg-blue-400", glow: "bg-blue-400/20" };
}

function getLayerValue(entry, layer, isMetric) {
  if (layer === "Rain") {
    return `${entry.current?.humidity || 0}%`;
  }
  if (layer === "Wind") {
    const wind = entry.current?.wind_kph || 0;
    return isMetric ? `${Math.round(wind)} kph` : `${Math.round(wind * 0.621)} mph`;
  }
  if (layer === "Clouds") {
    return `${entry.current?.cloud || 0}%`;
  }
  return "";
}

export default function WeatherRadar({ weatherData = [], loading = false }) {
  const [activeLayer, setActiveLayer] = useState("Rain");
  const [selectedCity, setSelectedCity] = useState(null);
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === "metric";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <section id="radar" className="relative z-10 bg-background-dark w-full px-6 py-16 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              radar
            </span>
            Weather Radar
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-white/60 text-sm font-medium">
              {loading ? "LOADING..." : "LIVE DATA"}
            </span>
          </div>
        </div>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="glass-panel min-w-[600px] w-full h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl relative overflow-hidden group">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[#0c141d] radar-grid opacity-80"></div>

          {/* Ambient glow effects based on weather - hidden on mobile for performance */}
          {weatherData.slice(0, 4).map((entry, index) => {
            const pos = latLonToPosition(entry.location?.lat || 7, entry.location?.lon || 124);
            const colors = getWeatherColor(entry.current?.condition?.text, activeLayer);
            return (
              <div
                key={`glow-${index}`}
                className={`absolute hidden md:block w-32 md:w-48 h-32 md:h-48 ${colors.glow} rounded-full blur-3xl mix-blend-screen animate-pulse`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${index * 0.5}s`,
                }}
              />
            );
          })}

          {/* City markers */}
          {weatherData.map((entry, index) => {
            const pos = latLonToPosition(entry.location?.lat || 7, entry.location?.lon || 124);
            const colors = getWeatherColor(entry.current?.condition?.text, activeLayer);
            const temp = isMetric
              ? `${Math.round(entry.current?.temp_c || 0)}°`
              : `${toFahrenheit(entry.current?.temp_c || 0)}°`;
            const layerValue = getLayerValue(entry, activeLayer, isMetric);
            const isSelected = selectedCity === entry.city;

            return (
              <div
                key={entry.city}
                className="absolute cursor-pointer transition-all duration-300 hover:z-20"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setSelectedCity(isSelected ? null : entry.city)}
              >
                {/* Marker dot */}
                <div className={`relative ${isSelected ? "scale-125" : ""} transition-transform`}>
                  <div className={`w-4 h-4 ${colors.bg} rounded-full shadow-lg`}>
                    <div className={`absolute inset-0 ${colors.bg} rounded-full animate-ping opacity-50`}></div>
                  </div>

                  {/* City label - hidden on mobile unless selected */}
                  <div className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity ${isSelected ? "opacity-100" : "opacity-0 md:opacity-80 md:group-hover:opacity-100"}`}>
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
                      <p className="text-[10px] md:text-xs font-bold text-white">{entry.city}</p>
                      <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-white/70">
                        <span>{temp}</span>
                        <span className="text-white/40">|</span>
                        <span>{layerValue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded info on selection */}
                  {isSelected && (
                    <div className="absolute left-6 top-full mt-1 whitespace-nowrap z-30">
                      <div className="bg-black/80 backdrop-blur-md rounded-xl px-3 py-2 md:px-4 md:py-3 border border-white/20 shadow-xl">
                        <p className="text-xs md:text-sm font-bold text-white mb-2">{entry.city}</p>
                        <div className="space-y-1 text-[10px] md:text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Condition</span>
                            <span className="text-white">{entry.current?.condition?.text || "N/A"}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Temperature</span>
                            <span className="text-white">{temp}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Humidity</span>
                            <span className="text-white">{entry.current?.humidity || 0}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Wind</span>
                            <span className="text-white">
                              {isMetric
                                ? `${Math.round(entry.current?.wind_kph || 0)} kph`
                                : `${Math.round((entry.current?.wind_kph || 0) * 0.621)} mph`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                <span>Loading weather data...</span>
              </div>
            </div>
          )}

          {/* Zoom controls - hidden on mobile */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 hidden md:flex flex-col gap-2">
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>

          {/* Layer selector */}
          <div className="absolute top-4 left-4 md:top-6 md:left-auto md:left-auto md:right-6">
            <div className="glass-card rounded-lg p-1 flex gap-1">
              {["Rain", "Wind", "Clouds"].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-2 md:px-3 py-1.5 rounded text-[10px] md:text-xs font-bold transition-colors ${
                    activeLayer === layer
                      ? "bg-primary text-white"
                      : "hover:bg-white/10 text-white/70"
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-auto md:right-6 glass-card rounded-lg p-2 md:p-3">
            <p className="text-[10px] text-white/50 uppercase font-bold mb-2">Legend</p>
            <div className="space-y-1">
              {activeLayer === "Rain" && (
                <>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Thunderstorm</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Rain</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>Cloudy</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span>Clear</span>
                  </div>
                </>
              )}
              {activeLayer === "Wind" && (
                <div className="flex items-center gap-2 text-[10px] text-white/70">
                  <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                  <span>Wind Speed</span>
                </div>
              )}
              {activeLayer === "Clouds" && (
                <>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span>Overcast</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
                    <span>Clear</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Current time display */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-auto md:left-6 glass-card rounded-lg px-3 py-1.5 md:px-4 md:py-2">
            <span className="text-white/60 text-[10px] md:text-xs font-mono">{timeStr}</span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
