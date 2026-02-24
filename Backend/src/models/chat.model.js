import mongoose, { Schema } from "mongoose";

const chatschema = new mongoose.Schema(
    {
        roomId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Room",
            required : true
        },
        sender : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        content : {
            type : String,
            required : true,
            trim : true
        },
    },{timestamps : true}
);

export const Chat = mongoose.model("Chat" , chatschema)