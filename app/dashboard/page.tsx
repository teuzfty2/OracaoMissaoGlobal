"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import toast from "react-hot-toast";
import DashboardActions from "@/components/DashboardActions";
import PrayerCounter from "@/components/PrayerCounter";
import Image from "next/image";
import { usePrayer } from "@/store/usePrayer";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <DashboardActions />
      <Image
        src="/ico.jpg"
        alt="Símbolo Missão Global"
        width={150}
        height={150}
        className="absolute top-8 left-8 rounded-full object-cover shadow-lg"
      />
      <main className="w-full max-w-4xl">
        <div className="relative bg-white dark:bg-[#0a0f18] p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-95 dark:bg-opacity-50">
          <PrayerCounter />
        </div>
      </main>
    </div>
  );
}
