import Specialty from "../models/products/specialtyModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route

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

export { getSpecialtyList, getSpecialtyById, deleteSpecialty };
