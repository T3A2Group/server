import mongoose from "mongoose";
import dotenv from "dotenv";
// import fake data to seeder start:
import users from "./data/users.js";
import villas from "./data/villas.js";
import food from "./data/food.js";
import specialties from "./data/specialties.js";
import travel from "./data/travel.js";
// import fake data to seeder end!
//import models to seeder start:
import Villa from "./models/products/villaModel.js";
import Food from "./models/products/foodModel.js";
import Specialty from "./models/products/specialtyModel.js";
import Travel from "./models/products/travelModel.js";
import Order from "./models/orderModel.js";
import User from "./models/userModel.js";
//import models to seeder end!
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Villa.deleteMany();
    await Food.deleteMany();
    await Specialty.deleteMany();
    await Travel.deleteMany();
    await User.deleteMany();

    const createUsers = await User.insertMany(users);
    const adminUser = createUsers[0]._id;

    const sampleVillas = villas.map((villa) => {
      return { ...villa, user: adminUser };
    });
    const sampleFood = food.map((food) => {
      return { ...food, user: adminUser };
    });
    const sampleSpecialties = specialties.map((specialty) => {
      return { ...specialty, user: adminUser };
    });
    const sampleTravel = travel.map((travel) => {
      return { ...travel, user: adminUser };
    });

    await Villa.insertMany(sampleVillas);
    await Food.insertMany(sampleFood);
    await Specialty.insertMany(sampleSpecialties);
    await Travel.insertMany(sampleTravel);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destoryData = async () => {
  try {
    await Order.deleteMany();
    await Villa.deleteMany();
    await Food.deleteMany();
    await Specialty.deleteMany();
    await Travel.deleteMany();
    await User.deleteMany();

    console.log("Data Destoryed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destoryData();
} else {
  importData();
}
