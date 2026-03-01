import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.prayerLog.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar registro:", error);
    return Response.json(
      { error: "Erro ao deletar" },
      { status: 500 }
    );
  }
}