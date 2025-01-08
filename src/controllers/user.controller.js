import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// to generate 'Access token and refresh token at same time
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({message : "User Registered Successfully"});
  // You have to define steps to solve a problem

  //get user details form frontend

  //validate user details
  // -- fields are Empty or not?
  // -- Check User is Already Registered or not?
  // -- check for images / Avatar
  // upload them in cloudinary // Check avatar is uploaded or not?
  // create user object -- create entry on database
  // remove password and redress token field from response
  // check for user creation
  // -- return response

  // Coding --

  // get user details
  const { fullName, userName, email, password } = req.body;
  // console.log(fullName, userName, email, password);
  // if (fullname === "" || userName === "" || email === "" || password === "") {
  //   throw new apiError(400, "Please fill all the fields");

  // }
  // -- fields are Empty or not?
  if (
    [fullName, userName, email, password].some(
      (field) => field?.trim().length === 0
    )
  ) {
    throw new apiError(400, "Please fill all the fields");
  }
  // -- Check User is Already Registered or not?
  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existingUser) {
    throw new apiError(409, "User already registered");
  }

  // -- check for images / Avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Please upload avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Check avatar is uploaded or not?
  if (!avatar) {
    throw new apiError(400, "Please upload avatar");
  }

  //  create user object -- create entry on database

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    userName: userName.toLowerCase(),
    email,
    password,
  });

  // remove password and redress token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while Registering user");
  }

  // -- return response

  return res
    .status(200)
    .json(new apiResponse(200, "User Registered Successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  //STEP: 1  // get user details from frontend
  //STEP: 2  // Check user is registered or not // username // email
  //STEP: 3  // Check password is correct or not
  //STEP: 4  // create access token // refresh token
  //STEP: 5  // Send Secure Cookies to frontend
  //STEP: 5  // return response

  //IMP: Implementation

  //STEP: 1  // get user details from frontend

  const { email, userName, password } = req.body;

  if ([email, userName, password].some((field) => field?.trim().length === 0)) {
    throw new apiError(400, "Please fill all the fields");
  } else if (!email && !userName) {
    throw new apiError(400, "Please enter email or username");
  }

  //STEP: 2  // Check user is registered or not // username // email
  const LoggedUser = await User.findOne({
    $or: [{ email }, { password }],
  });
  if (!LoggedUser) {
    throw new apiError(
      404,
      "You are not Registered with Us. Please Register Yourself"
    );
  }

  //STEP: 3  // Check password is correct or not

  const isPasswordValid = await LoggedUser.isPasswordMatch(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Incorrect Password");
  }

  //STEP: 4  // create access token // refresh token

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(LoggedUser._id);

  const LoggedInUser = await User.findById(LoggedUser._id).select(
    "-password -refreshToken"
  );

  //STEP: 5  // Send Secure Cookies to frontend

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: LoggedInUser,
          accessToken,
          refreshToken,
        },
        "Login Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Create Middleware of auth middleware
  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200,{}, "Logout Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
 try {
   //STEP: 1  // get refresh token from frontend // cookie // header // Body
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if ( !incomingRefreshToken ) {
     throw new apiError(401, "Please Login First to Access This Resource");
     
    }
   //STEP: 2  // Check refresh token is valid or not
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
   
   const user = await User.findById(decodedToken._id, (err, user) => {
     
   })
 
   if ( !user ) {
     throw new apiError(401, "Invalid refresh token");
    }
 
    if ( user?.refreshToken !== incomingRefreshToken ) {
     throw new apiError(401, "Refresh token is expired or used");
    }
 
    
    //STEP: 3  // create new access token and refresh token
    const options = {
     httpOnly: true,
     secure: true,
   };
    const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id, res, options);
 
   //STEP: 4  // Send new access token to frontend // Cockie
   
 
   //STEP: 5  // return response
 
   return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
       new apiResponse(
         200,
         {
           accessToken,
           refreshToken : newRefreshToken,
         }
       )
     );
 } catch (error) {
   throw new apiError(401, error?.message || "Invalid refresh token");
 }



});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
