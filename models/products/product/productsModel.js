import mongoose from "mongoose";

const productsSchema = mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    }, //=> this is will connect Food model
    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
    }, //=> this is will connect Specialty model
    travel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Travel",
    }, //=> this is will connect Travel model
    villa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Villa",
    }, //=> this is will connect Villa model
  },
  { timestamps: true } //mongoose will create createdAt and updatedAt two properties of type Date to the schema
);

const Products = mongoose.model("Products", productsSchema);

export default Products;
