"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const FocusCards = ({ cards, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id || index}
          className={cn(
            "relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300",
            "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
            hoveredIndex !== null && hoveredIndex !== index && "blur-sm scale-95 opacity-60"
          )}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            {card.icon && (
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                {card.icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {card.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {card.description}
            </p>
          </div>
          
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 50%)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FocusCards;
