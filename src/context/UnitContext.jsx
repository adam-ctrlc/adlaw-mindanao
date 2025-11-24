"use client";

import { createContext, useContext, useState } from "react";

const UnitContext = createContext();

export function UnitProvider({ children }) {
  const [unitSystem, setUnitSystem] = useState("metric"); // 'metric' or 'imperial'

  const toggleUnit = () => {
    setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <UnitContext.Provider value={{ unitSystem, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  return useContext(UnitContext);
}
