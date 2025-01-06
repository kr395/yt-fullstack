import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

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
  console.log(fullname, userName, email, password);
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
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
    username: userName.toLowerCase(),
    email,
    password,
  });

// remove password and redress token field from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while Registering user");
  }
  
  // -- return response

  return res.status(200).json(
    apiResponse(200, "User Registered Successfully", createdUser))
  ;

});

export { registerUser };
