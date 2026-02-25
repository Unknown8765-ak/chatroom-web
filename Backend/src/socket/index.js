import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import registerRoomSocket from "./room.socket.js";
import registerChatSocket from "./chat.socket.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://chatroom-web-pi.vercel.app",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.cookie
        ?.split("accessToken=")[1]
        ?.split(";")[0];

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(decoded._id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.user.name);

    socket.emit("me", {
      _id: socket.user._id,
      name: socket.user.name,
    });

    registerRoomSocket(io, socket);
    registerChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.user.name);
    });
  });
};

export { io };




























// import { Server } from "socket.io";
// import registerRoomSocket from "./room.socket.js";
// import registerChatSocket from "./chat.socket.js";

// let io;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("🟢 User connected:", socket.id);

//     registerRoomSocket(io, socket);
//     registerChatSocket(io, socket);

//     socket.on("disconnect", () => {
//       console.log("🔴 User disconnected:", socket.id);
//     });
//   });
// };

// export { io };
