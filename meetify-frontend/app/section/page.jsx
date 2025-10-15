"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Section = () => {
    const router = useRouter();
    const [meetingCode, setMeetingCode] = useState('');
    const handleInputChange = (e) => setMeetingCode(e.target.value);

    const validateMeetingCode = async () => {
        const res = await fetch(`${process.env.Backend}/meeting/ + meetingCode`);
        const data = await res.json();
        if (!data.valid) {
            alert("Invalid meeting code. Please try again.");
            return false;
        }
        return true;
    };

    const handleJoin = async () => {
        const isValid = await validateMeetingCode();
        if (isValid) {
            router.push(`${process.env.Backend}/meeting/${meetingCode}`);
        }
    };

    return (
        <div className="max-md:min-h-screen h-[88.4vh] flex flex-col justify-start  items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
            <div className="w-[60vw] flex flex-col items-center gap-15 py-12 md:py-13 mt-20 rounded-3xl shadow-2xl bg-white border-2 border-blue-100">
                <h1 className="font-extrabold text-3xl md:text-4xl text-blue-700 text-center mb-2 tracking-tight drop-shadow">
                    Start or Join a Meeting
                </h1>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                    <Link href='/createmeeting' className="w-full md:w-auto">
                        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white font-bold px-6 py-3 rounded-xl shadow-lg w-full md:w-auto ring-2 ring-blue-200 hover:ring-blue-400">
                            {/* SVG icon for meeting */}
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <rect x="3" y="7" width="13" height="10" rx="2" stroke="currentColor" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11l4-2v6l-4-2" />
                            </svg>
                            <span>Create a new meeting</span>
                        </button>
                    </Link>
                    <span className="font-bold text-lg text-blue-500">OR</span>
                    <div className="flex gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            onChange={handleInputChange}
                            placeholder="Enter meeting code"
                            className="border-2 border-blue-200 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 bg-blue-50"
                        />
                        <button
                            onClick={handleJoin}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl shadow ring-2 ring-blue-200 hover:ring-blue-400 transition w-full md:w-auto"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section;
