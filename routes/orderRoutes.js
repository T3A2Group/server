import express from "express";
import { addOrderItems } from "../controllers/orderController.js";
import { protectUser } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   For order items
router.route("/").post(protectUser, addOrderItems);

export default router;
