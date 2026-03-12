"use client";

import Link from "next/link";

export default function CallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f7fb] p-8">
      <h1 className="text-xl font-semibold text-gray-900">Login cancelled</h1>
      <p className="text-center text-sm text-gray-700">
        You cancelled the authentication flow. You can try again from the home page.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#2563eb] px-4 py-2 text-white hover:bg-[#1e40af]"
      >
        Back to Home
      </Link>
    </div>
  );
}
