// import Chat from "../models/chat.model.js"
import {Room} from "../models/room.model.js"
import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";

const createRoom = asyncHandler(async (req ,res) => {
    const {roomId , name} = req.body;
    console.log(roomId)
    console.log(name)
    if (!name || !roomId) {
    throw new ApiError(400, "All fields are required");
  }
  const existingRoom = await Room.findOne({ roomId });
  // console.log(existingRoom)
  if (existingRoom) {
    throw new ApiError(409, "Room code already exists");
  }
  const room = await Room.create({
    roomId,
    name,
    createdBy : req.user?._id,
    participants: [req.user._id],
    participantsHistory: [req.user._id],
    isActive: true,
  })
  console.log(room)

  if(!room){
    throw new ApiError(500, "Failed to create room");
  }
  res.status(201)
  .json(
    new ApiResponse(
      201, {
        room,
        success: true,
      }, "Room created successfully"
    ));

})

const joinRoom = asyncHandler(async (req ,res) => {
    const { roomId } = req.params
    const  userId  = req.user?._id
    if(!roomId){
      throw new ApiError(400, "RoomId is Required")
    }

    const room = await Room.findOne ({roomId})

     if (!room || !room.isActive) {
    throw new ApiError(404, "Room not found or inactive");
  }

    const isAlreadyParticipant = room.participants.some(
    (id) => id.toString() === userId.toString()
  );  
  console.log(isAlreadyParticipant)
  if (isAlreadyParticipant) {
    return res.status(200).json(
      new ApiResponse(200 ,
        {
      success: true,
      alreadyJoined: true,
      message: "You are already a participant",
      roomId: room.roomId, 
        },
        "You are already a participant"
      )
    )
  }

  room.participants.push(userId);
  room.participantsHistory.push(userId);
  await room.save();

  return res.status(200).json(
    new ApiResponse(200, 
      {
    success: true,
    alreadyJoined: false,
    message: "Joined room successfully",
    roomId: room.roomId,
  })
  );
})

const leaveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params; 

  const room = await Room.findOne({ roomId: roomId });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

     const updatedRoom = await Room.findByIdAndUpdate(
    room._id,
    { $pull: { participants: req.user?._id } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Left room successfully",
    room: updatedRoom,
  });
});


const getRoomParticipants = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if(!roomId){
    throw new ApiError(400 , "roomId is required");
  }
  
  const room = await Room.findOne({ roomId: roomId })
  
  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }
  const activeUser = await Room.findById(room._id)
  .populate("participants", "name email avatar")
  .populate("participantsHistory", "name email avatar");

  if (!activeUser) {
    throw new ApiError(400 , "room not found issue")
  }
  res.status(200).json({
    success: true,

    activeParticipantsCount: activeUser.participants.length,
    activeParticipants: activeUser.participants,
    
    totalParticipantsCount: activeUser.participantsHistory.length,
    participantsHistory: activeUser.participantsHistory,
  });
});

const getMyRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ createdBy: req.user._id }).lean();

  const formattedRooms = rooms.map(room => ({
    _id: room._id,
    name: room.name,
    roomId: room.roomId,
    createdAt: room.createdAt,
    totalMembers: room.participants.length,
    isActive: room.isActive
  }));

  res.status(200).json({
    success: true,
    totalRooms: formattedRooms.length,
    rooms: formattedRooms
  });
});
export {
  createRoom,
  joinRoom,
  leaveRoom,
  getMyRooms,
  getRoomParticipants
}