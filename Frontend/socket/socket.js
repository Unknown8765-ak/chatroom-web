import { io } from "socket.io-client"

const socket = io("https://chatroom-web-x44l.onrender.com", {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"]
});

export default socket;