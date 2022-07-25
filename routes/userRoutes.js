import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
} from "../controllers/userControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   For user sign up and only admin can find all user list
router.route("/").post(registerUser).get(protectUser, admin, getUsers);
//@desc   For user login
router.post("/login", authUser);
//@desc   For user profile and if there is user update profile
router
  .route("/profile")
  .get(protectUser, getUserProfile)
  .put(protectUser, updateUserProfile);
//@desc   For Admin delete,find and update user
router
  .route("/:id")
  .delete(protectUser, admin, deleteUser)
  .get(protectUser, admin, getUserById)
  .put(protectUser, admin, updateUserById);

export default router;
