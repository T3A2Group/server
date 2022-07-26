import express from "express";
import {
  getVillaList,
  getVillaById,
  deleteVilla,
} from "../controllers/villaControllers.js";
import { protectUser, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@desc   Fetch all villa list
router.route("/").get(getVillaList);
//@desc   Fetch single villa (CRUD)
router.route("/:id").get(getVillaById).delete(protectUser, admin, deleteVilla);

export default router;
