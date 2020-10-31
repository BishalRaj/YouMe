const mongoose = require("mongoose");
const GalleryCategorySchema = new mongoose.Schema({
  category: {
    type: String,
  },
});

const GalleryCategory = mongoose.model(
  "GalleryCategory",
  GalleryCategorySchema
);
module.exports = GalleryCategory;
