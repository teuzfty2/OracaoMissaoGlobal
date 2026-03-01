"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import LoginSwitchTheme from "@/html/switch/switchTheme";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { ChevronLeft, Home } from "lucide-react";

export default function DashboardActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLogin();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    /* Container pai agora não captura eventos (pointer-events-none) */
    <div className="fixed top-6 right-0 z-50 flex items-center pointer-events-none">
      <motion.div
        /* Apenas o menu em si captura eventos (pointer-events-auto) */
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={toggleMenu}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : "calc(100% - 40px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex items-center bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 p-2 rounded-l-2xl shadow-2xl cursor-pointer pointer-events-auto"
      >
        {/* Ícone de Gatilho (Seta) */}
        <div className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={24} />
          </motion.div>
        </div>

        {/* Conteúdo que aparece ao expandir */}
        <div className="flex items-center gap-3 pr-2" onClick={(e) => e.stopPropagation()}>
          <LoginSwitchTheme />
          
          {/* Botão Home ou Config */}
          {pathname === "/config" ? (
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 flex items-center justify-center bg-blue-500/80 hover:bg-blue-600 text-white rounded-full transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
              title="Dashboard"
            >
              <Home size={20} />
            </button>
          ) : (
            <button 
              onClick={() => router.push("/config")}
              className="w-10 h-10 flex items-center justify-center bg-gray-500/80 hover:bg-gray-600 text-white rounded-full transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
              title="Configurações"
            >
              <IoSettingsSharp size={20} />
            </button>
          )}

          <button 
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-10 h-10 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
            title="Sair"
          >
            <MdOutlinePowerSettingsNew size={22} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}