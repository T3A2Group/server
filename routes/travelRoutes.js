import express from "express";
import {
  getTravelList,
  getTravelById,
  deleteTravel,
} from "../controllers/travelControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   Fetch all Travel Plans
router.route("/").get(getTravelList);

//@desc   Fetch single travel plan(CRUD)
router
  .route("/:id")
  .get(getTravelById)
  .delete(protectUser, admin, deleteTravel);

export default router;
