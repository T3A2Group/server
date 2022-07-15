import express from "express";
import Villa from "../models/products/villaModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route
const router = express.Router();

//@desc   Fetch all villas
//@route  Get /api/villas
//@assess All Guest
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const villas = await Villa.find({}); //=> {} empty object will give us all villas
    res.json(villas);
  })
);

//@desc   Fetch single villa
//@route  Get /api/villas/:id
//@assess All Guest
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // const product = products.find((p) => p._id === req.params.id);
    // res.json({ food, specialty, travel, villa });
    const villa = await Villa.findById(req.params.id);
    //if villa exist, then send villa, else, status 404 and not found message send
    if (villa) {
      res.json(villa);
    } else {
      res.status(404);
      throw new Error(`Villa not found!`);
    }
  })
);

export default router;
