"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

export const FloatingDock = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <motion.div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-2 px-4 py-3 rounded-2xl",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
        "border border-slate-200 dark:border-slate-700 shadow-2xl",
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.label}
          onClick={item.onClick}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={cn(
            "relative flex flex-col items-center justify-center p-3 rounded-xl",
            "transition-colors duration-200",
            item.active
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600"
              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.icon}
          
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -30 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-2 px-2 py-1 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default FloatingDock;
