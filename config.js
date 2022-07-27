import dotenv from "dotenv";
dotenv.config();

export default {
  accessKeyId: process.env.S3_ACCESS_KEY || "S3_ACCESS_KEY",
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "S3_SECRET_ACCESS_KEY",
};
