"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function PrayerCounter() {
  const GOAL_HOURS = 10000;
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");

  // Cálculo de exibição
  const displayHours = Math.floor(totalMinutes / 60);
  const displayMins = totalMinutes % 60;
  const progressPercentage = Math.min((displayHours / GOAL_HOURS) * 100, 100);

  const handleAddPrayer = () => {
    const h = parseInt(inputHours) || 0;
    const m = parseInt(inputMinutes) || 0;

    if (h === 0 && m === 0) {
      toast.error("Insira um tempo válido");
      return;
    }

    const addedMinutes = (h * 60) + m;
    
    // Calcula o tempo convertido para o Toast
    const convertedH = Math.floor(addedMinutes / 60);
    const convertedM = addedMinutes % 60;

    setTotalMinutes(prev => prev + addedMinutes);
    
    // Exibe o toast com o tempo já formatado corretamente
    const timeString = `${convertedH}h${convertedM > 0 ? ` ${convertedM}m` : ""}`;
    toast.success(`Adicionado: ${timeString}`);
    
    setInputHours("");
    setInputMinutes("");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          10.000 em Oração
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Meta: {GOAL_HOURS.toLocaleString()} horas de oração
        </p>
      </div>

      <div className="py-10">
        <span className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white">
          {displayHours.toLocaleString()}
        </span>
        <span className="text-2xl md:text-4xl font-bold text-gray-500 dark:text-gray-400 ml-4">
          horas {displayMins > 0 && `e ${displayMins}m`}
        </span>
      </div>

      <div className="w-full space-y-4">
        <p className="text-gray-600 dark:text-gray-300 font-medium">Quantas horas você orou?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Horas"
              value={inputHours}
              onChange={(e) => setInputHours(e.target.value)}
              className="w-24 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 text-center outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
            <input
              type="number"
              placeholder="Min"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              className="w-24 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 text-center outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
          <button
            onClick={handleAddPrayer}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="w-full space-y-3 pt-8">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-black dark:bg-white"
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {progressPercentage.toFixed(2)}% da meta alcançada
        </p>
      </div>
    </div>
  );
}