import mongoose from "mongoose";

//=> this is each review schema
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true }, //=> this is for individual rating
    comment: { type: String, required: true },
  },
  { timestamps: true }
); //=> this is small review Schema for villa product

//=> this is each attraction schema
const attractionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    briefInfo: { type: String, required: true },
  },
  { timestamps: true }
);

const travelSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, //=> this is will connect User model with Villa model
    name: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      //=> history, outside hiking etc
      type: String,
      required: true,
    },
    duration: {
      //=> eg: one day tour, two days tour etc...
      type: String,
      required: true,
    },
    attractions: [attractionSchema], //=> eg: cradle mountain, wineglass bay etc...
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      //=> for average rating
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true } //mongoose will create createdAt and updatedAt two properties of type Date to the schema
);

const Travel = mongoose.model("Travel", travelSchema);

export default Travel;
