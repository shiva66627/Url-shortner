"use client";

import DashboardClient from "./_components/DashboardClient";

export default function Home() {
  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">TinyLink Dashboard</h1>
      <DashboardClient />
    </div>
  );
}
