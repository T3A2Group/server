import express from "express";
import {
  getTravelList,
  getTravelById,
  deleteTravel,
  createTravel,
  updateTravel,
  createTravelReview,
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

//@desc   Post single travel review
router.route("/:id/reviews").post(protectUser, createTravelReview);

export default router;
