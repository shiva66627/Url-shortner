import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RedirectPage(props: any) {
  // Next.js passes params as a Promise
  const { code } = await props.params;

  if (!code) {
    return <h1>Invalid short code</h1>;
  }

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return <h1>404 - Link not found</h1>;
  }

  // Update click count
  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: link.totalClicks + 1,
      lastClickedAt: new Date(),
    },
  });

  // Redirect to the original URL
  redirect(link.targetUrl);
}
