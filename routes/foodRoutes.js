import express from "express";
import Food from "../models/products/foodModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route
const router = express.Router();

//@desc   Fetch all food
//@route  Get /api/food
//@assess All Guest
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const food = await Food.find({}); //=> {} empty object will give us all food
    // res.status(401);
    // throw new Error("Not Authorized");
    res.json(food);
  })
);

//@desc   Fetch single food
//@route  Get /api/food/:id
//@assess All Guest
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // const product = products.find((p) => p._id === req.params.id);
    // res.json({ food, specialty, travel, villa });
    const food = await Food.findById(req.params.id);
    //if food exist, then send food, else, status 404 and not found message send
    if (food) {
      res.json(food);
    } else {
      res.status(404);
      throw new Error(`Food not found!`);
    }
  })
);

export default router;
