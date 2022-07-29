import express from "express";
import multer from "multer";
import path from "path";
import asyncHandler from "express-async-handler";
//for image cloud config
import pkg from "cloudinary";
const cloudinary = pkg;

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); //image filename will be namexxx-datexxx.jpg|jpeg|png
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //=> will give us boolean
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("jpg,jpeg,png Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  "/",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const uploadImage = await cloudinary.uploader.upload(`${req.file.path}`);
    // console.log(uploadImage);
    // console.log(uploadImage.url);
    res.send(uploadImage.url);
  })
);

export default router;

// import express from "express";
// import multer from "multer";
// const router = express.Router();
// // import path from 'path';
// import { protectUser, admin } from "../middleware/authMiddleware.js";

// import multerS3 from "multer-s3";
// import aws from "aws-sdk";

// //multer s3
// const s3 = new aws.S3();
// aws.config.update({
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   accessSecretKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: process.env.S3_BUCKET_REGION,
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
//   }
// };

// const upload = multer({
//   fileFilter,
//   storage: multerS3({
//     acl: "public-read",
//     s3: s3,
//     bucket: `resort-use`,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: "TESTING_METADATA" });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

// see npm multer diskstorage
/* const storage = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        cb(
          null,
          // you dont need the dot
          `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
      }
    }); */

//custom cb validation
/* function checkFileType(file, cb) {
      const filetypes = /jpg|jpeg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
     
      if (extname && mimetype) {
        //null means no error
        //theres no 404 error here
        return cb(null, true);
      } else {
        cb(new Error('Images only!'));
      }
    } */

/* const upload = multer({
      //storage:storage
      storage,
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
      }
    }); */

/* const returnImageUrl = (req, res) => {
      //removes backslash
      res.send(`/${req.file.path.replace(/\\/g, '/')}`);
    }; */

// const returnImageUrl = (req, res) => {
//   return res.send(`${req.file.location}`);
// };

//test keys
// const getKeys = (req, res) => {
//   res.json({
//     secretAccessKey: process.env.S3_ACCESS_KEY_ID,
//     accessKeyId: process.env.S3_SECRET_ACCESS_KEY
//   });
// };

//single file upload
// router
//   .route("/")
//   .post(protectUser, admin, upload.single("image"), returnImageUrl);
// // .get(getKeys);

// export default router;

// import express from "express";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import aws from "aws-sdk";
// import config from "../config.js";

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}.jpg`);
//   },
// });

// const upload = multer({ storage });

// const router = express.Router();

// router.post("/", upload.single("image"), (req, res) => {
//   res.send(`/${req.file.path}`);
// });

// aws.config.update({
//   accessKeyId: config.accessKeyId,
//   secretAccessKey: config.secretAccessKey,
// });

// const s3 = new aws.S3();

// const storageS3 = multerS3({
//   s3,
//   bucket: "resort-use",
//   acl: "public-read",
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key(req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const uploadS3 = multer({ storage: storageS3 });
// router.post("/s3", uploadS3.single("image"), (req, res) => {
//   res.send(req.file.location);
// });
// export default router;
