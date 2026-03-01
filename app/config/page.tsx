"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import toast from "react-hot-toast";
import DashboardActions from "@/components/DashboardActions";
import { IoSettingsSharp } from "react-icons/io5";

export default function ConfigPage() {
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

  if (!mounted || !is_auth) return null;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <DashboardActions />

      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <IoSettingsSharp className="text-gray-800 dark:text-white" size={28} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações</h1>
        </div>
        
        <div className="bg-white dark:bg-[#0a0f18] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-95 dark:bg-opacity-90">
          <div className="space-y-6">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Preferências do Sistema</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie como o sistema se comporta para você.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <p className="font-medium text-gray-700 dark:text-gray-200">Notificações</p>
                <p className="text-xs text-gray-500 mt-1">Ative ou desative alertas do sistema.</p>
                <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400">Configurar</button>
              </div>
              
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <p className="font-medium text-gray-700 dark:text-gray-200">Segurança</p>
                <p className="text-xs text-gray-500 mt-1">Altere sua senha ou gerencie acessos.</p>
                <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400">Gerenciar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}