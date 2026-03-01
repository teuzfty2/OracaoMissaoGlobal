"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { is_auth, user, logout } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!is_auth) {
      toast.error("Acesso negado. Por favor, faça login.");
      router.push("/");
    }
  }, [is_auth, router]);

  if (!is_auth) return null;

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Bem-vindo, {user?.nome}!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Seu acesso foi liberado com sucesso. Esta é a área restrita do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}