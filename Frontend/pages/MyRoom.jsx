import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/rooms/my-rooms`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }

        setRooms(data.rooms);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/api/v1/rooms/${roomId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setRooms((prev) =>
        prev.filter((room) => room._id !== roomId)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete room");
    }
  };

  return (
    <>
      {/* 🔥 Custom Header */}
      <header
        className="w-full flex items-center justify-between 
        px-4 sm:px-8 py-4 sm:py-6
        bg-black/30 backdrop-blur-md border-b border-white/20"
      >
        {/* Left Side */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/006/230/877/large_2x/chat-room-logo-design-chat-message-with-negative-space-door-logo-template-illustration-vector.jpg"
            alt="ChatRoom Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
          />

          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
            ChatRoom
          </h1>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/join-room")}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm 
            bg-purple-600 hover:bg-purple-700 
            rounded-lg font-semibold text-white transition"
          >
            Join Room
          </button>

          <button
            onClick={() => navigate("/create-room")}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm 
            bg-green-600 hover:bg-green-700 
            rounded-lg font-semibold text-white transition"
          >
            + Create
          </button>
        </div>
      </header>

      {/* 🔥 Page Content */}
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            My Rooms Dashboard
          </h1>

          {/* Summary */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mb-10">
            <h2 className="text-lg sm:text-xl font-semibold">
              Total Rooms Created
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2">
              {rooms.length}
            </p>
          </div>

          {loading && (
            <p className="text-center">Loading your rooms...</p>
          )}

          {!loading && rooms.length === 0 && (
            <p className="text-center text-gray-300">
              You haven't created any rooms yet.
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 
                p-6 rounded-xl shadow-lg hover:scale-[1.02] 
                transition duration-300"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  {room.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">
                      Room Code:
                    </span>{" "}
                    {room.roomId}
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Members:
                    </span>{" "}
                    {room.totalMembers}
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Created:
                    </span>{" "}
                    {new Date(room.createdAt).toLocaleDateString()}
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Status:
                    </span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        room.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {room.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() =>
                      navigate(`/room/${room._id}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 
                    px-4 py-2 rounded-lg text-sm"
                  >
                    Open
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(room._id)
                    }
                    className="bg-red-600 hover:bg-red-700 
                    px-4 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default MyRooms;