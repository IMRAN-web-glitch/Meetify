"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function createMeeting() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_Backend}/create-meeting`);
    const data = await res.json();
    const meetingId = data.meetingId;
    router.push(`/meeting/${meetingId}`);
  }

  return (
    <div className="md:mt-10 mt-30 flex flex-col justify-center items-center bg-gradient-to-br  px-10">
      <div className="w-full max-w-lg flex flex-col items-center gap-3 py-16 md:py-18  rounded-3xl  bg-white border-2 border-blue-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 text-center mb-2 tracking-tight">
          Create a New Meeting
        </h1>
        <p className="text-lg md:text-xl text-blue-600 text-center mb-4">
          Instantly start a secure video meeting with just one click.
        </p>
        <button
          onClick={createMeeting}
          className="bg-blue-600 w-[70%] cursor-pointer hover:bg-blue-700 transition text-white font-bold py-3 px-8 rounded-xl  text-lg   ring-2 ring-blue-200 hover:ring-blue-400"
        >
          Create Meeting
        </button>
       
      </div>
    </div>
  );
}
