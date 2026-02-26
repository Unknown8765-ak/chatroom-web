import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../features/auth/authSlice";
import Header from "../components/Header";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Signupsubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Signup Failed");
      }

      console.log("Signup success", result);

      // auto login after signup
      dispatch(login(result.user));

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

      <Header />

      
      <div className="flex-1 flex items-center justify-center px-4">

        <form
          onSubmit={handleSubmit(Signupsubmit)}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl 
                     p-8 rounded-3xl shadow-2xl border border-white/20 
                     flex flex-col gap-5"
        >
          <h2 className="text-3xl font-bold text-center text-white">
            Create Account 🚀
          </h2>

          <p className="text-center text-white/80 text-sm">
            Join and start chatting instantly
          </p>

       
          <div>
            <Input
              label="Name"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className="bg-white/20 text-white placeholder-white/70 border-white/30"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

         
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="bg-white/20 text-white placeholder-white/70 border-white/30"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

      
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              {...register("password", { required: "Password is required" })}
              className="bg-white/20 text-white placeholder-white/70 border-white/30"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

         
          {error && (
            <p className="text-red-200 text-sm text-center bg-red-500/20 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            bgColor="bg-gradient-to-r from-indigo-600 to-purple-600"
            className="w-full py-2 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-sm text-center text-white/80">
            Already have an account?{" "}
            <span
              className="text-white font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Signup;















// import React  , { useState } from 'react'
// import { useForm } from 'react-hook-form';
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom"
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { login } from "../features/auth/authSlice"
// import Header from '../components/Header';

// function Signup() {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm()
//   const API_URL = import.meta.env.VITE_API_URL;
//     const [loading, setLoading] = useState(false)
//     const [error , setError]  = useState();
// const Signupsubmit = async (data)=>{

//     try {
//        const res  = await fetch(`${API_URL}/api/v1/users/register` ,{
//         method : "POST",
//         headers : {
//              "Content-Type": "application/json",
//           },
//           body : JSON.stringify(data)
//        })

//        const result = await res.json()

//        if(!res.ok){
//         throw new Error(result.message || "Signup Failed")
//        }

//         console.log("Signup success", result);
//         localStorage.setItem("token", result.token)

//         dispatch(login(result.user))
  
//         navigate("/login");

//        } catch (error) {
//           console.error(error.message);
//          }
//          finally {
//             setLoading(false);
// }
// }

//     return (
//       <div className=" bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

//   <Header />

//  <div className="min-h-screen flex items-center justify-center 
//                   bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">

//     <form
//       onSubmit={handleSubmit(Signupsubmit)}
//       className="w-full max-w-md bg-white/10 backdrop-blur-xl 
//                  p-8 rounded-3xl shadow-2xl border border-white/20 
//                  flex flex-col gap-5"
//     >
      
//       <h2 className="text-3xl font-bold text-center text-white">
//         Create Account 🚀
//       </h2>

//       <p className="text-center text-white/80 text-sm">
//         Join and start chatting instantly
//       </p>

      
//       <div>
//         <Input
//           label="Name"
//           placeholder="Enter your name"
//           {...register("name", { required: true })}
//           className="bg-white/20 text-black placeholder-white/70 border-white/30"
//         />
//       </div>

//       <div>
//         <Input
//           label="Email"
//           type="email"
//           placeholder="Enter your email"
//           {...register("email", { required: true })}
//           className="bg-white/20 text-black placeholder-white/70 border-white/30"
//         />
//       </div>

     
//       <div>
//         <Input
//           label="Password"
//           type="password"
//           placeholder="Create a password"
//           {...register("password", { required: true })}
//           className="bg-white/20 text-black placeholder-white/70 border-white/30"
//         />
//       </div>

//       {error && (
//         <p className="text-red-200 text-sm text-center bg-red-500/20 py-2 rounded-lg">
//           {error}
//         </p>
//       )}

//       <Button
//         type="submit"
//         disabled={loading}
//         bgColor="bg-gradient-to-r from-indigo-600 to-purple-600"
//         className="w-full py-2 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
//       >
//         {loading ? "Creating account..." : "Sign Up"}
//       </Button>

//       <p className="text-sm text-center text-white/80">
//         Already have an account?{" "}
//         <span
//           className="text-white font-semibold cursor-pointer hover:underline"
//           onClick={() => navigate("/login")}
//         >
//           Login
//         </span>
//       </p>

//     </form>
//   </div>
// </div>

    
// );
// }

// export default Signup
