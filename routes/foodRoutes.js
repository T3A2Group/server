import express from "express";
import {
  getFoodList,
  getFoodById,
  deleteFood,
  createFood,
  updateFood,
} from "../controllers/foodControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   Fetch all food list and create new food product
router.route("/").get(getFoodList).post(protectUser, admin, createFood);

//@desc   Fetch single food(read,delete and update)
router
  .route("/:id")
  .get(getFoodById)
  .delete(protectUser, admin, deleteFood)
  .put(protectUser, admin, updateFood);

export default router;
