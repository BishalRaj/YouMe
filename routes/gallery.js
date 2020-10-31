"use strict";
const express = require("express");
const router = express.Router();
const GalleryModal = require("../modal/galleryModal");
const CategoryModal = require("../modal/galleryCategory");
// route for views
router.get("/", async (req, res) => {
  let data = await GalleryModal.find().populate("category");
  let category = await CategoryModal.find();
  // let distinctCategory = [...new Set(data.map((x) => x.category.category))];
  // console.log(data);
  res.render("gallery", {
    title: "Gallery",
    admin: false,
    data: data,
    // category: distinctCategory,
    category: category,
  });
});

module.exports = router;
