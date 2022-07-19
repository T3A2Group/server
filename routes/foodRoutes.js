import express from "express";
import { getFoodList, getFoodById } from "../controllers/foodControllers.js";
const router = express.Router();

//@desc   Fetch all food list
router.route("/").get(getFoodList);

//@desc   Fetch single food
router.route("/:id").get(getFoodById);

export default router;
