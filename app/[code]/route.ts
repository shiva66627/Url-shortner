import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { code: string } }
) {
  const { code } = context.params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Update click count
  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: link.totalClicks + 1,
      lastClickedAt: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl);
}
