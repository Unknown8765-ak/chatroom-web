import {configureStore} from "@reduxjs/toolkit"
import authSlice from "../features/auth/authSlice"
import chatSlice from "../features/chat/chatSlice"
import roomSlice from "../features/room/roomSlice"
const store = configureStore({
    reducer : {
        auth : authSlice,
        chat : "",
        room : ""
    }
})

export default store
