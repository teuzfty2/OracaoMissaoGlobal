"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Store
import { useLogin } from "@/store/useLogin";

// Hooks
import { containerVariants, itemVariants } from "@/store/animations/variantes";

// Icons
import { FaUser, FaLock } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { RiLoginCircleLine } from "react-icons/ri";

export default function Home() {
  const router = useRouter();
  const { login: loginStore, is_auth, is_loading } = useLogin();

  const [form, setForm] = useState({ login: "", senha: "" });
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const inputRef = {
    login: useRef<HTMLInputElement>(null),
    senha: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (is_auth) {
      router.push("/dashboard");
    }
  }, [is_auth, router]);

  const handleLogin = async () => {
    if (!form.login || !form.senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    const success = await loginStore(form.login, form.senha);

    if (success) {
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } else {
      toast.error("Usuário ou senha incorretos");
    }
  };

  const formProgress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action?: () => void,
    nextRef?: React.RefObject<HTMLInputElement>,
  ) => {
    if (e.key !== "Enter") return;

    if (action) {
      action();
    } else if (nextRef?.current) {
      nextRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen w-full select-none flex flex-col items-center justify-center p-6">
      {/* Título Monumental */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1 mb-12"
      >
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase">
          Acesso de <span className="text-white/20">Login</span>
        </h1>
        <p className="text-sm md:text-base font-bold text-blue-400/60 tracking-[0.4em] uppercase">
          Contagem de Oração
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-[1.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl"
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <div className="space-y-6">
              {/* Campo Login */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[12px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                  <FaUser size={15} /> Usuário
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    ref={inputRef.login}
                    value={form.login}
                    onChange={(e) =>
                      setForm({ ...form, login: e.target.value })
                    }
                    onKeyDown={formProgress}
                    placeholder="Seu usuário"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/10"
                  />
                </div>
              </motion.div>

              {/* Campo Senha */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[12px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                  <FaLock size={15} /> Senha
                </label>
                <div className="relative group">
                  <input
                    ref={inputRef.senha}
                    type={isPasswordVisible ? "text" : "password"}
                    value={form.senha}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
                    onKeyDown={formProgress}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!isPasswordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    {isPasswordVisible ? (
                      <VscEyeClosed size={22} />
                    ) : (
                      <VscEye size={22} />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Botão Entrar */}
              <motion.button
                variants={itemVariants}
                onClick={handleLogin}
                disabled={is_loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white text-black font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:opacity-90 cursor-pointer uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {is_loading ? "Autenticando..." : "Entrar no Sistema"}
                <RiLoginCircleLine size={20} />
              </motion.button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
