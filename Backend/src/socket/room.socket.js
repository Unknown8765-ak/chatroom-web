import { Room } from "../models/room.model.js";

const registerRoomSocket = (io, socket) => {

  
  socket.on("join-room", async (roomId) => {
    try {
      const room = await Room.findOne({ roomId });

      if (!room || !room.isActive) {
        socket.emit("system-message", {
          text: "Room is inactive or does not exist",
        });
        return;
      }

      socket.join(roomId);

      console.log(`👤 ${socket.user.name} joined room ${roomId}`);


      socket.emit("room-info", {
        createdBy: room.createdBy.toString(),
      });


     const isCreator =
      room.createdBy.toString() === socket.user._id.toString();

      console.log(
        `👤 ${socket.user.name} joined room ${roomId} | creator=${isCreator}`
      );

      if (!isCreator) {
        socket.to(roomId).emit("system-message", {
          text: `${socket.user.name} joined the room`,
        });
      }
    } catch (error) {
      console.error("Join room error:", error.message);
    }
  });

  
  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("typing", {
      name: socket.user.name,
    });
  });

  
  socket.on("leave-room", async(roomId) => {
    socket.leave(roomId);

    console.log(`👤 ${socket.user.name} left room ${roomId}`);

  //   await Room.findOneAndUpdate(
  //   { roomId },
  //   { $pull: { participants: socket.user._id } }
  // );
    socket.to(roomId).emit("system-message", {
      text: `${socket.user.name} left the room`,
    });
  });

  
  socket.on("delete-room", async ({ roomId }) => {
    try {
      const room = await Room.findOne({ roomId });

      if (!room) return;


      if (room.createdBy.toString() !== socket.user._id.toString()) {
        return;
      }

      //room inactive
      room.isActive = false;
      await room.save();

      console.log(`❌ Room ${roomId} deleted by ${socket.user.name}`);

      // 🔥 sab users ko batao
      io.to(roomId).emit("room-deleted");

      // 🔥 sabko room se bahar nikaal do
      io.socketsLeave(roomId);

    } catch (error) {
      console.error("Delete room error:", error.message);
    }
  });
  
  socket.on("disconnect", async () => {
  try {
    const rooms = [...socket.rooms].filter(
      (room) => room !== socket.id
    );

    for (const roomId of rooms) {
      console.log(`👤 ${socket.user.name} disconnected from ${roomId}`);

      socket.to(roomId).emit("system-message", {
        text: `${socket.user.name} left the room`,
      });

      // Remove from participants in DB
      await Room.findOneAndUpdate(
        { roomId },
        { $pull: { participants: socket.user._id } }
      );
    }
  } catch (error) {
    console.error("Disconnect error:", error.message);
  }
});
};

export default registerRoomSocket;


















// import { Room } from "../models/room.model.js";

// const registerRoomSocket = (io, socket) => {
//   socket.on("join-room", async (roomCode) => {
//     try {
//       const room = await Room.findOne({ roomCode });

//       // ❌ Room nahi hai ya inactive hai
//       if (!room || !room.isActive) {
//         socket.emit("system-message", {
//           text: "Room is inactive or does not exist",
//         });
//         return;
//       }

//       socket.join(roomCode);
//        socket.emit("room-info", {
//       createdBy: room.createdBy.toString(),
//     });
//       console.log(socket.user.name)

//       console.log(`👤 ${socket.user.name} joined room ${roomCode}`);

//       // 🔔 system message (dusro ko)
//       socket.to(roomCode).emit("system-message", {
//         text: `${socket.user.name} joined the room`,
//       });

//     } catch (error) {
//       console.error("Join room error:", error.message);
//     }
//   });

  
//   socket.on("typing", ({ roomCode }) => {
//     socket.to(roomCode).emit("typing", {
//       name: socket.user.name,
//     });
//   });

//   socket.on("leave-room", (roomCode) => {
//     socket.leave(roomCode);

//     console.log(`👤 ${socket.user.name} left room ${roomCode}`);

//     socket.to(roomCode).emit("system-message", {
//       text: `${socket.user.name} left the room`,
//     });
//   });
// };

// export default registerRoomSocket;
 
 
 
 // const registerRoomSocket = (io, socket) => {

  //   socket.on("join-room", (roomCode) => {
  //     socket.join(roomCode);
  //     console.log(`👥 ${socket.id} joined room ${roomCode}`);
  //     console.log(`👤 ${socket.user.name} joined room ${roomCode}`);

  //     // 🔔 system message: user joined
  //     socket.to(roomCode).emit("system-message", {
  //       text: `${socket.user.name} joined the room`,
  //     });
  //   });

  //   socket.on("typing", ({ roomCode, user }) => {
  //     socket.to(roomCode).emit("typing", {
  //     name: user.name,
  //       });
  //     });

  //   socket.on("leave-room", (roomCode) => {
  //     socket.leave(roomCode);
  //     console.log(`🚪 ${socket.id} left room ${roomCode}`);
  //     console.log(`👤 ${socket.user.name} joined room ${roomCode}`);

  //     socket.to(roomCode).emit("system-message", {
  //       text: `${socket.user.name} left the room`,
  //     });
  //   });

  // };

  // export default registerRoomSocket;
