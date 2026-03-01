import { NextResponse } from "next/server";

const users = [
  { nome: "pedroMissao", senha: "pedroMissao123" },
  { nome: "pastorMissao", senha: "pastorMissao123" },
  { nome: "painelMissao", senha: "painelMissao123" },
];

export async function POST(request: Request) {
  try {
    const { nome, senha } = await request.json();

    const user = users.find(
      (u) => u.nome === nome && u.senha === senha
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário ou senha incorretos" },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: { nome: user.nome } 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}