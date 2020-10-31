const express = require("express");
const multer = require("multer");
const path = require("path");
const fileUploadRouter = express.Router();
const sharp = require("sharp");

var image;
var ImageToSend;

var storage = multer.diskStorage({
  destination: "./public/image",
  filename: async function (req, file, callback) {
    const ext = await path.extname(file.originalname);
    ImageToSend = file.fieldname + Date.now() + ext;
    image = ImageToSend;
    // console.log("Image: " + image);
    await callback(null, ImageToSend);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
});

fileUploadRouter
  .route("/upload")
  .post(upload.single("image"), async (req, res) => {
    let compressedImagePath = path.join("./public/image/o_" + ImageToSend);

    await sharp(req.file.path)
      .resize(250, 250)
      .jpeg({
        quality: 50,
        chromaSubsampling: "4:4:4",
      })
      .toFile(compressedImagePath, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          res.end(
            JSON.stringify({
              image: ImageToSend,
            })
          );
        }
      });
  });

module.exports = fileUploadRouter;
