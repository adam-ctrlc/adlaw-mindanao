"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_WEATHER_DATA } from "@/lib/queries";
import {
  Search,
  Thermometer,
  Droplets,
  Cloud,
  Wind,
  Sun,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const { loading, error, data } = useQuery(GET_WEATHER_DATA, {
    variables: { date: selectedDate || undefined },
    errorPolicy: "all",
  });

  const isRateLimited = error?.graphQLErrors?.some(
    (err) => err.extensions?.code === "RATE_LIMITED"
  );

  const weatherData = data?.weather || [];

  const filteredData = Array.isArray(weatherData)
    ? weatherData.filter((entry) =>
        entry.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const getBisayaPhrase = (condition, temp, humidity) => {
    const conditionText = condition?.text?.toLowerCase() || "";

    if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
      return {
        text: "Mo-ulan karon. Pero dayon japun ang klase hahay.",
        severity: "warning",
      };
    } else if (
      conditionText.includes("sunny") ||
      conditionText.includes("clear")
    ) {
      if (temp > 30) {
        return {
          text: "Init kaayo karon! Ayaw kalimot ug payong ha!",
          severity: "caution",
        };
      } else {
        return {
          text: "Nindot ang panahon karon, sige laag!",
          severity: "good",
        };
      }
    } else if (conditionText.includes("cloud")) {
      return {
        text: "Medyo lungon pero okay ra, pwede pa mo gawas.",
        severity: "neutral",
      };
    } else if (
      conditionText.includes("storm") ||
      conditionText.includes("thunder")
    ) {
      return {
        text: "Bawal laag! May bagyo! Puydi ka ma-unay!",
        severity: "danger",
      };
    } else if (humidity > 80) {
      return {
        text: "Humot kaayo ang hangin karon, mag-init2x lang sa balay.",
        severity: "caution",
      };
    }

    return {
      text: "Okay ra ang panahon karon, pero bantayi gihapon.",
      severity: "neutral",
    };
  };

  const getNext14Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        dayName: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
      });
    }
    return days;
  };

  const LoadingCard = () => (
    <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Ulan ba karon... o luha lang nako ni?
          </h1>
          <p className="text-gray-600 mb-6 text-lg lg:text-xl">
            Di nako muinsist, bai. Kung di ka ganahan, okay ra. Di man ko
            weather nga mo-adjust sa imong plano. Pero at least, unlike sa uban,
            consistent ko. Dili paasa, dili nagsige'g pangutana kung asa na ta
            padulong.
          </p>

          <div className="flex flex-col gap-6 items-start">
            <div className="relative">
              <input
                type="text"
                name="citySearch"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80 px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex-1 w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Pilia ang adlaw:
              </h3>
              <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                {getNext14Days().map((day) => (
                  <button
                    key={day.date}
                    onClick={() =>
                      setSelectedDate(day.date === selectedDate ? "" : day.date)
                    }
                    className={`p-3 rounded-lg text-center transition-colors duration-200 border-2 ${
                      selectedDate === day.date
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-xs font-medium">{day.dayName}</div>
                    <div className="text-sm">{day.display}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isRateLimited ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Hinay hinay bai!
              </h2>
              <p className="text-lg text-red-700">
                Agpasa nimo maka tuplok oy! Pag-chill lang sa diha, dili mawala
                ang adlaw.
              </p>
              <p className="text-md text-red-600 italic">
                Pahuway lang gamay, daghang salamat! Balik-balik lang after 1
                minute ha.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Sige, mag hulat ko
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))
              : filteredData.map((entry) => (
                  <div
                    key={entry.city}
                    className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="border-b border-gray-100 pb-3 mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {entry.city}
                      </h2>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {selectedDate
                            ? formatDate(selectedDate)
                            : formatDate(entry.location.localtime)}
                        </span>
                      </div>
                    </div>

                    {(() => {
                      const phrase = getBisayaPhrase(
                        entry.current.condition,
                        entry.current.temp_c,
                        entry.current.humidity
                      );
                      const severityStyles = {
                        danger: "bg-red-50 border-red-200 text-red-800",
                        warning:
                          "bg-orange-50 border-orange-200 text-orange-800",
                        caution:
                          "bg-yellow-50 border-yellow-200 text-yellow-800",
                        neutral: "bg-gray-50 border-gray-200 text-gray-800",
                        good: "bg-green-50 border-green-200 text-green-800",
                      };

                      return (
                        <div
                          className={`border rounded-lg p-3 mb-4 ${
                            severityStyles[phrase.severity]
                          }`}
                        >
                          <p className="text-sm italic font-medium">
                            {phrase.text}
                          </p>
                        </div>
                      );
                    })()}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Thermometer className="h-4 w-4" />
                          <span>Temperature</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.temp_c}°C
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">Feels like</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.feelslike_c}°C
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Droplets className="h-4 w-4" />
                          <span>Humidity</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.humidity}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Cloud className="h-4 w-4" />
                          <span>Cloud Cover</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.cloud}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Wind className="h-4 w-4" />
                          <span>Wind</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.wind_kph} kph {entry.current.wind_dir}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Sun className="h-4 w-4" />
                          <span>UV Index</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.uv}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">Visibility</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.vis_km} km
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">Pressure</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.current.pressure_mb} mb
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            Last updated: {entry.current.last_updated}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {!loading && filteredData.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No cities found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
