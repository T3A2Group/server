import Specialty from "../models/products/specialtyModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route
import Order from "../models/orderModel.js";

//@desc   Fetch all specialty list
//@route  Get /api/specialty
//@assess All Guest
const getSpecialtyList = asyncHandler(async (req, res) => {
  const specialties = await Specialty.find({}); //=> {} empty object will give us all Specialties
  res.json(specialties);
});

//@desc   Fetch single specialty
//@route  Get /api/specialty/:id
//@assess All Guest
const getSpecialtyById = asyncHandler(async (req, res) => {
  // const product = products.find((p) => p._id === req.params.id);
  // res.json({ food, specialty, travel, villa });
  const specialty = await Specialty.findById(req.params.id);
  //if food exist, then send food, else, status 404 and not found message send
  if (specialty) {
    res.json(specialty);
  } else {
    res.status(404);
    throw new Error(`Specialty not found!`);
  }
});

//@desc   Delete single specialty
//@route  DELETE /api/specialty/:id
//@assess Private Admin
const deleteSpecialty = asyncHandler(async (req, res) => {
  const specialty = await Specialty.findById(req.params.id);
  //if specialty exist, then delete specialty by id, else, status 404 and not found message send
  if (specialty) {
    await specialty.remove();
    res.json({ message: `${specialty.name} removed` });
  } else {
    res.status(404);
    throw new Error(`Specialty not found!`);
  }
});

//@desc   Create single specialty
//@route  POST /api/specialty
//@assess Private Admin
const createSpecialty = asyncHandler(async (req, res) => {
  const specialty = new Specialty({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "specialty",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Gift Description",
    type: "Sample gift type",
  });

  const createdSpecialty = await specialty.save();
  res.status(201).json(createdSpecialty);
});

//@desc   Update single specialty
//@route  PUT /api/specialty/:id
//@assess Private Admin
const updateSpecialty = asyncHandler(async (req, res) => {
  const { name, price, image, countInStock, description, type } = req.body;

  const specialty = await Specialty.findById(req.params.id);
  if (specialty) {
    specialty.name = name;
    specialty.price = price;
    specialty.image = image;
    specialty.countInStock = countInStock;
    specialty.description = description;
    specialty.type = type;
    const updateSpecialty = await specialty.save();
    res.json(updateSpecialty);
  } else {
    res.status(404);
    throw new Error("Specialty not found");
  }
});

//@desc   Create new specialty product review
//@route  POST /api/specialty/:id/reviews
//@assess Private Client
const createSpecialtyReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const specialty = await Specialty.findById(req.params.id);

  // Bring in user orders to check if they ordered the product
  const orders = await Order.find({ user: req.user._id });

  // Array of villa name that the user ordered
  const ordersItems = [].concat.apply(
    [],
    orders.map((order) => order.orderItems.map((item) => item.name.toString()))
  );

  if (specialty) {
    // Check if the name of the specialty matches any of the users ordered specialties
    const hasBought = ordersItems.includes(specialty.name.toString());

    if (!hasBought) {
      res.status(400);
      throw new Error("You can only leave comments for products you bought");
    }

    //=>this is to check if current client already review the specialty and give us a boolean
    const alreadyReviewed = specialty.reviews.find(
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
    specialty.reviews.push(newReview); //=> add the new review to reviews array

    //after new review added, we need to recalculate the average rating
    specialty.numReviews = specialty.reviews.length; //total reviews
    // average rating = total rating / total reviews num
    specialty.rating =
      specialty.reviews.reduce((acc, item) => item.rating + acc, 0) /
      specialty.reviews.length;

    //finally save the specialty
    await specialty.save();
    res.status(201).json({ message: "Thanks for your review!" });
  } else {
    res.status(404);
    throw new Error("Specialty not found");
  }
});

export {
  getSpecialtyList,
  getSpecialtyById,
  deleteSpecialty,
  createSpecialty,
  updateSpecialty,
  createSpecialtyReview,
};
