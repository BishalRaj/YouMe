"use strict";
const express = require("express");
const router = express.Router();
const ArticleModal = require("../modal/articleModal");
// route for views
router
  .get("/:id", async (req, res) => {
    let data = await ArticleModal.find({ _id: req.params.id });
    res.render("news/iarticle", {
      title: "Article",
      admin: false,
      data: data,
    });
  })
  .get("/", async (req, res) => {
    let data = await ArticleModal.find();
    res.render("news/article", {
      title: "Student Article",
      admin: false,
      data: data,
    });
  });

module.exports = router;
