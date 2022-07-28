import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler"; //=> middleware for error handling, avoid use trycatch for each route

//@desc   Create new order
//@route  POST /api/orders
//@assess Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {

    orderItems.map((p) => {
      p.category = p.category.charAt(0).toUpperCase() + p.category.slice(1);
      return p;
    })

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@desc   get order by id
//@route  GET /api/orders/:id
//@assess Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  ); //populate which lets we reference documents in other collections

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//@desc   update order to paid
//@route  GET /api/orders/:id/pay
//@assess Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    //below req.body object will come from Paypal
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // reduce stock number after pay.
    for (const index in order.orderItems) {

      const item = order.orderItems[index];
      // console.log(item)
      const product = {};

      switch(item.category){
        case 'Food':
          product = await Food.findById(item.product);
          break;

        case 'Specialty':
          product = await Specialty.findById(item.product);
          break;

        case 'Travel':
          product = await Travel.findById(item.product);
        break;

        case 'Villa':
          product = await Villa.findById(item.product);
          break;
        }

        console.log(product.countInStock)
        console.log(item.qty)

        product.countInStock -= item.qty;

        console.log('=')
        console.log(product.countInStock)

        await product.save();
      }

     const updatedOrder = await order.save();
     res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//@desc   get users orders
//@route  GET /api/orders/myorders
//@assess Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

//@desc   get all orders
//@route  GET /api/orders
//@assess Private Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find({}).populate("user", "id name");
  res.json(allOrders);
});

//@desc   update order to dispatch
//@route  Put /api/orders/:id/dispatch
//@assess Private Admin

const updateOrderToDispatch = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDispatched = true;
    order.dispatchedAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDispatch,
};
