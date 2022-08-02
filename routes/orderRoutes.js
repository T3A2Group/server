import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDispatch,
} from "../controllers/orderController.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   For add order items(PUT) and get all orders(Admin only)
router
  .route("/")
  .post(protectUser, addOrderItems)
  .get(protectUser, admin, getAllOrders);
//@desc   For get user orders(GET)
router.route("/myorders").get(protectUser, getMyOrders);
//@desc   For pass the order to frontend(GET)
router.route("/:id").get(protectUser, getOrderById);
//@desc   For update order to paid(PUT)
router.route("/:id/pay").put(protectUser, updateOrderToPaid);
//@desc   For update order to dispatch(PUT)
router.route("/:id/dispatch").put(protectUser, admin, updateOrderToDispatch);

export default router;
