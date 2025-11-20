import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { targetUrl } = body;

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Auto-generate 6 character code
  const code = Math.random().toString(36).substring(2, 8);

  const newLink = await prisma.link.create({
    data: {
      code,
      targetUrl,
    },
  });

  return NextResponse.json(newLink);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  await prisma.link.delete({
    where: { code },
  });

  return NextResponse.json({ ok: true });
}
