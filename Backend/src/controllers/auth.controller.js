import mongoose from "mongoose";
import { asyncHandler } from "../utills/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utills/ApiError.js"
import { ApiResponse } from "../utills/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        console.log("USER 👉", user)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        console.log("ACCESS", accessToken)
console.log("REFRESH", refreshToken)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async ( req ,res)=>{
    const {name , email , password } = req.body
    console.log(name , email, password)

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email});

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"something when wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser, "User register successfully")
    )

})

const login = asyncHandler(async (req,res)=>{

    // req body -> data
    // email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email , password } = req.body

    if (!email || !password) {
        throw new ApiError(409, "Email and password is required");
    }

    const existedUser = await User.findOne({email})
    if (!existedUser) {
        throw new ApiError(409 , "user not found");
    }

    const passwordCorrect = await existedUser.isPasswordCorrect(password)

    if(!passwordCorrect){
        throw new ApiError(400 , "Unauthorized User")
    }

    const { accessToken , refreshToken } = await generateAccessAndRefereshTokens(existedUser._id)
    console.log("ACCESS", accessToken)
console.log("REFRESH", refreshToken)
    const loggedInUser = await User.findOne({email}).select(
        "-password -refreshToken"
    )

    const options  = {
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res.status(201)
    .cookie("accessToken" , accessToken , {...options , maxAge : 15 * 60 * 1000})
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(201 , 
            {
                user : loggedInUser , accessToken , refreshToken

            },
             "User Logged In successfully")
    )
})

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});
const getCurrentUser = asyncHandler(async (req , res)=>{
    if (!req.user) {
        throw new ApiError(401 , "Unauthorized ")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "User fetch successfully"
        )
    )
})

export {
    registerUser,
    login,
    logout,
    getCurrentUser
}