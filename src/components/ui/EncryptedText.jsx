"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const EncryptedText = ({
  text,
  className,
  duration = 2,
  revealDelay = 0,
  once = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isRevealed, setIsRevealed] = useState(false);

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsRevealed(true);
      }

      iteration += 1 / 3;
    }, (duration * 1000) / (text.length * 3));

    return () => clearInterval(interval);
  }, [text, duration]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scramble();
    }, revealDelay * 1000);

    return () => clearTimeout(timer);
  }, [scramble, revealDelay]);

  return (
    <motion.span
      className={cn("inline-block font-mono text-center w-full", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
    </motion.span>
  );
};

export default EncryptedText;
