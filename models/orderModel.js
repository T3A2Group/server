import mongoose from "mongoose";

//=> single order item
const orderItemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    villa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Villa",
    },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
    },
    travelPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Travel",
    },
  },
  { timestamps: true }
);

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [orderItemSchema], //order items array
    shippingAddress: {
      address: { type: String, defalut: "Australia" },
      city: { type: String, defalut: "Australia city" },
      postCode: { type: String, defalut: "Australia post code" },
      country: { type: String, defalut: "Australia" },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDispatched: {
      type: Boolean,
      required: true,
      default: false,
    },
    dispatchedAt: {
      type: Date,
    },
  },
  { timestamps: true } //mongoose will create createdAt and updatedAt two properties of type Date to the schema
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
