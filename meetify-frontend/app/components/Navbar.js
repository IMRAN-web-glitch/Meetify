"use client"
import React, { useState } from 'react'

const handleExitMeeting = (e, href) => {
  if (window.location.pathname.startsWith("/meeting/")) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to exit the meeting?")) {
      try {
        if (window.localStreamRef && window.localStreamRef.getTracks) {
          window.localStreamRef.getTracks().forEach(track => track.stop());
        }
      } catch { }
      try {
        if (window.pcRef && window.pcRef.close) {
          window.pcRef.close();
        }
      } catch { }
      try {
        if (window.socketRef && window.socketRef.disconnect) {
          window.socketRef.disconnect();
        }
      } catch { }
      window.location.href = href;
    }
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full shadow m-auto flex items-center justify-between px-5 py-1 relative z-50">
      {/* Logo */}
      <a href="/" onClick={e => handleExitMeeting(e, "/")} className="flex items-center gap-2">
        <img src="/logo2.png" alt="Logo" className="h-14 w-auto" />
      </a>
      {/* Desktop Links */}
      <ul className="hidden md:flex gap-5 font-semibold items-center md:mr-5">
        <li>
          <a
            href="/"
            onClick={e => handleExitMeeting(e, "/")}
            className="transition hover:scale-105 px-3 py-1 rounded hover:bg-opacity-20"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/about"
            onClick={e => handleExitMeeting(e, "/about")}
            className="transition hover:scale-105 px-3 py-1 rounded hover:bg-opacity-20"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/mohd-imran-2ab7a5279/"
            onClick={e => handleExitMeeting(e, "https://www.linkedin.com/in/mohd-imran-2ab7a5279/")}
            className="transition hover:scale-105 px-3 py-1 rounded hover:bg-opacity-20"
          >
            Contact
          </a>
        </li>
        <li>
          <a
            href="https://github.com/IMRAN-web-glitch"
            onClick={e => { setMenuOpen(false); handleExitMeeting(e, "https://github.com/IMRAN-web-glitch"); }}
            className="block w-full py-2 px-2 rounded hover:bg-opacity-20 transition"
          >
            Github
          </a>
        </li>
      </ul>
      {/* Hamburger */}
      <button
        className="md:hidden p-2 rounded focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-opacity-95 backdrop-blur-md shadow-md md:hidden animate-fade-in">
          <ul className="flex flex-col gap-2 py-4 px-6 font-semibold">
            <li>
              <a
                href="/"
                onClick={e => { setMenuOpen(false); handleExitMeeting(e, "/"); }}
                className="block w-full py-2 px-2 rounded hover:bg-opacity-20 transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={e => { setMenuOpen(false); handleExitMeeting(e, "/about"); }}
                className="block w-full py-2 px-2 rounded hover:bg-opacity-20 transition"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/mohd-imran-2ab7a5279/"
                onClick={e => { setMenuOpen(false); handleExitMeeting(e, "https://www.linkedin.com/in/mohd-imran-2ab7a5279/"); }}
                className="block w-full py-2 px-2 rounded hover:bg-opacity-20 transition"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="https://github.com/IMRAN-web-glitch"
                onClick={e => { setMenuOpen(false); handleExitMeeting(e, "https://github.com/IMRAN-web-glitch"); }}
                className="block w-full py-2 px-2 rounded hover:bg-opacity-20 transition"
              >
                Github
              </a>
            </li>
          </ul>
        </div>
      )}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.18s ease;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
