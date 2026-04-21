"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const Card3D = ({
  children,
  className,
  containerClassName,
  intensity = 40,
}) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateXVal = (mouseY / (rect.height / 2)) * -intensity;
    const rotateYVal = (mouseX / (rect.width / 2)) * intensity;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className={cn("relative", containerClassName)}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl",
          className
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Card3D;
