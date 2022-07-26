import Travel from "../models/products/travelModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route

//@desc   Fetch all Travel Plans
//@route  Get /api/travel
//@assess All Guest
const getTravelList = asyncHandler(async (req, res) => {
  const travel = await Travel.find({}); //=> {} empty object will give us all Specialties
  res.json(travel);
});

//@desc   Fetch single travel plan
//@route  Get /api/travel/:id
//@assess All Guest
const getTravelById = asyncHandler(async (req, res) => {
  // const product = products.find((p) => p._id === req.params.id);
  // res.json({ food, specialty, travel, villa });
  const travel = await Travel.findById(req.params.id);
  //if food exist, then send food, else, status 404 and not found message send
  if (travel) {
    res.json(travel);
  } else {
    res.status(404);
    throw new Error(`Travel plan not found!`);
  }
});

//@desc   Delete single travel package
//@route  DELETE /api/travel/:id
//@assess Private Admin
const deleteTravel = asyncHandler(async (req, res) => {
  const travel = await Travel.findById(req.params.id);
  //if travel package exist, then delete travel by id, else, status 404 and not found message send
  if (travel) {
    await travel.remove();
    res.json({ message: `${travel.name} removed` });
  } else {
    res.status(404);
    throw new Error(`Travel Plan not found!`);
  }
});

//@desc   Create single Travel plan
//@route  POST /api/travel
//@assess Private Admin
const createTravel = asyncHandler(async (req, res) => {
  const travel = new Travel({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "sample travel",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
    type: "Sample travel 2 days type",
    duration: "TEST days",
    attractions: {
      name: "TEST Tour Hot Spots",
      briefInfo: "this is test...",
    },
  });

  const createdTravel = await travel.save();
  res.status(201).json(createdTravel);
});

//@desc   Update single travel plan
//@route  PUT /api/travel/:id
//@assess Private Admin
const updateTravel = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    countInStock,
    description,
    type,
    duration,
    attractions,
  } = req.body;

  const travel = await Travel.findById(req.params.id);
  if (travel) {
    travel.name = name;
    travel.price = price;
    travel.image = image;
    travel.countInStock = countInStock;
    travel.description = description;
    travel.duration = duration;
    travel.attractions = attractions;
    travel.type = type;
    const updateTravel = await travel.save();
    res.json(updateTravel);
  } else {
    res.status(404);
    throw new Error("Travel Plan not found");
  }
});

export {
  getTravelList,
  getTravelById,
  deleteTravel,
  createTravel,
  updateTravel,
};
