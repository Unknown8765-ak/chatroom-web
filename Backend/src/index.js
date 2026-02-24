import dbConnection from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js"
dotenv.config({
    path : "./.env"
})
import http from "http";
import { initSocket } from "./socket/index.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

initSocket(server);

dbConnection()
    .then(()=>{
        server.listen(PORT ,()=>{
            console.log(`server is running on Port ${process.env.PORT || 8000}`)
        })
    })
    .catch((error)=>{
        console.log("mongoose connection error" , error);
    })