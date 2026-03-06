"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLogin } from "@/store/useLogin";
import DashboardActions from "@/components/DashboardActions";
import { motion } from "framer-motion";
import { usePrayer } from "@/store/usePrayer";
import { Activity } from "lucide-react";

export default function Visualizador() {
  const { is_auth } = useLogin();
  const router = useRouter();
  const { history } = usePrayer();

  const GOAL_HOURS = 10000;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !is_auth) {
      toast.error("Acesso negado. Por favor, faça login.");
      router.replace("/");
    }
  }, [mounted, is_auth, router]);

  // =====================
  // Cálculos
  // =====================

  const totalMinutes = history.reduce(
    (acc, item) => acc + item.hours * 60 + item.minutes,
    0
  );

  const displayHours = Math.floor(totalMinutes / 60);
  const displayMins = totalMinutes % 60;

  const progressPercentage = Math.min((displayHours / GOAL_HOURS) * 100);

  const radius = 185;
  const circumference = 2 * Math.PI * radius;
  const safePercentage =
    progressPercentage >= 100 ? 99.99 : progressPercentage;

  const offset =
    circumference - (safePercentage / 100) * circumference;

  // =====================

  return (
    <div className="min-h-screen w-full text-white flex flex-col">
      <DashboardActions />

      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center space-y-12">

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-9xl font-black tracking-tighter uppercase">
            10.000 <span className="text-white/60">Horas</span>
          </h1>
          <p className="text-sm md:text-2xl  font-bold text-blue-400 tracking-[0.4em] uppercase">
            de Orações
          </p>
        </motion.div>

        {/* CÍRCULO */}
        <div className="relative w-[90vw] max-w-[680px] aspect-square mx-auto flex items-center justify-center"
          >
          <svg
            viewBox="0 0 520 520"
            className="absolute inset-0 w-full h-full -rotate-90"
          >
            <circle
              cx="260"
              cy="260"
              r={radius}
              className="stroke-white/5 fill-none"
              strokeWidth="18"
            />

            <motion.circle
              cx="260"
              cy="260"
              r={radius}
              className="stroke-blue-500 fill-none"
              strokeWidth="20"
              strokeLinecap="round"
              initial={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
              }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              style={{
                filter:
                  "drop-shadow(0 0 15px rgba(59, 130, 246, 0.7))",
                strokeDasharray: `${circumference} ${circumference}`,
              }}
            />
          </svg>

          {/* Conteúdo central */}
          <div className="z-10">
            <span className="text-7xl sm:text-8xl md:text-8xl font-black tracking-tighter leading-none">
              {displayHours.toLocaleString()}
            </span>

            <p className="text-sm md:text-3xl font-black uppercase tracking-widest text-gray-300 mt-4">
              Horas Concluídas
            </p>

            {displayMins !== 0 && (
              <span className="text-sm md:text-xl font-bold text-blue-500 mt-2 block">
                + {Math.abs(displayMins)}m
              </span>
            )}
          </div>

          {/* Badge porcentagem */}
          <div className="absolute bottom-4 md:bottom-8 bg-blue-600 px-6 py-2 rounded-2xl text-2xl font-black shadow-xl border border-white/10">
            {progressPercentage.toFixed(2)}%
          </div>
        </div>

        {/* STATUS ABAIXO 
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Activity size={20} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider">
              Status da Missão
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                Restante
              </p>
              <p className="text-xl font-black">
                {(GOAL_HOURS - displayHours).toLocaleString()}h
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                Meta Final
              </p>
              <p className="text-xl font-black">
                {GOAL_HOURS.toLocaleString()}h
              </p>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}