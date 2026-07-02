import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.note.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const shareId = existing.shareId || nanoid(10);

  const note = await prisma.note.update({
    where: { id },
    data: {
      shareId,
      isPublic: true,
    },
  });

  return NextResponse.json({ shareId: note.shareId });
}
