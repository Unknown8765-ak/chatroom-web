import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket.js";

function MessageRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [roomCreator, setRoomCreator] = useState(null);

  const [activeUsers, setActiveUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", roomId);

    socket.on("me", (user) => {
      setCurrentUser(user);
    });

    socket.on("room-info", (data) => {
      setRoomCreator(data.createdBy);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (data) => {
      setTypingUser(data.name);
      setTimeout(() => setTypingUser(null), 2000);
    });

    socket.on("system-message", (data) => {
      setMessages((prev) => [...prev, { ...data, system: true }]);
    });

    socket.on("room-deleted", () => {
      alert("Room has been deleted by creator");
      navigate("/");
    });

    return () => {
      socket.emit("leave-room", roomId);

      socket.off("me");
      socket.off("room-info");
      socket.off("receive-message");
      socket.off("typing");
      socket.off("system-message");
      socket.off("room-deleted");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      message,
    });

    setMessage("");
  };

  const leaveRoom = async () => {
    try {
      if (!window.confirm("Are you sure you want to leave this room?")) return;

      const res = await fetch(
        `http://localhost:8000/api/v1/rooms/${roomId}/leave`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to leave room");
      }

      socket.emit("leave-room", roomId);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteRoom = () => {
    socket.emit("delete-room", { roomId });
  };

  // ✅ API to get active users
  const getActiveUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/rooms/${roomId}/participants`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setActiveUsers(data.activeParticipants);
      setShowUsers(true);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 
                      text-white p-4 flex justify-between items-center shadow-lg">

        <div>
          <h3 className="font-semibold text-lg">💬 Messaging Room</h3>
          <p className="text-sm text-white/80">Room Code: {roomId}</p>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <img
            src="https://static.vecteezy.com/system/resources/previews/006/230/877/large_2x/chat-room-logo-design-chat-message-with-negative-space-door-logo-template-illustration-vector.jpg"
            alt="ChatRoom"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-xl font-bold tracking-wide">ChatRoom</h1>
        </div>

        <div className="flex gap-2">

          <button
            onClick={getActiveUsers}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-sm 
                       transition-all duration-300 shadow-md"
          >
            Active Users
          </button>

          <button
            onClick={leaveRoom}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl text-sm 
                       transition-all duration-300 shadow-md"
          >
            Leave
          </button>

          {currentUser?._id === roomCreator && (
            <button
              onClick={deleteRoom}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm 
                         transition-all duration-300 shadow-md"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showUsers && (
        <div className="absolute top-20 right-6 bg-white text-black 
                        rounded-xl shadow-2xl w-64 p-4 z-50">

          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              Active Users ({activeUsers.length})
            </h3>

            <button
              onClick={() => setShowUsers(false)}
              className="text-red-500"
            >
              ✖
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">

        {typingUser && (
          <p className="text-xs text-white/80 animate-pulse">
            {typingUser} is typing...
          </p>
        )}

        {messages.map((msg, index) => {
          if (msg.system) {
            return (
              <div key={index} className="text-center text-xs text-white/70">
                {msg.text}
              </div>
            );
          }

          const isMe = msg.sender._id === currentUser?._id;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-lg
                ${
                  isMe
                    ? "bg-white text-purple-700 rounded-br-none"
                    : "bg-white/20 backdrop-blur-md text-white rounded-bl-none"
                }`}
              >
                <p
                  className={`text-xs mb-1 ${
                    isMe ? "text-gray-500" : "text-white/70"
                  }`}
                >
                  {msg.sender.name}
                </p>
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 
                      p-4 flex gap-3">

        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", { roomId });
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white 
                     placeholder-white/70 border border-white/30 
                     focus:outline-none focus:ring-2 focus:ring-white transition-all"
        />

        <button
          onClick={sendMessage}
          className="bg-white text-purple-700 px-6 rounded-full 
                     font-semibold hover:bg-purple-100 
                     transition-all duration-300 shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageRoom;










// import React, { useEffect, useState } from 'react'
// import { useParams, useNavigate } from "react-router-dom";
// import socket from "../socket/socket.js";


// function MessageRoom() {
//     const { roomId } = useParams();
//     const navigate = useNavigate();

//     const [message , setMessage] = useState("")
//     const [messages , setMessages] = useState([])
//     const [currentUser ,setCurrentUser ] = useState(null)
//     const [typingUser, setTypingUser] = useState(null);
//     const [roomCreator, setRoomCreator] = useState(null);

//       useEffect(() => {
//     if (!socket.connected) {
//       console.log("🔌 Socket not connected, connecting...");

//       socket.connect();
//     }else {
//       console.log("✅ Socket already connected");
//     }

//     socket.emit("join-room", roomId);

//     socket.on("me", (user) => {
//       setCurrentUser(user);
//     });

//     // room info (creator)
//     socket.on("room-info", (data) => {
//       setRoomCreator(data.createdBy);
//     });

//     socket.on("receive-message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("typing", (data) => {
//       setTypingUser(data.name);
//       setTimeout(() => setTypingUser(null), 2000);
//     });

//     socket.on("system-message", (data) => {
//       setMessages((prev) => [...prev, { ...data, system: true }]);
//     });

//     socket.on("room-deleted", () => {
//       alert("Room has been deleted by creator");
//       navigate("/");
//     });

//     return () => {
//       socket.emit("leave-room", roomId );

//   socket.off("me");
//   socket.off("room-info");
//   socket.off("receive-message");
//   socket.off("typing");
//   socket.off("system-message");
//   socket.off("room-deleted");
//     };
//   }, [roomId]);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("send-message", {
//       roomId,
//       message,
//     });

//     setMessage("");
//   };
//     const leaveRoom = async () => {
//     try {
//       if (!window.confirm("Are you sure you want to leave this room?")) return;

//       const res = await fetch(
//         `http://localhost:8000/api/v1/rooms/${roomId}/leave`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//           "Content-Type": "application/json",
//         },
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to leave room");
//       }

//       socket.emit("leave-room", roomId);
//       navigate("/");
//     } catch (error) {
//       alert(error.message);
//     }
//   };
//   const getActiveUsers = async () => {
//   try {
//     const res = await fetch(
//       `http://localhost:8000/api/v1/rooms/${roomId}/participants`,
//       {
//         method: "GET",
//         credentials: "include",
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Failed to fetch users");
//     }

//     setActiveUsers(data.users);
//     setShowUsers(true);
//   } catch (error) {
//     alert(error.message);
//   }
// };
//   const deleteRoom = () => {
//     socket.emit("delete-room", { roomId });
//   };


//   return (
//   <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

//     <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 
//                 text-white p-4 flex justify-between items-center shadow-lg">

//   <div>
//     <h3 className="font-semibold text-lg">💬 Messaging Room</h3>
//     <p className="text-sm text-white/80">Room Code: {roomId}</p>
//   </div>

//   <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
//     <img
//       src="https://static.vecteezy.com/system/resources/previews/006/230/877/large_2x/chat-room-logo-design-chat-message-with-negative-space-door-logo-template-illustration-vector.jpg"
//       alt="ChatRoom"
//       className="w-10 h-10 rounded-lg"
//     />
//     <h1 className="text-xl font-bold tracking-wide">ChatRoom</h1>
//   </div>

//   {/* RIGHT SIDE */}
//   <div className="flex gap-2">
//     <button
//   onClick={getActiveUsers}
//   className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-sm 
//              transition-all duration-300 shadow-md"
// >
//   Active Users
// </button>
//     <button
//       onClick={leaveRoom}
//       className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl text-sm 
//                  transition-all duration-300 shadow-md"
//     >
//       Leave
//     </button>

//     {currentUser?._id === roomCreator && (
//       <button
//         onClick={deleteRoom}
//         className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm 
//                    transition-all duration-300 shadow-md"
//       >
//         Delete
//       </button>
//     )}
//   </div>

// </div>

//     <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">

//       {typingUser && (
//         <p className="text-xs text-white/80 animate-pulse">
//           {typingUser} is typing...
//         </p>
//       )}

//       {messages.map((msg, index) => {
//         if (msg.system) {
//           return (
//             <div key={index} className="text-center text-xs text-white/70">
//               {msg.text}
//             </div>
//           );
//         }

//         const isMe = msg.sender._id === currentUser?._id;

//         return (
//           <div
//             key={index}
//             className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-lg
//                 ${isMe
//                   ? "bg-white text-purple-700 rounded-br-none"
//                   : "bg-white/20 backdrop-blur-md text-white rounded-bl-none"
//                 }`}
//             >
//               <p className={`text-xs mb-1 ${isMe ? "text-gray-500" : "text-white/70"}`}>
//                 {msg.sender.name}
//               </p>
//               <p>{msg.content}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>

//     <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 
//                     p-4 flex gap-3">

//       <input
//         type="text"
//         value={message}
//         placeholder="Type a message..."
//         onChange={(e) => {
//           setMessage(e.target.value);
//           socket.emit("typing", { roomId });
//         }}
//         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white 
//                    placeholder-white/70 border border-white/30 
//                    focus:outline-none focus:ring-2 focus:ring-white transition-all"
//       />

//       <button
//         onClick={sendMessage}
//         className="bg-white text-purple-700 px-6 rounded-full 
//                    font-semibold hover:bg-purple-100 
//                    transition-all duration-300 shadow-lg"
//       >
//         Send
//       </button>
//     </div>

//   </div>
// );
// }

// export default MessageRoom
