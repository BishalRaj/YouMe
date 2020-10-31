const mongoose = require("mongoose");
const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  // category: {
  //   type: String,
  // },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GalleryCategory",
  },
  addedOn: {
    type: String,
  },
});

const Gallery = mongoose.model("Gallery", GallerySchema);
module.exports = Gallery;
