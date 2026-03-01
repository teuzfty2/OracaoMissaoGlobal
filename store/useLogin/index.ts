import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginRequest } from "./services";

export type User = {
  nome: string;
};

type LoginState = {
  user: User | null;
  is_auth: boolean;
  is_loading: boolean;
  error: string | null;

  login: (nome: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

export const useLogin = create<LoginState>()(
  persist(
    (set) => ({
      user: null,
      is_auth: false,
      is_loading: false,
      error: null,

      login: async (nome, senha) => {
        try {
          set({ is_loading: true, error: null });

          const data = await loginRequest(nome, senha);

          if (data.success) {
            set({
              user: data.user,
              is_auth: true,
              is_loading: false,
            });
            return true;
          }
          
          set({ is_loading: false, error: "Falha na autenticação" });
          return false;
        } catch (err: any) {
          set({
            error: err.message || "Usuário ou senha inválidos",
            is_loading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          is_auth: false,
        });
      },
    }),
    {
      name: "useLoginStore",
    }
  )
);