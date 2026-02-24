import {Chat} from "../models/chat.model.js"
import {Room} from "../models/room.model.js"
import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";


const sendMessage = asyncHandler(async (req,res)=>{
    const {roomId , message} = req.body

    if (!roomId){
        throw new ApiError(400 , "RoomId is required")
    }
    if (!message){
        throw new ApiError(400 , "enter message")
    }
    const checkRoom = await Room.findOne({roomId})
    if(!checkRoom){
        throw new ApiError(400 , "Room not Exist")
    }
    res.status(200)
    .json(
        new ApiResponse(200 , {
            success : true,
            message,
        } , "message send successfully")
    )
})


const getRoomMessage = asyncHandler(async (req , res) => {
    const { roomId }  = req.params;
    if (!roomId) {
        throw new ApiError(400 , "room id is required")
    }
    const room = await Room.findOne({ roomId: roomId });
    
      if (!room) {
        throw new ApiError(404, "Room not found");
      }

    const messages = await Chat.findById(room._id)
    .populate("sender" , "name email")
    .sort({createdAt : 1})
    .lean();

    res.status(200).
    json(
        new ApiResponse(200 ,{
        success: true,
        count: messages.length,
        messages,
    }))
    
})


export {
    sendMessage,
    getRoomMessage
}

