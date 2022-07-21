import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { protectUser } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   For user sign up
router.route("/").post(registerUser);
//@desc   For user login
router.post("/login", authUser);
//@desc   For user profile and if there is user update profile
router
  .route("/profile")
  .get(protectUser, getUserProfile)
  .put(protectUser, updateUserProfile);

export default router;
