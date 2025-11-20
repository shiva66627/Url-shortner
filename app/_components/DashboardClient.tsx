"use client";

import React, { useEffect, useState } from "react";

export default function DashboardClient() {
  const [links, setLinks] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestLink, setLatestLink] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createLink(e: any) {
    e.preventDefault();
    if (!targetUrl.trim()) {
      alert("Please enter a URL");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ targetUrl }),
    });

    setLoading(false);

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || "Failed to create link");
      return;
    }

    const created = await res.json();
    const fullShortUrl = `${window.location.origin}/${created.code}`;

    setLatestLink(fullShortUrl);  // show latest short link
    setTargetUrl("");
    await load();
  }

  async function deleteLink(code: string) {
    await fetch(`/api/links?code=${code}`, {
      method: "DELETE",
    });
    await load();
  }

  return (
    <div className="p-4 max-w-xl">
      {/* Create Link Form */}
      <form onSubmit={createLink} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Enter long URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />

        <button
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded"
        >
          {loading ? "Creating..." : "Create Short Link"}
        </button>
      </form>

      {/* Short Link Preview */}
      {latestLink && (
        <div className="p-4 border rounded bg-green-50 mt-6 mb-4">
          <h2 className="font-semibold mb-2">Short Link Created!</h2>

          <div className="flex items-center gap-3">
            <a
              href={latestLink}
              className="text-blue-600 underline"
              target="_blank"
            >
              {latestLink}
            </a>

            <button
              onClick={() => navigator.clipboard.writeText(latestLink)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Copy
            </button>

            <a
              href={latestLink}
              target="_blank"
              className="px-3 py-1 bg-black text-white rounded"
            >
              Open
            </a>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="mt-6 space-y-2">
        {links.map((x: any) => (
          <div
            key={x.code}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <a
                href={`/${x.code}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                {x.code}
              </a>{" "}
              → {x.targetUrl}
              <div className="text-sm text-gray-600">
                Clicks: {x.totalClicks}
              </div>
            </div>

            <button
              className="px-2 py-1 bg-red-600 text-white rounded"
              onClick={() => deleteLink(x.code)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
