"use client";

import { useState, useEffect, useCallback } from "react";

export function useWeather(date = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = date ? `/api/weather?date=${date}` : "/api/weather";
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeather,
    weather: data?.weather || [],
    currentDate: data?.currentDate || null,
    climateStats: data?.climateStats || null,
  };
}
