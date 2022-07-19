import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
} from "../controllers/userControllers.js";
import { protectUser } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   For user sign up
router.route("/").post(registerUser);
//@desc   For user login
router.post("/login", authUser);
//@desc   For user profile
router.route("/profile").get(protectUser, getUserProfile);

export default router;
