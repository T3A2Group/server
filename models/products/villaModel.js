import mongoose from "mongoose";

//=> this is each review schema
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true }, //=> this is for individual rating
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, //=> this is will connect User model with reviews
  },
  { timestamps: true }
); //=> this is small review Schema for villa product

const villaSchema = mongoose.Schema(
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
      //=> farm view villa, ocean view villa etc
      type: String,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    roomNums: {
      //=> one queen bed room (1), two single room(2) etc
      type: Number,
      required: true,
    },
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

const Villa = mongoose.model("Villa", villaSchema);

export default Villa;
