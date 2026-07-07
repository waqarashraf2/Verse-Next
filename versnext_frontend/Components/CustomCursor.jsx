"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState("default");

  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setCursorType("hover");
    const handleMouseLeave = () => setCursorType("default");

    window.addEventListener("mousemove", updateCursor);
    
    const interactiveElements = document.querySelectorAll("button, a");
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-[#4d61b7] pointer-events-none z-50"
        animate={{
          x: cursorPos.x - 6,
          y: cursorPos.y - 6,
          scale: cursorType === "hover" ? 1.8 : 1,
          backgroundColor: cursorType === "hover" ? "#6f7ed1" : "#4d61b7"
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#4d61b7] pointer-events-none z-50"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
          scale: cursorType === "hover" ? 0.8 : 1,
          borderColor: cursorType === "hover" ? "#6f7ed1" : "#4d61b7"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
      />
    </>
  );
};

export default CustomCursor;