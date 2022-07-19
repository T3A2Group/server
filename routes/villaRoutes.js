import express from "express";
import { getVillaList, getVillaById } from "../controllers/villaControllers.js";

const router = express.Router();

//@desc   Fetch all villa list
router.route("/").get(getVillaList);

//@desc   Fetch single villa
router.route("/:id").get(getVillaById);

export default router;
