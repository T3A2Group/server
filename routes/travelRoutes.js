import express from "express";
import {
  getTravelList,
  getTravelById,
  deleteTravel,
  createTravel,
  updateTravel,
} from "../controllers/travelControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   Fetch all Travel Plans and create new travel plan
router.route("/").get(getTravelList).post(protectUser, admin, createTravel);

//@desc   Fetch single travel plan(read,delete and update)
router
  .route("/:id")
  .get(getTravelById)
  .delete(protectUser, admin, deleteTravel)
  .put(protectUser, admin, updateTravel);

export default router;
