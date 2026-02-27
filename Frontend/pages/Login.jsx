import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../features/auth/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const API_URL = import.meta.env.VITE_API_URL;

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const Loginsubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("LOGIN RESPONSE", result);

      if (!res.ok) {
        throw new Error(result.message);
      }

     dispatch(login(result.data.user));
      navigate("/create-room");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

      <Header />

      <div className="flex-1 flex items-center justify-center px-4">

        <form
          onSubmit={handleSubmit(Loginsubmit)}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl 
                     p-8 rounded-3xl shadow-2xl border border-white/20 
                     flex flex-col gap-5"
        >
          <h2 className="text-3xl font-bold text-center text-white">
            Welcome Back 👋
          </h2>

          <p className="text-center text-white/80 text-sm">
            Login to continue chatting
          </p>

          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

    
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

         
          {serverError && (
            <p className="text-red-500 text-sm text-center bg-red-100 py-2 rounded-lg">
              {serverError}
            </p>
          )}

         
          <Button
            type="submit"
            bgColor="bg-gradient-to-r from-indigo-600 to-purple-600"
            className="w-full py-2 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm text-center text-white/80">
            Don’t have an account?{" "}
            <span
              className="text-white font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Login;