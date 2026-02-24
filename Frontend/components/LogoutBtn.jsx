import React from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice"

const logoutHandler = async function() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  try {
        await fetch('http://localhost:8000/api/v1/users/logout' , {
          method : "POST",
          headers : {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
    }
  });
   
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
}

function LogoutBtn() {
  return (
    <div>
      <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
    </div>
  )
}

export default LogoutBtn
