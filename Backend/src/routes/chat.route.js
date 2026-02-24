import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getRoomMessage, sendMessage } from "../controllers/chat.controller.js";

const router = Router()

router.route("/",verifyJWT,sendMessage)
router.route("/:roomId/messages" ,verifyJWT , getRoomMessage);

export default router;