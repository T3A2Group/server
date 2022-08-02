import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); //connect with mongoDB
    console.log(`MongoDB connected: ${conn.connection.host}`); //this will show in server if DB connection is ok
  } catch (error) {
    console.error(`Error : ${error.message}`); //this will show in server if DB connection is failure
    process.exit(1); //it's going to exit with failure
  }
};

export default connectDB;
