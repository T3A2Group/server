import express from "express";
import {
  getVillaList,
  getVillaById,
  deleteVilla,
  createVilla,
  updateVilla,
  createVillaReview,
} from "../controllers/villaControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@desc   Fetch all villa list and create new villa
router.route("/").get(getVillaList).post(protectUser, admin, createVilla);
//@desc   Fetch single villa (read,delete and update)
router
  .route("/:id")
  .get(getVillaById)
  .delete(protectUser, admin, deleteVilla)
  .put(protectUser, admin, updateVilla);
//@desc   Post single villa review
router.route("/:id/reviews").post(protectUser, createVillaReview);
export default router;
