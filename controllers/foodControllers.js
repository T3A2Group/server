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
    category: "sample food",
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

export { getFoodList, getFoodById, deleteFood, createFood, updateFood };
