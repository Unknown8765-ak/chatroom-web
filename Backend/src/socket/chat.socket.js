import { Chat } from "../models/chat.model.js";
import { Room } from "../models/room.model.js";

const registerChatSocket = (io, socket) => {

  socket.on("send-message", async ({ roomId, message }) => {
    console.log(roomId,message)
    try {
      
      const room = await Room.findOne({ roomId });
      if (!room) return;

      const newMessage = await Chat.create({
      roomId: room._id,           
      sender: socket.user?._id || "amit", 
      content: message,        
});


      io.to(roomId).emit("receive-message", {
        _id: newMessage._id,
        content: newMessage.content,
        sender: {
          _id: socket.user._id,
          name: socket.user.name,
        },
        createdAt: newMessage.createdAt,
      });

    } catch (error) {
      console.error("❌ Send message error:", error.message);
    }
  });

};

export default registerChatSocket;
