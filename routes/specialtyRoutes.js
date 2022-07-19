import express from "express";
import {
  getSpecialtyList,
  getSpecialtyById,
} from "../controllers/specialtyControllers.js";
const router = express.Router();

//@desc   Fetch all Specialties
router.route("/").get(getSpecialtyList);

//@desc   Fetch single specialty
router.route("/:id").get(getSpecialtyById);

export default router;
