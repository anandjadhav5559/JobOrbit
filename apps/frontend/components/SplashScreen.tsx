"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-bg-primary flex flex-col items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(6,182,212,0.3) 50%, transparent 70%)",
          }}
        />
      </div>

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Logo animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Orbital ring */}
        <div className="relative flex items-center justify-center mb-8">
          <motion.div
            className="w-32 h-32 rounded-full border-2 border-violet/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full border border-cyan/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          {/* Orbiting dot 1 */}
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-violet"
            style={{
              top: "50%",
              left: "50%",
              marginTop: -6,
              marginLeft: -6,
            }}
            animate={{
              x: [0, 64, 0, -64, 0],
              y: [0, 30, 64, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Orbiting dot 2 */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-cyan"
            animate={{
              x: [0, -96, 0, 96, 0],
              y: [0, -45, -96, -45, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Center logo */}
          <motion.div
            className="absolute"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Image
              src="/logo.png"
              alt="JobOrbit"
              width={80}
              height={80}
              className="object-contain drop-shadow-lg"
              priority
            />
          </motion.div>
        </div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl font-bold tracking-tight mb-2"
        >
          <span className="text-text-primary">job</span>
          <span className="gradient-text">Orbit</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-text-secondary text-sm font-medium tracking-widest uppercase"
        >
          Explore. Apply. Grow.
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-10 w-48 h-1 bg-bg-elevated rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-brand"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.1, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
