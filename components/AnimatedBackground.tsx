"use client";

import React from "react";
import { motion } from "framer-motion";
import { backgroundShapes, shapeVariants } from "@/store/animations/variantes";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-linear-to-t dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {backgroundShapes.map((shape: any, i: number) => (
        <motion.div
          key={i}
          custom={i}
          initial="initial"
          animate="animate"
          variants={shapeVariants}
          className="absolute rounded-full bg-white/5 filter blur-3xl"
          style={{
            width: shape.width,
            height: shape.height,
            left: shape.left,
            top: shape.top,
            opacity: shape.opacity,
          }}
        />
      ))}
    </div>
  );
}