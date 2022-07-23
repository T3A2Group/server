import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} from "../controllers/orderController.js";
import { protectUser } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   For add order items(PUT)
router.route("/").post(protectUser, addOrderItems);
//@desc   For get user orders(GET)
router.route("/myorders").get(protectUser, getMyOrders);
//@desc   For pass the order to frontend(GET)
router.route("/:id").get(protectUser, getOrderById);
//@desc   For update order to paid(PUT)
router.route("/:id/pay").put(protectUser, updateOrderToPaid);

export default router;
