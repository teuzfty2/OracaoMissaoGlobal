import axios, { AxiosError } from "axios";

export async function loginRequest(nome: string, senha: string) {
  try {
    const response = await axios.post("/api/login", {
      nome,
      senha,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Erro ao conectar com o servidor");
  }
}