"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function HeroGraphic() {
  return (
    <div className="relative h-[500px] w-full">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-accent/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Central gradient circle */}
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-accent to-accent-secondary opacity-10 blur-3xl" />

      {/* Floating cards */}
      <motion.div className="absolute left-[10%] top-[15%] h-24 w-32 rounded-xl bg-card shadow-xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="h-full w-full rounded-xl bg-linear-to-br from-accent/5 to-transparent p-4">
          <div className="h-3 w-16 rounded-full bg-accent/20" />
          <div className="mt-2 h-2 w-12 rounded-full bg-muted" />
        </div>
      </motion.div>

      <motion.div className="absolute bottom-[20%] right-[15%] h-28 w-36 rounded-xl bg-card shadow-xl" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <div className="h-full w-full rounded-xl bg-linear-to-br from-accent-secondary/5 to-transparent p-4">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-accent/30" />
            <div className="h-2 w-2 rounded-full bg-accent/30" />
            <div className="h-2 w-2 rounded-full bg-accent/30" />
          </div>
          <div className="mt-3 h-3 w-20 rounded-full bg-accent/20" />
        </div>
      </motion.div>

      {/* Decorative geometric shapes */}
      <div className="absolute right-[25%] top-[10%] h-16 w-16 rounded-2xl bg-linear-to-br from-accent to-accent-secondary shadow-accent" />

      <div className="absolute bottom-[25%] left-[20%] grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-accent/20" />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute left-0 top-0 h-[200px] w-[200px] rounded-full bg-accent/5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-accent-secondary/5 blur-[120px]" />
    </div>
  );
}
