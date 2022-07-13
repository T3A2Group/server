import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//http://localhost:4000
app.get("/", (req, res) => {
  res.send("API is running");
});

//http://localhost:4000/api/products
app.get("/api/products", (req, res) => {
  res.json(products);
});
//http://localhost:4000/api/products/:id
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);
