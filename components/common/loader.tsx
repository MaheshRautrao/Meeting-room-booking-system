"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex justify-center items-center space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-blue-500 rounded-full"
          animate={{
            y: [0, -10, 0], // Bouncing effect
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            delay: index * 0.2, // Creates a staggered effect
          }}
        />
      ))}
    </div>
  );
}
