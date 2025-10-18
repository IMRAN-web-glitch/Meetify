import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_Backend; // change to your backend when deployed
let socket;

export const initSocket = () => {
  if (!socket) socket = io(URL);
  return socket;
};
