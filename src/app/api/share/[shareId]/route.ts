import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;

  const note = await prisma.note.findFirst({
    where: { shareId, isPublic: true },
    select: {
      id: true,
      title: true,
      content: true,
      language: true,
      type: true,
      images: true,
      createdAt: true,
      user: {
        select: { name: true },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}
