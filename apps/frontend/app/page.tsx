"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/feed");
      } else {
        router.replace("/login");
      }
    }, 2500); // Show splash for 2.5s

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return <SplashScreen />;
}
