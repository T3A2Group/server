import Villa from "../models/products/villaModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route
import Order from "../models/orderModel.js";

//@desc   Fetch all villas
//@route  Get /api/villa
//@assess All Guest
const getVillaList = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const villas = await Villa.find({ ...keyword });
  //=> {} empty object will give us all villas
  //=>{...keyword} allows client do search and pass keyword to backend filter
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
    category: "villa",
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

//@desc   Create new villa product review
//@route  POST /api/villa/:id/reviews
//@assess Private Client
const createVillaReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const villa = await Villa.findById(req.params.id);

  // Bring in user orders to check if they ordered the product
  const orders = await Order.find({ user: req.user._id });

  // Array of villa name that the user ordered
  const ordersItems = [].concat.apply(
    [],
    orders.map((order) => order.orderItems.map((item) => item.name.toString()))
  );

  if (villa) {
    // Check if the name of the villa matches any of the users ordered villas
    const hasBought = ordersItems.includes(villa.name.toString());

    if (!hasBought) {
      res.status(400);
      throw new Error("You can only leave comments for products you bought");
    }

    //=>this is to check if current client already review the villa and give us a boolean
    const alreadyReviewed = villa.reviews.find(
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
    villa.reviews.push(newReview); //=> add the new review to reviews array

    //after new review added, we need to recalculate the average rating
    villa.numReviews = villa.reviews.length; //total reviews
    // average rating = total rating / total reviews num
    villa.rating =
      villa.reviews.reduce((acc, item) => item.rating + acc, 0) /
      villa.reviews.length;

    //finally save the villa
    await villa.save();
    res.status(201).json({ message: "Thanks for your review!" });
  } else {
    res.status(404);
    throw new Error("Villa not found");
  }
});

export {
  getVillaList,
  getVillaById,
  deleteVilla,
  createVilla,
  updateVilla,
  createVillaReview,
};
