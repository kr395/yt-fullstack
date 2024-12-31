// require("dotenv").config({path:"./.env"}); // you can use this sytax also
//INFO: Second Approach to connect to database

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({path:"./.env"}); // you can use this sytax also  
// import 'dotenv/config' // New Syntax form documentation
connectDB();




















//INFO: First Approach to connect to database

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

// import { express } from "express";
// const app = express();
// //INFO: this two brackets used to execute code immidiately

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

//     app.on("error", (error) => {
//       console.log(`ERROR : ${error}`);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Example app listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(`ERROR : ${error}`);
//     throw error;
//   }
// })();
