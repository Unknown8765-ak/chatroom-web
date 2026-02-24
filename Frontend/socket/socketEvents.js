import { socket } from "./socket"

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

export const joinRoom = (roomId) => {
  socket.emit("join-room", {roomId})
}

export const sendMessage = ({ roomId, message }) => {
  socket.emit("send-message", {
    roomId,
    message,
  })
}


export const receiveMessage = (callback) => {
  socket.off("receive-message")
  socket.on("receive-message", callback)
}

export const removeReceiveMessage = () => {
  socket.off("receive-message")
}

