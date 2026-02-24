import { User } from "../models/user.model";
import jwt from "jsonwebtoken";


io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("accessToken=")[1]
      ?.split(";")[0];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    socket.user = user; // 🔥 THIS LINE IS EVERYTHING
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});
