import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; //import db connection config file
import cors from 'cors';
//routes import:
import villaRoutes from "./routes/villaRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import specialtyRoutes from "./routes/specialtyRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
//error catch middleware import
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
//for cloud image store
import pkg from "cloudinary";
const cloudinary = pkg;
//import HTTP request logger middleware for node.js
import morgan from "morgan";

//config env file
dotenv.config();
//connect to DB
connectDB();

const app = express();

//only use morgan middleware for development env
//eg: if I login account, then I can see the server logger: POST /api/users/login 200(HTTP code)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//middleware for parse json
app.use(express.json());
app.use(cors())

//http://localhost:4000
app.get("/", (req, res) => {
  res.send("API is running");
});

//cloudinary config setup(for image could store)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//different product routes
app.use("/api/villa", villaRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/specialty", specialtyRoutes);
app.use("/api/travel", travelRoutes);

// upload image routes
app.use("/api/upload", uploadRoutes);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//auth users routes
app.use("/api/users", userRoutes);

//order routes
app.use("/api/orders", orderRoutes);

//order payment routes
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

//after above routes, use error handler middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
  );

  // export default app;
  // when test need export app jest need app been exported