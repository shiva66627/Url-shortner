import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, customCode } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let code = customCode;

    if (code) {
      // Check if custom code exists
      const existing = await prisma.link.findUnique({
        where: { code },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Code already in use" },
          { status: 409 }
        );
      }
    } else {
      // Auto-generate 6 character code
      code = Math.random().toString(36).substring(2, 8);

      // Ensure uniqueness (simple retry logic could be added here, but for now relying on probability)
      // In a production app, we'd want to retry or check existence.
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        // Fallback retry once
        code = Math.random().toString(36).substring(2, 8);
      }
    }

    const newLink = await prisma.link.create({
      data: {
        code,
        targetUrl,
      },
    });

    return NextResponse.json(newLink);
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
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
