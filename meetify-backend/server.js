// meetify-backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");


const app = express();
const activeRooms = new Set();   // <-- this is a Set to store valid meeting IDs
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.get("/create-meeting", (req, res) => {
  const meetingId = uuidv4(); // unique meeting ID
  activeRooms.add(meetingId);
  res.json({ meetingId });
});

app.get("/meeting/:id", (req, res) => {
  const  id  = req.params.id;
  if (!activeRooms.has(id)) {
      res.json({ valid: false, message: "Meeting not exists" });
      return;
    }
  res.json({ valid: true, message: "Meeting exists" })
})


io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    
    socket.join(roomId);
    socket.to(roomId).emit("user-joined",  { peerId: socket.id });
  

    socket.on("offer", (data) => {
      socket.to(roomId).emit("offer", { sdp: data.sdp, sender: socket.id });
    });

    socket.on("answer", (data) => {
      socket.to(roomId).emit("answer", { sdp: data.sdp, sender: socket.id });
    });

    socket.on("ice-candidate", (data) => {
      socket.to(roomId).emit("ice-candidate", { candidate: data.candidate, sender: socket.id });
    });

    socket.on("message", (msg) => {
      io.to(roomId).emit("message", { sender: socket.id, text: msg });
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-left",  { peerId: socket.id });
    });
  });
});

server.listen(5000, () => console.log("🚀 Signaling server running on http://localhost:5000"));
