import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new NextResponse("Not Found", { status: 404 });
  }

  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: link.totalClicks + 1,
      lastClickedAt: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl, 302);
}
