import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  try {
    await prisma.link.delete({
      where: { code },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
