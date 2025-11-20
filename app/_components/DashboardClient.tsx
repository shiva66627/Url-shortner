"use client";

import React, { useEffect, useState } from "react";

type Link = {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: string | null;
  createdAt: string;
};

export default function DashboardClient() {
  const [links, setLinks] = useState<Link[]>([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [filter, setFilter] = useState("");
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

  async function createLink(e: React.FormEvent) {
    e.preventDefault();
    if (!targetUrl.trim()) {
      alert("Please enter a URL");
      return;
    }

    setLoading(true);
    setLatestLink(null);

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ targetUrl, customCode: customCode.trim() || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || "Failed to create link");
      return;
    }

    const created = await res.json();
    const fullShortUrl = `${window.location.origin}/${created.code}`;

    setLatestLink(fullShortUrl);
    setTargetUrl("");
    setCustomCode("");
    await load();
  }

  async function deleteLink(code: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    await fetch(`/api/links?code=${code}`, {
      method: "DELETE",
    });
    await load();
  }

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(filter.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">TinyLink Dashboard</h1>
        <p className="text-gray-500">Manage your links and track their performance</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 transition-all hover:shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">✨</span> Create New Link
        </h2>
        <form onSubmit={createLink} className="flex flex-col gap-4 md:flex-row items-stretch">
          <div className="flex-1">
            <input
              className="w-full border border-gray-200 bg-gray-50 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter long URL (e.g., https://example.com)"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <input
              className="w-full border border-gray-200 bg-gray-50 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Custom Code (Optional)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? "Creating..." : "Shorten It!"}
          </button>
        </form>

        {latestLink && (
          <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-green-800 uppercase tracking-wider">Success!</span>
                <a href={latestLink} target="_blank" className="text-green-700 font-medium hover:underline truncate">
                  {latestLink}
                </a>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(latestLink);
                alert("Copied to clipboard!");
              }}
              className="px-4 py-2 bg-white text-green-700 border border-green-200 font-medium rounded-lg hover:bg-green-50 transition-colors shadow-sm"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Your Links</h3>
        <div className="relative w-full max-w-md">
          <input
            className="w-full border border-gray-200 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            placeholder="Search links..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Short Code</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Target URL</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Clicks</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Clicked</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-4">
                    <a href={`/${link.code}`} target="_blank" className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                      /{link.code}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${link.targetUrl}&sz=32`}
                        alt=""
                        className="w-4 h-4 rounded-sm opacity-70"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                      <span className="truncate max-w-xs text-gray-600 block" title={link.targetUrl}>
                        {link.targetUrl}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${link.totalClicks > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {link.totalClicks}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {link.lastClickedAt ? (
                      <span className="font-medium text-gray-700">
                        {new Date(link.lastClickedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        <span className="text-gray-400 mx-1">at</span>
                        {new Date(link.lastClickedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-gray-300 italic">Never</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/code/${link.code}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Stats"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => deleteLink(link.code)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Link"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-lg font-medium">No links found</p>
                      <p className="text-sm">Create your first short link above!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
