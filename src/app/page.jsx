"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_WEATHER_DATA } from "@/lib/queries";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import DateSelector from "@/components/DateSelector";
import WeatherCard from "@/components/WeatherCard";
import UnitToggle from "@/components/UnitToggle";
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
  const [selectedDate, setSelectedDate] = useState("");

  const { loading, error, data } = useQuery(GET_WEATHER_DATA, {
    variables: { date: selectedDate || undefined },
    errorPolicy: "all",
  });

  // Update selectedDate when data.currentDate is available and no date is selected
  if (data?.currentDate && !selectedDate) {
    setSelectedDate(data.currentDate);
  }

  const isRateLimited = error?.graphQLErrors?.some(
    (err) => err.extensions?.code === "RATE_LIMITED"
  );

  const weatherData = data?.weather || [];

  const filteredData = Array.isArray(weatherData)
    ? weatherData.filter((entry) =>
        entry.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const LoadingCard = () => (
    <div className="border-2 border-gray-100 rounded-xl p-6 animate-pulse bg-white">
      <div className="h-8 bg-gray-100 rounded mb-4 w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <Header />
          <UnitToggle />
        </div>

        <div className="flex flex-col gap-6 mb-12">
          <div className="w-full">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div className="w-full">
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              startDate={data?.currentDate}
            />
          </div>
        </div>

        {isRateLimited ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Hinay hinay bai!
              </h2>
              <p className="text-lg text-red-700 mb-4">
                Agpasa nimo maka tuplok oy! Pag-chill lang sa diha, dili mawala
                ang adlaw.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Sige, mag hulat ko
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))
              : filteredData.map((entry, index) => (
                  <WeatherCard
                    key={entry.city}
                    entry={entry}
                    selectedDate={selectedDate}
                    index={index}
                  />
                ))}
          </div>
        )}

        {!loading && filteredData.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-gray-400 text-lg">
              No cities found matching "{searchTerm}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

