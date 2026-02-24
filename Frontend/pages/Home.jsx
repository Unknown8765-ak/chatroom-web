import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { logout } from "../features/auth/authSlice";
import Header from "../components/Header";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_API_URL;
  const { status: authStatus, loading } = useSelector(
    (state) => state.auth
  );

  console.log("AUTH STATE 👉", authStatus);

  if (loading) {
    return (
      <div className="w-full py-16 text-center">
        Loading...
      </div>
    );
  }

  async function handleLogout() {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      await response.json();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      dispatch(logout());
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

      
    <Header/>
      <div className="flex items-center justify-center px-4 py-20">
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-white/20">
          
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide">
            🚀 Welcome to ChatRoom
          </h1>

          {loading ? (
            <div className="text-white text-lg animate-pulse">
              Loading...
            </div>
          ) : !authStatus ? (
            <>
              <p className="text-white/80 mb-8 text-lg">
                Login or Signup to create or join a room
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => navigate("/login")}
                  bgColor="bg-black/70 text-white hover:bg-black"
                >
                  Login
                </Button>

                <Button
                  onClick={() => navigate("/signup")}
                  bgColor="bg-black/70 text-white hover:bg-black"
                >
                  Signup
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/80 mb-8 text-lg">
                Start chatting now 🔥
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  bgColor="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => navigate("/create-room")}
                >
                  Create Room
                </Button>

                <Button
                  bgColor="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => navigate("/join-room")}
                >
                  Join Room
                </Button>

                <Button
                  bgColor="bg-red-500 hover:bg-red-600 text-white"
                  onClick={async () => {
                    await handleLogout();
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;



