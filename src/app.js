import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
//Use is for configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// for normal Json
app.use(express.json({
  limit: "16kb",

}));
// for url request
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
}))
// this is for public assets
app.use(express.static("public"));
// for cookies // for secure cookie CRED Options
app.use(cookieParser());


//routes
import userRoutes from "./routes/user.routes.js";

//routes Declaration
app.use("/api/v1/users", userRoutes);








export { app };
