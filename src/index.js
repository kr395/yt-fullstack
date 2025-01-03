// require("dotenv").config({path:"./.env"}); // you can use this sytax also
//INFO: Second Approach to connect to database

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({path:"./.env"}); // you can use this sytax also  


connectDB()
.then(() => {
  app.on("error", (error) => {
          console.log(`ERROR : ${error}`);
          throw error;
        });
  app.listen(process.env.PORT || 8000, () => {
    console.log(` Server is running on ${process.env.PORT}`);
  })
})
.catch((error) => console.log("Mongo DB Connection FAILED !!! : ",error));



















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
