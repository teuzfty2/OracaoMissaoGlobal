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
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <DashboardActions />
      <main className="w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-white dark:bg-[#0a0f18] p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-95 dark:bg-opacity-50"
        >
          <PrayerCounter />
        </motion.div>
      </main>
    </motion.div>
  );
}
