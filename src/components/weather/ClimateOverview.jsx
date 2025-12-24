"use client";

import { useUnit } from "@/context/UnitContext";
import { toFahrenheit } from "@/lib/utils";

export default function ClimateOverview({ climateStats }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === "metric";

  const { avgHumidity, avgWind, minTemp, maxTemp, cityCount } = climateStats || {
    avgHumidity: 75,
    avgWind: 12,
    minTemp: 27,
    maxTemp: 32,
    cityCount: 0,
  };

  const tempRangeDisplay = isMetric
    ? `${Math.round(minTemp)}°C - ${Math.round(maxTemp)}°C`
    : `${toFahrenheit(minTemp)}°F - ${toFahrenheit(maxTemp)}°F`;

  const avgWindDisplay = isMetric
    ? `${Math.round(avgWind)} kph`
    : `${Math.round(avgWind * 0.621)} mph`;

  return (
    <section id="climate" className="relative z-10 bg-[#0B1116] w-full px-6 py-16 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl w-full mx-auto">
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              public
            </span>
            Climate Overview
          </h3>
          <p className="text-white/60 mt-2 max-w-2xl">
            Current climate conditions across Mindanao based on real-time data from {cityCount} cities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-2xl border-l-4 border-l-orange-400 relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <span className="material-symbols-outlined text-8xl text-orange-400">
                thermostat
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400 mb-6">
                <span className="material-symbols-outlined text-2xl">
                  device_thermostat
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Temperature Range
              </h4>
              <div className="text-4xl font-bold text-white mb-1">{tempRangeDisplay}</div>
              <p className="text-white/50 text-sm">Current Range</p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/70 text-sm leading-relaxed">
                  Current temperature range across all monitored cities in Mindanao.
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl border-l-4 border-l-blue-400 relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <span className="material-symbols-outlined text-8xl text-blue-400">
                water_drop
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 mb-6">
                <span className="material-symbols-outlined text-2xl">umbrella</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Average Humidity</h4>
              <div className="text-4xl font-bold text-white mb-1">{avgHumidity}%</div>
              <p className="text-white/50 text-sm">Across All Cities</p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/70 text-sm leading-relaxed">
                  Average humidity level across all monitored locations in the region.
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl border-l-4 border-l-green-400 relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <span className="material-symbols-outlined text-8xl text-green-400">
                air
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 mb-6">
                <span className="material-symbols-outlined text-2xl">
                  air
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Average Wind Speed
              </h4>
              <div className="text-4xl font-bold text-white mb-1">{avgWindDisplay}</div>
              <p className="text-white/50 text-sm">Regional Average</p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/70 text-sm leading-relaxed">
                  Average wind speed across all cities currently being monitored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
