"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative w-full"
    >
      <div className="relative group">
        <input
          type="text"
          name="citySearch"
          placeholder="Search for a city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-100 rounded-2xl text-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 shadow-sm hover:border-gray-200 hover:shadow-md"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg text-gray-400 group-focus-within:text-blue-500 group-focus-within:bg-blue-50 transition-colors duration-300">
          <Search className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
