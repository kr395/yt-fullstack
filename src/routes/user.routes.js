import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.mw.js";
import { verifyJWT } from "../middlewares/auth.mw.js";

const router = Router();

router.route("/register").post(
  upload.fields(
    [{ 
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }]
  ),
  registerUser
);

router.route("/login").post(loginUser);

// Secured Route

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessTokenb)

export default router;