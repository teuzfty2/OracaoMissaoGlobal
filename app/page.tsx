"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Store
import { useLogin } from "@/store/useLogin";
import { customizeSystem } from "@/store/customizeSystem";

// Hooks
import {
  backgroundShapes,
  containerVariants,
  itemVariants,
  shapeVariants,
} from "@/store/animations/variantes";

// Components
import LoginSwitchTheme from "@/html/switch/switchTheme";

// Icons
import { FaUser, FaLock } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { RiLoginCircleLine } from "react-icons/ri";

export default function Home() {
  const router = useRouter();
  const { login: loginStore, is_auth, is_loading } = useLogin();

  const [form, setForm] = useState({ login: "", senha: "" });

  // Refs para navegação entre inputs
  const inputRef = {
    login: useRef<HTMLInputElement>(null),
    senha: useRef<HTMLInputElement>(null),
  };

  // Redireciona se já estiver logado
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

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loginFocused, setLoginFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const formProgress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (form.login && form.senha) {
      handleLogin();
    } else if (form.login) {
      inputRef.senha.current?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="absolute inset-0 overflow-hidden">
        {backgroundShapes.map((shape: any, i: any) => (
          <motion.div
            key={i}
            custom={i}
            initial="initial"
            animate="animate"
            variants={shapeVariants}
            className="absolute rounded-full bg-black dark:bg-white filter blur-3xl"
            style={{
              width: shape.width,
              height: shape.height,
              left: shape.left,
              top: shape.top,
              opacity: shape.opacity,
            }}
          />
        ))}
        <div className="absolute top-4 right-4 z-50">
          <LoginSwitchTheme />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white dark:bg-[#0a0f18] rounded-2xl shadow-xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-95 dark:bg-opacity-90"
        >
          <div className="bg-black dark:bg-white h-2 w-full"></div>

          <form className="p-8" onSubmit={(e) => e.preventDefault()}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center select-none">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bem-vindo</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Entre com suas credenciais</p>
              </motion.div>

              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <div className={`relative border dark:border-gray-700 rounded-lg duration-300 ${loginFocused || form.login ? "border-black dark:border-white" : "border-gray-300"}`}>
                    <label className={`absolute duration-300 ${loginFocused || form.login ? "text-xs -translate-y-2.5 translate-x-2 bg-white dark:bg-[#0a0f18] px-1" : "text-sm translate-y-3 translate-x-10 text-gray-500"}`}>
                      Login
                    </label>
                    <div className="flex items-center">
                      <div className="pl-4 py-3 text-gray-500 dark:text-white"><FaUser /></div>
                      <input
                        type="text"
                        ref={inputRef.login}
                        value={form.login}
                        onFocus={() => setLoginFocused(true)}
                        onBlur={() => setLoginFocused(false)}
                        onChange={(e) => setForm({ ...form, login: e.target.value })}
                        onKeyDown={formProgress}
                        className="w-full p-3 outline-none bg-transparent text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className={`relative border dark:border-gray-700 rounded-lg duration-300 ${passwordFocused || form.senha ? "border-black dark:border-white" : "border-gray-300"}`}>
                    <label className={`absolute duration-300 ${passwordFocused || form.senha ? "text-xs -translate-y-2.5 translate-x-2 bg-white dark:bg-[#0a0f18] px-1" : "text-sm translate-y-3 translate-x-10 text-gray-500"}`}>
                      Senha
                    </label>
                    <div className="flex items-center">
                      <div className="pl-4 py-3 text-gray-500 dark:text-white"><FaLock /></div>
                      <input
                        ref={inputRef.senha}
                        type={isPasswordVisible ? "text" : "password"}
                        value={form.senha}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        onChange={(e) => setForm({ ...form, senha: e.target.value })}
                        onKeyDown={formProgress}
                        className="w-full p-3 outline-none bg-transparent text-gray-800 dark:text-white"
                      />
                      <button type="button" onClick={() => setPasswordVisible(!isPasswordVisible)} className="pr-4 text-gray-500 hover:scale-105 hover:text-blue-500 transform duration-300">
                        {isPasswordVisible ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleLogin}
                  disabled={is_loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {is_loading ? "Carregando..." : "Entrar"}
                  <RiLoginCircleLine size={20} />
                </motion.button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}