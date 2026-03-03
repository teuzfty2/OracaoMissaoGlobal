import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, WithId, Document } from "mongodb";

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

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const { id } = params;

        const log = await db
            .collection<PrayerLog>("prayer_logs")
            .findOne({ _id: new ObjectId(id) });

        if (!log) {
            return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
        }

        return NextResponse.json(formatLog(log));
    } catch (error: any) {
        console.error("Erro GET log by id:", error);
        return NextResponse.json({ error: "Erro ao buscar registro", details: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const { id } = params;
        const body = await req.json();
        const { hours, minutes, type } = body;

        const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

        const result = await db
            .collection("prayer_logs")
            .updateOne({ _id: new ObjectId(id) }, { $set: { minutes: totalMinutes, type } });

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erro PUT log:", error);
        return NextResponse.json({ error: "Erro ao atualizar registro", details: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const { id } = params;

        const result = await db
            .collection("prayer_logs")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erro ao deletar registro:", error);
        return NextResponse.json({ error: "Erro ao deletar", details: error.message }, { status: 500 });
    }
}
