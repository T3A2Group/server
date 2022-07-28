import Food from "../models/products/foodModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route

//@desc   Fetch all food
//@route  Get /api/food
//@assess All Guest
const getFoodList = asyncHandler(async (req, res) => {
  const food = await Food.find({}); //=> {} empty object will give us all food
  // res.status(401);
  // throw new Error("Not Authorized");
  res.json(food);
});

//@desc   Fetch single food
//@route  Get /api/food/:id
//@assess All Guest
const getFoodById = asyncHandler(async (req, res) => {
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
});

//@desc   Delete single food
//@route  DELETE /api/food/:id
//@assess Private Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  //if food exist, then delete food by id, else, status 404 and not found message send
  if (food) {
    await food.remove();
    res.json({ message: `${food.name} removed` });
  } else {
    res.status(404);
    throw new Error(`Food not found!`);
  }
});

//@desc   Create single food
//@route  POST /api/food
//@assess Private Admin
const createFood = asyncHandler(async (req, res) => {
  const food = new Food({
    name: "Sample Food",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "food",
    countInStock: 10,
    numReviews: 0,
    description: "Sample Food Info",
    type: "Sample Food type",
  });

  const createdFood = await food.save();
  res.status(201).json(createdFood);
});

//@desc   Update single food
//@route  PUT /api/food/:id
//@assess Private Admin
const updateFood = asyncHandler(async (req, res) => {
  const { name, price, image, countInStock, description, type } = req.body;

  const food = await Food.findById(req.params.id);
  if (food) {
    food.name = name;
    food.price = price;
    food.image = image;
    food.countInStock = countInStock;
    food.description = description;
    food.type = type;
    const updateFood = await food.save();
    res.json(updateFood);
  } else {
    res.status(404);
    throw new Error("Food not found");
  }
});

//@desc   Create new food product review
//@route  POST /api/food/:id/reviews
//@assess Private Client
const createFoodReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const food = await Food.findById(req.params.id);

  if (food) {
    //=>this is to check if current client already review the food and give us a boolean
    const alreadyReviewed = food.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already commented...");
    }

    //otherwise, if current client don't review, then they can leave the comment.
    const newReview = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    food.reviews.push(newReview); //=> add the new review to reviews array

    //after new review added, we need to recalculate the average rating
    food.numReviews = food.reviews.length; //total reviews
    // average rating = total rating / total reviews num
    food.rating =
      food.reviews.reduce((acc, item) => item.rating + acc, 0) /
      food.reviews.length;

    //finally save the food
    await food.save();
    res.status(201).json({ message: "Thanks for your review!" });
  } else {
    res.status(404);
    throw new Error("Food not found");
  }
});

export {
  getFoodList,
  getFoodById,
  deleteFood,
  createFood,
  updateFood,
  createFoodReview,
};
