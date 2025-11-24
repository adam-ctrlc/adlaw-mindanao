"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <div className="mb-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight"
      >
        Ulan ba karon... <br className="hidden lg:block" />
        <span className="text-blue-500">o luha lang nako ni?</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 text-lg lg:text-xl max-w-2xl leading-relaxed"
      >
        Di nako muinsist, bai. Kung di ka ganahan, okay ra. Di man ko weather
        nga mo-adjust sa imong plano. Pero at least, unlike sa uban, consistent
        ko.
      </motion.p>
    </div>
  );
}
