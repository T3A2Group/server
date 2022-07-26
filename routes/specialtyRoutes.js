import express from "express";
import {
  getSpecialtyList,
  getSpecialtyById,
  deleteSpecialty,
} from "../controllers/specialtyControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//@desc   Fetch all Specialties
router.route("/").get(getSpecialtyList);

//@desc   Fetch single specialty(CRUD)
router
  .route("/:id")
  .get(getSpecialtyById)
  .delete(protectUser, admin, deleteSpecialty);

export default router;
