import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { WithId, Document } from "mongodb";

interface PrayerLog extends WithId<Document> {
  minutes: number;
  type: string;
  createdAt: Date;
}

function formatLog(log: PrayerLog) {
  return {
    id: log._id.toHexString(),
    hours: Math.floor(log.minutes / 60),
    minutes: log.minutes % 60,
    type: log.type,
    timestamp: new Date(log.createdAt).getTime(),
  };
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const logs = await db
      .collection<PrayerLog>("prayer_logs")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
      
    return NextResponse.json(logs.map(formatLog));
  } catch (error: any) {
    console.error("Erro GET logs:", error);
    return NextResponse.json({ error: "Erro ao buscar registros", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await req.json();
    const { hours, minutes, type } = body;
    
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    const newLogData = {
      minutes: totalMinutes,
      type: type || "adicionado",
      createdAt: new Date(),
    };

    const result = await db.collection("prayer_logs").insertOne(newLogData);
    
    const newLog = {
      ...newLogData,
      _id: result.insertedId,
    } as PrayerLog;


    return NextResponse.json(formatLog(newLog));
  } catch (error: any) {
    console.error("Erro POST logs:", error);
    return NextResponse.json({ error: "Erro ao criar registro", details: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("prayer_logs").deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro DELETE all logs:", error);
    return NextResponse.json({ error: "Erro ao limpar registros", details: error.message }, { status: 500 });
  }
}
