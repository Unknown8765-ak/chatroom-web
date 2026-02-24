import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import errorHandler from "./middlewares/error.middleware.js"
const app = express()

app.use(cookieParser())

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials : true
    })
)

app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))

import userRouter from "./routes/auth.route.js"
import roomRouter from "./routes/room.route.js";
import chatRouter from "./routes/chat.route.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/rooms",roomRouter)
app.use("/api/v1/chats",chatRouter)

app.use(errorHandler);


export { app }