import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ code: string }>;
};

export async function GET(
  req: NextRequest,
  props: RouteParams
) {
  const params = await props.params;
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
  props: RouteParams
) {
  const params = await props.params;
  const { code } = params;

  await prisma.link.delete({
    where: { code },
  });

  return NextResponse.json({ ok: true });
}
