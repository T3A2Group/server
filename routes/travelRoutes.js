import express from "express";
import {
  getTravelList,
  getTravelById,
} from "../controllers/travelControllers.js";
const router = express.Router();

//@desc   Fetch all Travel Plans
router.route("/").get(getTravelList);

//@desc   Fetch single travel plan
router.route("/:id").get(getTravelById);

export default router;
