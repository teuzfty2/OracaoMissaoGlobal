"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import LoginSwitchTheme from "@/html/switch/switchTheme";
import { IoExitOutline } from "react-icons/io5";
import { ChevronLeft } from "lucide-react";

export default function DashboardActions() {
  const [isHovered, setIsHovered] = useState(false);
  const { logout } = useLogin();
  const router = useRouter();

  return (
    <div 
      className="fixed top-6 right-0 z-50 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={false}
        animate={{ 
          x: isHovered ? 0 : "calc(100% - 40px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex items-center bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 p-2 rounded-l-2xl shadow-2xl"
      >
        {/* Ícone de Gatilho (Seta) */}
        <div className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 cursor-pointer">
          <motion.div
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={24} />
          </motion.div>
        </div>

        {/* Conteúdo que aparece ao expandir */}
        <div className="flex items-center gap-3 pr-2">
          <LoginSwitchTheme />
          <button 
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-10 h-10 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
            title="Sair"
          >
            <IoExitOutline size={22} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}