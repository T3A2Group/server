import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  //=> check request headers jwt and jwt need starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; //=> only grab token which not includes Bearer
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //=> decoded will be like {id:xxx,iat:xxx,exp:xxxx}

      req.user = await User.findById(decoded.id).select("-password"); //=> no need to get password here
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized,token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protectUser };
