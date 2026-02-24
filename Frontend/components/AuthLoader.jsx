import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { login, logout, stopLoading } from "../features/auth/authSlice"

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch()
  const API_URL = "https://chatroom-web-x44l.onrender.com"

  useEffect(() => {
    const loadUser = async () => {
      console.log("AUTH CHECK START 🚀")

      try {
        const res = await fetch(
          `${API_URL}/api/v1/users/me`,
          { credentials: "include" }
        )

        const data = await res.json()
        console.log("ME RESPONSE", data);


        if (!res.ok || !data.data || !data.data._id) {
          throw new Error("Not logged in")
        }
        console.log(data.data)
        dispatch(login(data.data))
      } catch (err) {
        dispatch(logout())
      } finally {
        dispatch(stopLoading())
        console.log("AUTH CHECK DONE")
      }
    }

    loadUser()
  }, [dispatch])

  return children
}

export default AuthLoader
