import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createRoom, joinRoom ,leaveRoom,getMyRooms ,getRoomParticipants ,deleteRoom} from "../controllers/room.controller.js";


const router = Router()

router.post("/create",verifyJWT , createRoom)
router.post("/:roomId/join" , verifyJWT , joinRoom)
router.post("/:roomId/leave", verifyJWT, leaveRoom);
router.get("/my-rooms", verifyJWT, getMyRooms);
router.delete("/:roomId", verifyJWT, deleteRoom)
router.get("/:roomId/participants", verifyJWT, getRoomParticipants);

export default router