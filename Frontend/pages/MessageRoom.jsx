
// import React, { useEffect, useState, useMemo, useRef } from "react";

// import { useParams, useNavigate } from "react-router-dom";
// import socket from "../socket/socket.js";

// function MessageRoom() {
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [roomCreator, setRoomCreator] = useState(null);
//   const [typingUser, setTypingUser] = useState(null);
//   const [roomLoaded, setRoomLoaded] = useState(false);

//   const messagesEndRef = useRef(null);

//   const API_URL = import.meta.env.VITE_API_URL;

//   // ✅ Ownership check
//   const isRoomOwner = useMemo(() => {
//     if (!currentUser || !roomCreator) return false;
//     return currentUser._id === roomCreator;
//   }, [currentUser, roomCreator]);

//   // ✅ Auto Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (!socket.connected) socket.connect();

//     socket.emit("join-room", roomId);

//     const handleMe = (user) => setCurrentUser(user);

//     const handleRoomInfo = (data) => {
//       setRoomCreator(data.createdBy);
//       setRoomLoaded(true);
//     };

//     const handleReceiveMessage = (data) => {
//       setMessages((prev) => [...prev, data]);
//     };

//     const handleTyping = (data) => {
//       setTypingUser(data.name);
//       setTimeout(() => setTypingUser(null), 2000);
//     };

//     const handleSystemMessage = (data) => {
//       setMessages((prev) => [...prev, { ...data, system: true }]);
//     };

//     const handleRoomDeleted = () => {
//       alert("Room has been deleted by creator");
//       navigate("/");
//     };

//     socket.on("me", handleMe);
//     socket.on("room-info", handleRoomInfo);
//     socket.on("receive-message", handleReceiveMessage);
//     socket.on("typing", handleTyping);
//     socket.on("system-message", handleSystemMessage);
//     socket.on("room-deleted", handleRoomDeleted);

//     return () => {
//       socket.emit("leave-room", roomId);
//       socket.off();
//     };
//   }, [roomId, navigate]);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("send-message", { roomId, message });
//     setMessage("");
//   };

//   // ✅ Format timestamp
//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (!roomLoaded) {
//     return (
//       <div className="h-screen flex items-center justify-center text-white">
//         Loading room...
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

//       {/* HEADER */}
//       <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 
//                       text-white px-6 py-3 flex items-center justify-between">

//         <div>
//           <h3 className="font-semibold text-lg">💬 Messaging Room</h3>
//           <p className="text-sm text-white/80">Room: {roomId}</p>
//         </div>

//         <div className="flex gap-2">
//           {isRoomOwner && (
//             <button
//               onClick={() => socket.emit("delete-room", { roomId })}
//               className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">

//         {typingUser && (
//           <p className="text-xs text-white/80 animate-pulse">
//             {typingUser} is typing...
//           </p>
//         )}

//         {messages.map((msg, index) => {
//           if (msg.system) {
//             return (
//               <div key={index} className="text-center text-xs text-white/70">
//                 {msg.text}
//               </div>
//             );
//           }

//           const isMe = msg.sender._id === currentUser?._id;

//           return (
//             <div
//               key={index}
//               className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-sm px-4 py-3 rounded-2xl text-sm shadow-lg
//                 ${
//                   isMe
//                     ? "bg-white text-purple-700 rounded-br-none"
//                     : "bg-white/20 backdrop-blur-md text-white rounded-bl-none"
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-1">
//                   <p className="text-xs opacity-70">
//                     {msg.sender.name}
//                   </p>
//                   {msg.createdAt && (
//                     <span className="text-[10px] opacity-60">
//                       {formatTime(msg.createdAt)}
//                     </span>
//                   )}
//                 </div>

//                 <p className="break-words">{msg.content}</p>
//               </div>
//             </div>
//           );
//         })}

//         {/* ✅ Scroll anchor */}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT */}
//       <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 
//                       px-6 py-3 flex gap-2">

//         <input
//           type="text"
//           value={message}
//           placeholder="Type a message..."
//           onChange={(e) => {
//             setMessage(e.target.value);
//             socket.emit("typing", { roomId });
//           }}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 px-4 py-2 rounded-full bg-white/20 text-white 
//                      placeholder-white/70 border border-white/30 
//                      focus:outline-none focus:ring-2 focus:ring-white"
//         />

//         <button
//           onClick={sendMessage}
//           className="bg-white text-purple-700 px-6 rounded-full font-semibold hover:bg-purple-100"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MessageRoom;

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket.js";

function MessageRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [roomCreator, setRoomCreator] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [roomLoaded, setRoomLoaded] = useState(false);

  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Ownership Check
  const isRoomOwner = useMemo(() => {
    if (!currentUser || !roomCreator) return false;
    return currentUser._id === roomCreator;
  }, [currentUser, roomCreator]);

  // ✅ Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("join-room", roomId);

    const handleMe = (user) => setCurrentUser(user);

    const handleRoomInfo = (data) => {
      setRoomCreator(data.createdBy);
      setRoomLoaded(true);
    };

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleTyping = (data) => {
      setTypingUser(data.name);
      setTimeout(() => setTypingUser(null), 2000);
    };

    const handleSystemMessage = (data) => {
      setMessages((prev) => [...prev, { ...data, system: true }]);
    };

    const handleRoomDeleted = () => {
      alert("Room deleted by creator");
      navigate("/");
    };

    socket.on("me", handleMe);
    socket.on("room-info", handleRoomInfo);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("system-message", handleSystemMessage);
    socket.on("room-deleted", handleRoomDeleted);

    return () => {
      socket.emit("leave-room", roomId);
      socket.off();
    };
  }, [roomId, navigate]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", { roomId, message });
    setMessage("");
  };


  const handleShare = async () => {
  const roomLink = `${window.location.origin}/room/${roomId}`;

  // Modern mobile share
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Join My Chat Room",
        text: "Hey! Join my chat room 🚀",
        url: roomLink,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    // Fallback for desktop
    await navigator.clipboard.writeText(roomLink);
    alert("Room link copied to clipboard!");
  }
};

  const leaveRoom = async () => {
    try {
      if (!window.confirm("Leave this room?")) return;

      const res = await fetch(
        `${API_URL}/api/v1/rooms/${roomId}/leave`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      socket.emit("leave-room", roomId);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const getActiveUsers = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/rooms/${roomId}/participants`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setActiveUsers(data.activeParticipants);
      setShowUsers(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!roomLoaded) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading room...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 
                      text-white px-6 py-3 flex items-center justify-between">

        <div>
          <h3 className="font-semibold text-lg">💬 Messaging Room</h3>
          <p className="text-sm text-white/80">Room: {roomId}</p>
        </div>

        <div className="flex gap-2">
          <button
         onClick={handleShare}
         className="bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg text-sm"
        >
           Share
          </button>
          <button
            onClick={getActiveUsers}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-sm"
          >
            Users
          </button>

          <button
            onClick={leaveRoom}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded-lg text-sm"
          >
            Leave
          </button>

          {isRoomOwner && (
            <button
              onClick={() => socket.emit("delete-room", { roomId })}
              className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE USERS POPUP */}
      {showUsers && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-80 rounded-xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                Active Users ({activeUsers.length})
              </h3>
              <button onClick={() => setShowUsers(false)}>✖</button>
            </div>

            {activeUsers.map((user) => (
              <div key={user._id} className="p-2 bg-gray-100 rounded mb-2">
                {user.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">

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
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-sm px-4 py-3 rounded-2xl text-sm shadow-lg
                ${
                  isMe
                    ? "bg-white text-purple-700 rounded-br-none"
                    : "bg-white/20 backdrop-blur-md text-white rounded-bl-none"
                }`}
              >
                <div className="flex justify-between text-xs opacity-70 mb-1">
                  <span>{msg.sender.name}</span>
                  {msg.createdAt && <span>{formatTime(msg.createdAt)}</span>}
                </div>
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 
                      px-6 py-3 flex gap-2">

        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", { roomId });
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-full bg-white/20 text-white 
                     placeholder-white/70 border border-white/30 
                     focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          onClick={sendMessage}
          className="bg-white text-purple-700 px-6 rounded-full font-semibold hover:bg-purple-100"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageRoom;
