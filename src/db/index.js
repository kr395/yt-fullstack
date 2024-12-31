import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
  try {
    const connectionInfo = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`Mongo DB Connected !!!! : ${connectionInfo.connection.host}`);
  } catch (error) {
    console.log("Mongo DB Connection FAILED : ",error);
    process.exit(1);
  }
};

export default connectDB;