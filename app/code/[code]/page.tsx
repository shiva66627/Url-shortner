import prisma from "@/lib/prisma";

export default async function CodePage({ params }: any) {
  const code = params.code;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Not Found</h1>
        <p>This short link does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Stats for: {code}</h1>

      <p className="text-lg">
        <strong>Target URL:</strong> {link.targetUrl}
      </p>

      <p className="text-lg mt-2">
        <strong>Total Clicks:</strong> {link.totalClicks}
      </p>

      <p className="text-lg mt-2">
        <strong>Last Clicked:</strong>{" "}
        {link.lastClickedAt
          ? new Date(link.lastClickedAt).toLocaleString()
          : "Never"}
      </p>
    </div>
  );
}
