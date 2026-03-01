"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import toast from "react-hot-toast";
import DashboardActions from "@/components/DashboardActions";

export default function Dashboard() {
  const { is_auth, user } = useLogin();
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

  if (!mounted || !is_auth) return null;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      {/* Menu de ações expansível no canto direito */}
      <DashboardActions />

      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        </div>
        
        <div className="bg-white dark:bg-[#0a0f18] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-95 dark:bg-opacity-90">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Bem-vindo, {user?.nome}!
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Sua sessão está ativa e segura.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg">
            <p className="text-green-700 dark:text-green-400 text-sm">
              Acesso liberado. Você pode navegar pelas funcionalidades do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}