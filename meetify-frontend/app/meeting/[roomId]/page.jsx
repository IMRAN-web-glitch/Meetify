"use client";
import { useEffect, useRef, useState } from "react";
import { initSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";

export default function Meeting({ params }) {
    const { data: session } = useSession();
    const roomId = params.roomId;
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [participants, setParticipants] = useState([]); // [{ stream, isLocal }]
    // For mute/unmute and video toggle
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    useEffect(() => {
        if (!socketRef.current) return;
        socketRef.current.on("camera-toggle", ({ peerId, enabled }) => {
            setParticipants(prev =>
                prev.map(p =>
                    !p.isLocal && p.peerId === peerId
                        ? { ...p, cameraEnabled: enabled }
                        : p
                )
            );
        });
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;
        // Listen for leave-room event
        socketRef.current.on("leave-room", ({ peerId }) => {
            setParticipants(prev => prev.filter(p => p.peerId !== peerId));
        });
    }, []);




    useEffect(() => {
        const socket = initSocket();
        socketRef.current = socket;

        async function init() {
            // 1. Get user media
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Your browser does not support camera/microphone access. Please use Chrome or Safari over HTTPS.");
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            // setParticipants([{ stream, isLocal: true }]);
            setParticipants([{ peerId: socket.id, stream, isLocal: true }]);



            // 2. Peer connection
            const pc = new RTCPeerConnection();
            pcRef.current = pc;

            // Add local tracks
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // Remote stream
            pc.ontrack = (event) => {
                // Only add if not already present
                setParticipants(prev => {
                    if (prev.some(p => p.stream === event.streams[0])) return prev;
                    return [...prev, { stream: event.streams[0], isLocal: false }];
                });

            };

            // ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { candidate: event.candidate, room: roomId });
                }
            };
            // 3. Join room
            socket.emit("join-room", roomId);

            // 4. User joined → create offer
            socket.on("user-joined", async ({ peerId }) => {

                setParticipants(prev => {
                    if (prev.some(p => p.peerId === peerId)) return prev;
                    return [...prev, { peerId, stream: null, isLocal: false }];
                });

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("offer", { sdp: offer, room: roomId });
                console.log("User joined: ", peerId)
            });



            // 5. Handle offer
            socket.on("offer", async ({ sdp }) => {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer", { sdp: answer, room: roomId });


            });

            // 6. Handle answer
            socket.on("answer", async ({ sdp }) => {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));

            });

            // 7. ICE candidate
            socket.on("ice-candidate", async ({ candidate }) => {
                if (candidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            });


            socket.on("message", (m) => {
                // If m is a string, wrap it into { sender, text }
                if (typeof m === "string") {
                    setMessages(prev => [...prev, { sender: "Unknown", text: m }]);
                } else {
                    setMessages(prev => [...prev, m]);
                }
            });
            // 9. User left
            socket.on("user-left", ({ peerId }) => {
                setParticipants(prev => prev.filter(p => p.peerId !== peerId));
                console.log("User left: ", peerId)
            });
        }

        init();
    }, []);

    // Toggle audio
    const handleToggleAudio = () => {
        const stream = localStreamRef.current;
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !audioEnabled;
            });
            setAudioEnabled(!audioEnabled);
        }
    };



    const handleToggleVideo = () => {
        const stream = localStreamRef.current;
        if (!stream) return;

        stream.getVideoTracks().forEach(track => {
            track.enabled = !videoEnabled;
        });

        setVideoEnabled(!videoEnabled);

        // Signal to peers
        socketRef.current.emit("camera-toggle", { room: roomId, enabled: !videoEnabled });
    };

    const sendMessage = () => {
        if (msg.trim() !== "") {
            const newMsg = { sender: session?.user?.name || "Me", text: msg };
            socketRef.current.emit("message", newMsg);
            setMsg(""); // don’t push to state
        }
    };



    // End meeting
    const handleEndMeeting = () => {
        // Notify others
        if (socketRef.current) {
            socketRef.current.emit("leave-room", { room: roomId });
        }
        // Stop all local media tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        // Close peer connection
        if (pcRef.current) {
            pcRef.current.close();
        }
        // Disconnect socket
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        // Redirect
        window.location.href = "/";
    };

    // Responsive grid columns based on participant count
    const getGridCols = () => {
        if (participants.length <= 1) return "grid-cols-1";
        if (participants.length === 2) return "grid-cols-2";
        if (participants.length <= 4) return "grid-cols-2";
        if (participants.length <= 6) return "grid-cols-3";
        return "grid-cols-4";
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            {/* Video Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-8">
                <div className={`grid gap-6 w-full h-full ${getGridCols()} auto-rows-fr`}>
                    {participants.map((p, idx) =>
                        p.isLocal && !videoEnabled ? (
                            <div
                                key={p.peerId}
                                className="w-full h-full flex items-center justify-center rounded-2xl shadow-xl border-4 border-blue-400 bg-blue-100 aspect-video text-blue-700 text-2xl font-semibold">
                                <img
                                    src={session.user?.image} // fallback if no image
                                    alt={session.user?.name || "User"}
                                    className="w-30 h-30 rounded-full  border-2 border-gray-300"
                                />
                            </div>
                        ) : (
                            <video
                                key={p.peerId}
                                ref={el => {
                                    if (el && p.stream && el.srcObject !== p.stream) el.srcObject = p.stream;
                                    if (el && !p.stream) el.srcObject = null;
                                }}
                                autoPlay
                                muted={p.isLocal}
                                playsInline
                                className="w-full h-full rounded-2xl shadow-xl border-4 border-blue-400 bg-blue-50 object-cover aspect-video" />
                        )
                    )}
                </div>
                {/* Controls */}
                <div className="flex gap-4 mt-6 justify-center">
                    <button onClick={handleToggleAudio}
                        className={`p-3 rounded-full shadow-lg border-2 border-blue-200 transition-all duration-200 ${audioEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-200 hover:bg-blue-300"}`}
                        title={audioEnabled ? "Mute" : "Unmute"} >
                        {audioEnabled ? (

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 01-14 0v-2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19v4m-4 0h8" />
                            </svg>
                        ) : (

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 01-14 0v-2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19v4m-4 0h8" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4l16 16" />
                            </svg>


                        )}
                    </button>
                    <button onClick={handleToggleVideo}
                        className={`p-3 rounded-full shadow-lg border-2 border-blue-200 transition-all duration-200 ${videoEnabled ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-200 hover:bg-blue-300"}`}
                        title={videoEnabled ? "Turn off video" : "Turn on video"}>
                        {videoEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H5z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H5z" />
                            </svg>
                        )}
                    </button>
                    <button onClick={handleEndMeeting}
                        className="p-3 rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white font-semibold border-2 border-red-200 transition-all duration-200"
                        title="End Meeting">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.46l-5.27-2.11a2 2 0 00-2.11.45l-2.2 2.2a16.06 16.06 0 01-7.07-7.07l2.2-2.2a2 2 0 00.45-2.11L8.54 3A2 2 0 006.5 2H5A2 2 0 003 4c0 10.493 8.507 19 19 19a2 2 0 002-2v-1.5a2 2 0 00-1-1.74z" />
                        </svg>
                    </button>
                    <button
                        className="md:hidden z-20 p-2 rounded-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setChatOpen(true)}
                        aria-label="Open chat"
                    >
                        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat Section - Desktop */}
            <div className="hidden md:flex w-full md:w-80 bg-white text-blue-900 flex-col h-1/2 md:h-full border-t md:border-t-0 md:border-l border-blue-200 rounded-l-3xl shadow-xl">
                <div className="flex-1 overflow-y-auto p-6">
                    <h2 className="text-xl font-bold mb-3 text-blue-700">Chat</h2>
                    <div className="space-y-2">
                        {/* {messages.map((m, i) => (
                            <div key={i} className="bg-blue-100 rounded px-3 py-2">
                                <span className="font-bold text-blue-500">{m.sender}:</span> <span>{m.text}</span>
                            </div>
                        ))} */}
                        {messages.map((m, i) => {
                            const sender = typeof m === "object" ? m.text.sender : "Unknown";
                            const text = typeof m === "object" ? m.text.text : m;
                            return (
                                <div key={i} className="bg-blue-100 rounded px-3 py-2">
                                    <span className="font-bold text-blue-500">{sender}:</span> <span>{text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="p-3 flex gap-2 border-t border-blue-100 bg-blue-50 rounded-b-3xl">
                    <input
                        className="flex-1 p-2 text-blue-900 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Type message..."
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-blue-700 transition">Send</button>
                </div>
            </div>

            {/* Chat Section - Mobile Hamburger Drawer */}
            {chatOpen && (
                <div className="fixed inset-0 z-30 flex md:hidden">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-40"
                        onClick={() => setChatOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="relative ml-auto w-80 max-w-full h-full bg-white text-blue-900 flex flex-col border-l border-blue-200 animate-slide-in rounded-l-3xl shadow-xl">
                        <button
                            className="absolute top-2 right-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 z-10"
                            onClick={() => setChatOpen(false)}
                            aria-label="Close chat"
                        >
                            <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex-1 overflow-y-auto p-6 pt-10">
                            <h2 className="text-xl font-bold mb-3 text-blue-700">Chat</h2>
                            <div className="space-y-2">
                                {messages.map((m, i) => {
                                    const sender = typeof m === "object" ? m.text.sender : "Unknown";
                                    const text = typeof m === "object" ? m.text.text : m;
                                    return (
                                        <div key={i} className="bg-blue-100 rounded px-3 py-2">
                                            <span className="font-bold text-blue-500">{sender}:</span> <span>{text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-3 flex gap-2 border-t border-blue-100 bg-blue-50 rounded-b-3xl">
                            <input
                                className="flex-1 p-2 text-blue-900 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Type message..."
                                onKeyDown={e => e.key === "Enter" && sendMessage()}
                            />
                            <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-blue-700 transition">Send</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Animation for mobile chat drawer */}
            <style jsx global>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.2s ease;
                }
            `}</style>
        </div>
    );
}