"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useWebSocket } from "@/services/websocketService";
import { motion, AnimatePresence } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Establish WebSocket connection for the entire authenticated session
  useWebSocket();

  // Client-side auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 left-4 z-30 lg:hidden p-3 rounded-2xl bg-violet shadow-violet text-white"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-bg-secondary border-r border-border lg:hidden"
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-lg font-bold gradient-text">Navigation</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated"
                >
                  <X size={20} />
                </button>
              </div>
              <Sidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop layout */}
      <div className="pt-16 max-w-7xl mx-auto px-4 flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-6">{children}</main>
      </div>
    </div>
  );
}
