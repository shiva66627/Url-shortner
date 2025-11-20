import prisma from "@/lib/prisma";
import Link from "next/link";

type RouteParams = {
  params: Promise<{ code: string }>;
};

export default async function CodePage(props: RouteParams) {
  const params = await props.params;
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Not Found</h1>
        <p className="text-gray-600 mb-8">This short link does not exist.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-black">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border">
        <h1 className="text-2xl font-bold mb-6 border-b pb-4">Link Stats</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Short Code</label>
            <div className="text-lg font-mono">{link.code}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Target URL</label>
            <div className="text-lg break-all text-blue-600">
              <a href={link.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {link.targetUrl}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <label className="block text-sm font-medium text-gray-500">Total Clicks</label>
              <div className="text-3xl font-bold mt-1">{link.totalClicks}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <label className="block text-sm font-medium text-gray-500">Last Clicked</label>
              <div className="text-lg mt-1">
                {link.lastClickedAt
                  ? new Date(link.lastClickedAt).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>

          <div className="pt-4 text-sm text-gray-400">
            Created on {new Date(link.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
