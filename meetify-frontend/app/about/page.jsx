import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-blue-900">
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 leading-tight">
            Meetify — Seamless video meetings, built for speed
          </h1>
          <p className="mt-4 text-blue-700 text-base md:text-lg max-w-xl">
            A lightweight, secure video conferencing app in active development.
            Create or join meetings in one click, share video and audio, and
            collaborate without friction.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/createmeeting" className="w-full sm:w-auto">
              <button className="w-full cursor-pointer sm:w-auto inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4-2v6l-4-2M3 7h12v10H3z"
                  />
                </svg>
                Create a meeting
              </button>
            </Link>
            <Link href="/section" className="w-full sm:w-auto">
              <button className="w-full cursor-pointer sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 font-medium px-5 py-3 rounded-lg shadow-sm hover:shadow-md">
                Join a meeting
              </button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-600">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                β
              </span>
              In active development
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                🔒
              </span>
              Secure by default
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                ⚡
              </span>
              Fast & lightweight
            </div>
          </div>
        </div>

        {/* Illustration / quick info */}
        <div className="w-full md:w-1/3 bg-white/70 border border-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-blue-500">Current stage</p>
              <p className="text-lg font-semibold text-blue-700">
                Development Beta
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-500">Active</p>
              <p className="text-lg font-semibold text-green-600">Stable</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-blue-600">
            <p>• One-click meeting creation</p>
            <p>• Per-peer WebRTC connections</p>
            <p>• Chat, mute/unmute, and camera controls</p>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Why Meetify?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-blue-700">Low latency</h3>
            <p className="mt-2 text-blue-600 text-sm">
              Optimized peer connections and minimal signaling for faster joins.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7h18M3 12h18M3 17h18"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-blue-700">Simple UI</h3>
            <p className="mt-2 text-blue-600 text-sm">
              A clean, focused interface that keeps meetings distraction-free.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h6m-6 4h10"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-blue-700">Privacy-first</h3>
            <p className="mt-2 text-blue-600 text-sm">
              We minimize data collection and let you control camera & mic
              permissions.
            </p>
          </div>
        </div>
      </section>

      {/* Team & Stats */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-blue-800">Meet the team</h3>
              <p className="mt-2 text-blue-600 text-sm max-w-xl">
                Small, focused team building Meetify. Contributions welcome — open
                source planned.
              </p>
            </div>

            <div className="flex items-center gap-4">
             
              <div className="text-right">
                <p className="text-sm text-blue-500">Core contributor</p>
                <p className="font-semibold text-blue-700">1 people</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-500">Meetings created</p>
              <p className="font-bold text-blue-700 text-lg">1.2K+</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-500">Avg duration</p>
              <p className="font-bold text-blue-700 text-lg">28m</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-500">Active users</p>
              <p className="font-bold text-blue-700 text-lg">800+</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-500">Uptime</p>
              <p className="font-bold text-blue-700 text-lg">99.9%</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">FAQ</h2>
        <div className="space-y-3">
          <details className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <summary className="font-semibold text-blue-700 cursor-pointer">
              Is Meetify secure?
            </summary>
            <p className="mt-2 text-blue-600 text-sm">
              Meetify uses peer-to-peer WebRTC connections and minimal signaling.
              No recording is done by default.
            </p>
          </details>

          <details className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <summary className="font-semibold text-blue-700 cursor-pointer">
              Can I host many participants?
            </summary>
            <p className="mt-2 text-blue-600 text-sm">
              Current implementation uses per-peer connections. Performance
              depends on network and device. We're working on SFU support.
            </p>
          </details>

          <details className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <summary className="font-semibold text-blue-700 cursor-pointer">
              Where can I give feedback?
            </summary>
            <p className="mt-2 text-blue-600 text-sm">
              Open an issue or join the project discussions. Link will be
              provided soon on the repository.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-blue-100 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-600">
            © {new Date().getFullYear()} Meetify — In development
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-blue-600 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-blue-600 hover:underline"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
