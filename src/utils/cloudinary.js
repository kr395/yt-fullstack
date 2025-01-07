import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Upload an image

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!fs.existsSync(localFilePath)) return false;

    //upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file uploaded
    // console.log("File is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath); // remove the local temp file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the local temp file as upload failed

    console.log(error);
  }
};

export { uploadOnCloudinary };
