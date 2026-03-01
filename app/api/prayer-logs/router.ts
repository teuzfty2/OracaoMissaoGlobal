import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Helper para formatar resposta
function formatLog(log: any) {
  return {
    id: log.id,
    hours: Math.floor(log.minutes / 60),
    minutes: log.minutes % 60,
    type: log.type,
    timestamp: new Date(log.createdAt).getTime(),
  };
}

// GET - Buscar todos os logs
export async function GET() {
  try {
    const logs = await prisma.prayerLog.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formatted = logs.map(formatLog);

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar registros" },
      { status: 500 }
    );
  }
}

// POST - Criar novo log
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hours, minutes } = body;

    const totalMinutes = hours * 60 + minutes;

    const newLog = await prisma.prayerLog.create({
      data: {
        userId: "TEMP_USER", // depois ligamos com auth real
        minutes: totalMinutes,
        type: "adicionado",
      },
    });

    return NextResponse.json(formatLog(newLog));
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar registro" },
      { status: 500 }
    );
  }
}