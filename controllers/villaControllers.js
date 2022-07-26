import Villa from "../models/products/villaModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route

//@desc   Fetch all villas
//@route  Get /api/villa
//@assess All Guest
const getVillaList = asyncHandler(async (req, res) => {
  const villas = await Villa.find({}); //=> {} empty object will give us all villas
  res.json(villas);
});

//@desc   Fetch single villa
//@route  Get /api/villa/:id
//@assess All Guest
const getVillaById = asyncHandler(async (req, res) => {
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
});

//@desc   Delete single villa
//@route  DELETE /api/villa/:id
//@assess Private Admin
const deleteVilla = asyncHandler(async (req, res) => {
  const villa = await Villa.findById(req.params.id);
  //if villa exist, then delete villa by id, else, status 404 and not found message send
  if (villa) {
    await villa.remove();
    res.json({ message: `${villa.name} removed` });
  } else {
    res.status(404);
    throw new Error(`Villa not found!`);
  }
});

//@desc   Create single villa
//@route  POST /api/villa
//@assess Private Admin
const createVilla = asyncHandler(async (req, res) => {
  const villa = new Villa({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "sample villa",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
    roomNums: 2,
    maxPeople: 4,
    type: "Sample view type",
  });

  const createdVilla = await villa.save();
  res.status(201).json(createdVilla);
});

//@desc   Update single villa
//@route  PUT /api/villa/:id
//@assess Private Admin
const updateVilla = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    countInStock,
    description,
    roomNums,
    maxPeople,
    type,
  } = req.body;

  const villa = await Villa.findById(req.params.id);
  if (villa) {
    villa.name = name;
    villa.price = price;
    villa.image = image;
    villa.countInStock = countInStock;
    villa.description = description;
    villa.roomNums = roomNums;
    villa.maxPeople = maxPeople;
    villa.type = type;
    const updateVilla = await villa.save();
    res.json(updateVilla);
  } else {
    res.status(404);
    throw new Error("Villa not found");
  }
});

export { getVillaList, getVillaById, deleteVilla, createVilla, updateVilla };
