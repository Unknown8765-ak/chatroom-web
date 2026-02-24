import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import { useDispatch } from "react-redux"
import { setActiveRoom } from "../features/room/roomSlice"
import { setChatRoom } from "../features/chat/chatSlice"
import Header from "../components/Header"

function JoinRoom() {
  const [roomId, setRoomId] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleJoinRoom = async (e) => {
  e.preventDefault()
  setError("")

  if (!roomId.trim()) return

  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/rooms/${roomId}/join`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const data = await response.json()
    console.log(data)

    if (!response.ok) {
      throw new Error(data.message || "Room not found")
    }

    if (data.data.alreadyJoined) {
      console.log("User already in room")
      throw new Error(data.message)
    }
    
    dispatch(setActiveRoom({ roomId: data.data.roomId }))
    dispatch(setChatRoom(data.data.roomId))

      navigate(`/room/${data.data.roomId}`);

  } catch (err) {
    setError(err.message || "❌ Invalid Room Code")
  }
}


 

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

  <Header />

  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
    
    <form
      onSubmit={handleJoinRoom}
      className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white"
    >
      
      <h2 className="text-3xl font-bold text-center mb-2">
        Join Chat Room
      </h2>
      
      <p className="text-center text-white/80 mb-6 text-sm">
        Enter your room code and start chatting 🚀
      </p>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                     placeholder-white/70 text-white focus:outline-none 
                     focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
        />
      </div>

      {error && (
        <p className="text-red-300 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl 
                   hover:bg-purple-100 transition-all duration-300 shadow-lg"
      >
        Join Room
      </button>

    </form>
  </div>
</div>

  
)

}

export default JoinRoom
