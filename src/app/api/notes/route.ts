import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, language, type, images, isPublic } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const shareId = nanoid(10);

  const note = await prisma.note.create({
    data: {
      title,
      content: content || "",
      language: language || "plaintext",
      type: type || "code",
      images: images || [],
      shareId,
      isPublic: isPublic ?? true,
      userId: session.user.id,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
