import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full flex items-center justify-between px-8 py-6
    bg-black/30 backdrop-blur-md border-b border-white/20">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="https://static.vecteezy.com/system/resources/previews/006/230/877/large_2x/chat-room-logo-design-chat-message-with-negative-space-door-logo-template-illustration-vector.jpg"
          alt="ChatRoom Logo"
          className="w-10 h-10 rounded-lg"
        />

        <h1 className="text-2xl font-bold text-white tracking-wide">
          ChatRoom
        </h1>
      </div>

    </header>
  );
}

export default Header;