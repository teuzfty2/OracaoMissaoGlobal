"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/store/useLogin";
import { usePrayer } from "@/store/usePrayer";
import toast from "react-hot-toast";
import DashboardActions from "@/components/DashboardActions";
import { History, Edit3, Trash2, Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConfigPage() {
  const { is_auth } = useLogin();
  const { history, addTime, clearHistory, removeHistoryItem } = usePrayer();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [editHours, setEditHours] = useState("");
  const [editMinutes, setEditMinutes] = useState("");

  // PAGINAÇÃO
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    return history.slice(start, end);
  }, [history, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [history, totalPages, page]);

  useEffect(() => setMounted(true), []);

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

  const handleDeleteItem = (id: string, hours: number, minutes: number) => {
    removeHistoryItem(id);
    toast.success(
      `Registro de ${hours}h ${minutes !== 0 ? `${Math.abs(minutes)}m` : ""} removido`,
    );
  };

  const confirmClearAll = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800">
            Tem certeza que deseja <b>zerar tudo</b>?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-1"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={() => {
                clearHistory();
                toast.dismiss(t.id);
                toast.success("Sistema resetado com sucesso");
                setPage(1);
              }}
              className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-1 font-bold"
            >
              <Check size={14} /> Confirmar
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" },
    );
  };

  if (!mounted || !is_auth) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 pb-12 px-6 overflow-x-hidden select-none">
      <DashboardActions />

      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl space-y-8"
      >
        <div className="text-center space-y-1">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase">
            Configurações  <span className="text-white/20">Sistema</span>
          </h1>
          <p className="text-sm md:text-base font-bold text-blue-400/60 tracking-[0.4em] uppercase">
            Gerenciamento de Dados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AJUSTAR TEMPO TOTAL */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Edit3 size={20} />
                  </div>
                  <h3 className="font-black text-sm text-white uppercase tracking-wider">
                    Ajustar Tempo Total
                  </h3>
                </div>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Use valores negativos para subtrair tempo do contador geral.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="- Horas"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-center text-xl font-black outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="- Minutos"
                    value={editMinutes}
                    onChange={(e) => {
                      let value = e.target.value;

                      const number = Number(value);

                      if (number > 59) {
                        toast("Máximo permitido é 59 minutos");
                        setEditMinutes("59");
                        return;
                      }

                      if (number < -59) {
                        toast("Máximo permitido é -59 minutos");
                        setEditMinutes("-59");
                        return;
                      }

                      setEditMinutes(value);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-center text-xl font-black outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleEditTime}
                  className="w-full py-5 bg-white text-black font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Aplicar Ajuste
                </button>
              </div>
            </div>
          </div>

          {/* HISTÓRICO */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-3">
                  <History size={20} />
                  <h3 className="font-black text-sm text-white uppercase tracking-wider">
                    Últimos Registros
                  </h3>
                </div>

                <button
                  onClick={confirmClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl"
                >
                  <Trash2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Zerar Tudo
                  </span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                    <Clock size={40} className="text-gray-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Nenhum registro encontrado
                    </p>
                  </div>
                ) : (
                  paginatedHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-5 rounded-3xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-black text-white">
                          {item.hours}h{" "}
                          {item.minutes !== 0
                            ? `${Math.abs(item.minutes)}m`
                            : ""}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(item.timestamp).toLocaleString("pt-BR")}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleDeleteItem(item.id, item.hours, item.minutes)
                        }
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="flex justify-center items-center gap-6 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-white/10 text-white rounded-xl disabled:opacity-30"
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-gray-400">
                    Página {page} de {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-white/10 text-white rounded-xl disabled:opacity-30"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
