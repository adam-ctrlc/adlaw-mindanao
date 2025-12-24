"use client";

import { useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import {
  Header,
  SearchBar,
  HeroWeatherPanel,
  WeatherCard,
  WeatherRadar,
  ClimateOverview,
} from "@/components";
import { UnitProvider } from "@/context/UnitContext";

export default function Page() {
  return (
    <UnitProvider>
      <PageContent />
    </UnitProvider>
  );
}

function PageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { weather, loading, error, data, climateStats } = useWeather();

  const filteredData = Array.isArray(weather)
    ? weather.filter((entry) =>
        entry.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const LoadingCard = () => (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
        <div className="h-12 bg-white/10 rounded w-2/3"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="relative w-full bg-background-dark">
        <div className="absolute inset-0 z-0 h-full w-full">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/hero.png')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background-dark"></div>
        </div>
        <Header />
        <section className="relative z-10 w-full flex flex-col items-center px-6 py-16 lg:px-12 lg:py-24">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 w-fit mx-auto lg:mx-0 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                    Live Updates
                  </span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
                  Weather Intelligence <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-primary">
                    For Your Day
                  </span>
                </h1>
                <p className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0 font-body">
                  Get real-time hyper-local forecasts, severe weather alerts,
                  and deep climate insights for any location worldwide.
                </p>
              </div>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            <HeroWeatherPanel data={data} />
          </div>
        </section>
      </div>
      <section
        id="weather"
        className="relative z-10 bg-[#0B1116] w-full px-6 py-16 lg:px-12 border-t border-white/5"
      >
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">
                  map
                </span>
                Weather in Mindanao
              </h3>
              <p className="text-white/60 mt-1">
                Real-time conditions across major cities and areas
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <LoadingCard key={i} />)
              : filteredData.map((entry, index) => (
                  <WeatherCard key={entry.city} entry={entry} index={index} />
                ))}
          </div>
          {!loading && filteredData.length === 0 && searchTerm && (
            <div className="text-center py-24">
              <p className="text-white/40 text-lg">
                No cities found matching "{searchTerm}"
              </p>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          )}
        </div>
      </section>
      <WeatherRadar weatherData={weather} loading={loading} />
      <ClimateOverview climateStats={climateStats} />
    </div>
  );
}
