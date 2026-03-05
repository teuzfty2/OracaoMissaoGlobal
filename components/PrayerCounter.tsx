"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { usePrayer } from "@/store/usePrayer";
import { Plus, Zap, Activity, Target } from "lucide-react";

export default function PrayerCounter() {
  const GOAL_HOURS = 10000;
  const { history, addTime } = usePrayer();
  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");

  const totalMinutes = history.reduce(
    (acc, item) => acc + item.hours * 60 + item.minutes,
    0,
  );

  const displayHours = Math.floor(totalMinutes / 60);
  const displayMins = totalMinutes % 60;

  const progressPercentage = Math.min((displayHours / GOAL_HOURS) * 100, 100);

  // Configurações do Círculo (Mantendo o tamanho massivo)
  const radius = 185;
  const circumference = 2 * Math.PI * radius;
  // Ajuste fino para evitar sobreposição do linecap em 100%
  const safePercentage = progressPercentage >= 100 ? 99.99 : progressPercentage;
  const offset = circumference - (safePercentage / 100) * circumference;

  const handleAddPrayer = () => {
    const h = parseInt(inputHours) || 0;
    const m = parseInt(inputMinutes) || 0;

    if (h === 0 && m === 0) {
      toast.error("Insira um tempo válido");
      return;
    }

    addTime(h, m, "adicionado");
    toast.success(`Sincronizado: +${h}h ${m}m`);
    setInputHours("");
    setInputMinutes("");
  };

  function calcularDiaProjeto(dataInicio: string) {
    const inicio = new Date(dataInicio + "T00:00:00");
    const hoje = new Date();

    const diffMs = hoje.setHours(0, 0, 0, 0) - inicio.getTime();

    return Math.floor(diffMs / 86400000) + 1;
  }

  const diaProjeto = calcularDiaProjeto("2026-03-01");

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center py-2 md:py-4 space-y-6 md:space-y-8 select-none">
      {/* Título Monumental */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase">
          10.000 <span className="text-white/20">Horas</span>
        </h1>
        <p className="text-sm md:text-base font-bold text-blue-400/60 tracking-[0.4em] uppercase">
          de Orações
        </p>
      </motion.div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
        {/* Coluna da Esquerda: O Contador Circular Massivo */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="relative w-[380px] h-[380px] md:w-[520px] md:h-[520px] flex items-center justify-center">
            {/* Círculo de Fundo com ViewBox para precisão total */}
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
              {/* Círculo de Progresso */}
              <motion.circle
                cx="260"
                cy="260"
                r={radius}
                className="stroke-blue-500 fill-none"
                strokeWidth="18"
                strokeLinecap="round"
                initial={{
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference,
                }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                style={{
                  filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))",
                  strokeDasharray: `${circumference} ${circumference}`,
                }}
              />
            </svg>

            {/* Conteúdo Central */}
            <div className="text-center z-10 px-10 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none whitespace-nowrap">
                  {displayHours.toLocaleString()}
                </span>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">
                    Horas Concluídas
                  </span>
                </div>
                {displayMins !== 0 && (
                  <span className="text-lg md:text-xl font-bold text-blue-500 mt-2">
                    + {Math.abs(displayMins)}m
                  </span>
                )}
              </motion.div>
            </div>

            {/* Badge de Porcentagem */}
            <div className="absolute bottom-6 md:bottom-10 bg-blue-600 text-white px-6 py-2 rounded-2xl text-lg font-black shadow-2xl border border-white/10">
              {progressPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Status e Ações */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full max-w-2xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl space-y-8">
            {/* Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Activity size={20} />
                </div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  Status da Missão
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                    Restante
                  </p>
                  <p className="text-2xl font-black text-white">
                    {(GOAL_HOURS - displayHours - Math.abs(displayMins)).toLocaleString()} horas
                  </p>
                </div>
                <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                    Dias desde o inicio
                  </p>
                  <p className="text-2xl font-black text-white">
                    {diaProjeto} Dias
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Registro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <Zap size={20} />
                </div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  Registrar Tempo
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">
                    Horas
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="00"
                    value={inputHours}
                    onChange={(e) =>
                      setInputHours(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-center text-xl font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">
                    Minutos
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="00"
                    value={inputMinutes}
                    onChange={(e) =>
                      setInputMinutes(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-center text-xl font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleAddPrayer}
                className="w-full py-5 lg:py-4 bg-white text-black font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:opacity-90 cursor-pointer uppercase tracking-widest text-xs"
              >
                <Plus size={20} />
                Adicionar Registro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
