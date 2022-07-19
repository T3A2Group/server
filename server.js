import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; //import db connection config file
//routes import:
import villaRoutes from "./routes/villaRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import specialtyRoutes from "./routes/specialtyRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
//error catch middleware import
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//config env file
dotenv.config();
//connect to DB
connectDB();

const app = express();

//http://localhost:4000
app.get("/", (req, res) => {
  res.send("API is running");
});

//different product routes
app.use("/api/villa", villaRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/specialty", specialtyRoutes);
app.use("/api/travel", travelRoutes);

//after above routes, use error handler middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);
