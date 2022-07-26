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

export { getVillaList, getVillaById, deleteVilla };
