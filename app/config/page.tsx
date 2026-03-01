"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import { usePrayer } from "@/store/usePrayer";
import toast from "react-hot-toast";
import DashboardActions from "@/components/DashboardActions";
import { IoSettingsSharp } from "react-icons/io5";
import { History, Edit3, Trash2 } from "lucide-react";

export default function ConfigPage() {
  const { is_auth } = useLogin();
  const { history, addTime, clearHistory } = usePrayer();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [editHours, setEditHours] = useState("");
  const [editMinutes, setEditMinutes] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !is_auth) {
      toast.error("Acesso negado. Por favor, faça login.");
      router.replace("/");
    }
  }, [is_auth, router, mounted]);

  const handleEditTime = () => {
    const h = parseInt(editHours) || 0;
    const m = parseInt(editMinutes) || 0;

    if (h === 0 && m === 0) {
      toast.error("Insira um valor para editar");
      return;
    }

    addTime(h, m, "editado");
    toast.success("Tempo editado com sucesso!");
    setEditHours("");
    setEditMinutes("");
  };

  if (!mounted || !is_auth) return null;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-start pt-24">
      <DashboardActions />

      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-3">
          <IoSettingsSharp className="text-gray-800 dark:text-white" size={28} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações do Sistema</h1>
        </div>
        
        {/* Seção de Edição */}
        <div className="bg-white dark:bg-[#0a0f18] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Edit3 size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Ajustar Tempo Total</h2>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Use valores negativos para subtrair tempo (ex: -1 hora e -30 minutos).
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Horas</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  className="w-24 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Minutos</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(e.target.value)}
                  className="w-24 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>
            <button
              onClick={handleEditTime}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-80 transition-all cursor-pointer"
            >
              Aplicar Ajuste
            </button>
          </div>
        </div>

        {/* Seção de Histórico */}
        <div className="bg-white dark:bg-[#0a0f18] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History size={20} className="text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Últimos Registros</h2>
            </div>
            <button 
              onClick={() => {
                if(confirm("Tem certeza que deseja limpar todo o histórico e zerar o contador?")) {
                  clearHistory();
                  toast.success("Sistema resetado");
                }
              }}
              className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium cursor-pointer"
            >
              <Trash2 size={16} /> Limpar Tudo
            </button>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-center py-8 text-gray-500 italic">Nenhum registro encontrado.</p>
            ) : (
              history.slice(0, 10).map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {item.hours}h {item.minutes !== 0 ? `e ${Math.abs(item.minutes)}m` : ""}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    item.type === 'adicionado' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {item.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}