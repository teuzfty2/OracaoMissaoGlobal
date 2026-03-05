"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import toast from "react-hot-toast";
import DashboardActions from "@/components/DashboardActions";
import PrayerCounter from "@/components/PrayerCounter";
import { usePrayer } from "@/store/usePrayer";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { is_auth } = useLogin();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !is_auth) {
      toast.error("Acesso negado. Por favor, faça login.");
      router.replace("/");
    }
  }, [is_auth, router, mounted]);

  useEffect(() => {
    if (!is_auth) return;
    usePrayer.getState().loadFromDatabase();
  }, [is_auth]);

  if (!mounted || !is_auth) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 pb-12 px-6 overflow-x-hidden">
      <DashboardActions />
      
      <motion.main 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl"
      >
        <PrayerCounter />
      </motion.main>
    </div>
  );
}