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
    return new NextResponse("Not Found", { status: 404 });
  }

  // increment click count + last clicked time
  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: link.totalClicks + 1,
      lastClickedAt: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl, 302);
}
