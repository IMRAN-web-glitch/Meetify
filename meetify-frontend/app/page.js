"use client";
import React, { useEffect } from "react";
import GoogleIcon from "@/public/Googleicon";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
const { data: session } = useSession();

// useEffect(() => {
//   if (session) {
//     // If the user is authenticated, redirect to the dashboard
//     window.location.href = "/";
//   }
// }, [])
const handlecheck = () => {
  if (session) {
      // ✅ user logged in → go to section page
      router.push("/section");
    } else {
      // ❌ no session → go to sign in
      alert("Please sign in to continue.");
      // or: router.push("/auth/signin")
    }
  
}

  return (
    <div className="flex flex-col justify-center items-center bg-white px-5">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8 px-4 py-12 md:py-5">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-start gap-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight drop-shadow-sm">
            Video Conferencing <br className="hidden md:block" />
            <span className="text-blue-500">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Connect and communicate with anyone, anywhere, anytime.
          </p>
          
            <button onClick={handlecheck} className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg mt-2 w-full md:w-auto">
              Start Meeting
            </button>
          
          <img
            src="/people.png"
            className="h-52 md:h-50 mt-6 md:mt-0 mx-auto md:mx-auto"
            alt="People video conferencing"
          />
        </div>
        {/* Right Section (Sign In Card) */}
        {!session &&
        <div className="flex-1 flex justify-center">
          <div className="bg-white border-2 border-blue-100 rounded-3xl shadow-xl px-8 py-10 w-full max-w-md flex flex-col gap-8 items-center">
            <h2 className="text-3xl font-bold text-blue-700 text-center">Sign In</h2>
            <button onClick={() => signIn()} className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 transition rounded-lg shadow px-6 py-3 text-base font-medium text-blue-700 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
            <div className="w-full border-t border-blue-100 my-2"></div>
            <p className="text-gray-500 text-center text-sm">
              Secure, fast, and easy meetings with <span className="font-semibold text-blue-600">Meetify</span>
            </p>
          </div>
        </div>}
        {session && <div className="flex-1 flex justify-center">
          <div className="bg-white border-2 border-blue-100 rounded-3xl shadow-xl px-8 py-10 w-full max-w-md flex flex-col gap-8 items-center">
            <h2 className="text-3xl font-bold text-blue-700 text-center">Welcome, {session.user.name}</h2>
            <button onClick={() => signOut()} className="flex cursor-pointer items-center gap-3 bg-red-50 hover:bg-red-100 transition rounded-lg shadow px-6 py-3 text-base font-medium text-red-700 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400">
              <span>Sign Out</span>
            </button>
            <div className="w-full border-t border-blue-100 my-2"></div>
            <p className="text-gray-500 text-center text-sm">
              You are signed in with <span className="font-semibold text-blue-600">Meetify</span>
            </p>
          </div>
        </div>}
        
      </div>
    </div>
  );
}
