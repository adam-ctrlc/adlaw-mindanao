"use client";

import { useState } from "react";
import { useUnit } from "@/context/UnitContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unitSystem, toggleUnit } = useUnit();

  return (
    <header className="relative z-20 w-full px-6 py-4 lg:px-12 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20 text-primary backdrop-blur-sm">
            <span className="material-symbols-outlined text-2xl">cyclone</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Atmosphere
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            href="#radar"
          >
            Radar
          </a>
          <a
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            href="#weather"
          >
            Weather
          </a>
          <a
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            href="#climate"
          >
            Climate
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Unit toggle button */}
          <button
            onClick={toggleUnit}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all group"
            title={`Switch to ${
              unitSystem === "metric" ? "Imperial" : "Metric"
            }`}
          >
            <span
              className={`text-xs font-bold transition-colors ${
                unitSystem === "metric" ? "text-primary" : "text-white/40"
              }`}
            >
              °C
            </span>
            <div className="relative w-8 h-4 bg-white/10 rounded-full">
              <div
                className={`absolute top-0.5 ${
                  unitSystem === "metric" ? "left-0.5" : "left-[18px]"
                } w-3 h-3 bg-primary rounded-full transition-all duration-300`}
              ></div>
            </div>
            <span
              className={`text-xs font-bold transition-colors ${
                unitSystem === "imperial" ? "text-primary" : "text-white/40"
              }`}
            >
              °F
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center size-10 rounded-lg bg-white/10 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 glass-panel border-b border-white/10 px-6 py-4">
          <div className="flex flex-col gap-4">
            <a
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              href="#radar"
              onClick={() => setIsMenuOpen(false)}
            >
              Radar
            </a>
            <a
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              href="#weather"
              onClick={() => setIsMenuOpen(false)}
            >
              Weather
            </a>
            <a
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              href="#climate"
              onClick={() => setIsMenuOpen(false)}
            >
              Climate
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
