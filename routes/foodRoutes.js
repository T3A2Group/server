import express from "express";
import {
  getFoodList,
  getFoodById,
  deleteFood,
} from "../controllers/foodControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   Fetch all food list
router.route("/").get(getFoodList);

//@desc   Fetch single food(CRUD)
router.route("/:id").get(getFoodById).delete(protectUser, admin, deleteFood);

export default router;
