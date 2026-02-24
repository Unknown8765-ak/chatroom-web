import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function CreateRoom() {
    const navigate = useNavigate()
    const [roomId ,setRoomId] = useState("")
    const [roomName ,setRoomName] = useState("")
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const generateRoomCode = ()=>{
        const code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
        setRoomId(code);
    }

    const handleCreateRoom = async ()=>{
        if (!roomId) {
      alert(" Pehle room code generate karo");
      return;
    }

    if (!roomName) {
      alert(" Room name required hai");
      return;
    }
    
    try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/v1/rooms/create`,{
            method : "POST",
            credentials : "include",
            headers :{
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                name : roomName,
                roomId
            })     
        })

        const data = await res.json()
        if (!res.ok) {
        throw new Error(data.message || "Room create failed");
      }

    alert("Room created successfully");
      navigate(`/room/${data.data.room.roomId}`);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

  <Header />

  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
    
    <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 
                    p-8 rounded-2xl shadow-2xl flex flex-col gap-6 text-white">

      <h2 className="text-3xl font-bold text-center">
        Create Room 🚀
      </h2>

    
      <div className="flex gap-3">
        <input
          type="text"
          value={roomId}
          readOnly
          placeholder="Room Code"
          className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                     text-white placeholder-white/70 focus:outline-none"
        />

        <button
          type="button"
          onClick={generateRoomCode}
          className="bg-green-500 hover:bg-green-600 px-4 rounded-xl 
                     font-semibold transition-all duration-300 shadow-lg"
        >
          Generate
        </button>
      </div>

      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                   text-white placeholder-white/70 focus:outline-none 
                   focus:ring-2 focus:ring-white transition-all"
      />

      <div className="flex gap-4">
        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="bg-white text-purple-700 font-semibold py-3 w-full rounded-xl 
                     hover:bg-purple-100 transition-all duration-300 shadow-lg"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/join-room")}
          className="bg-purple-500 hover:bg-purple-600 text-white py-3 w-full 
                     rounded-xl transition-all duration-300 shadow-lg"
        >
          Join Room
        </button>
      </div>

    </div>
  </div>
</div>

  
);
}

export default CreateRoom
