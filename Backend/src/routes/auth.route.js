import { Router } from "express";
import { getCurrentUser, login, logout, registerUser } from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/me").get(verifyJWT,getCurrentUser)


export default router





