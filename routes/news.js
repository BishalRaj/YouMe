"use strict";
const express = require("express");
const router = express.Router();

const NewsModal = require("../modal/newsModal");
const EventModal = require("../modal/eventModal");
const ArticleModal = require("../modal/articleModal");
// route for views
router
  .get("/", async (req, res) => {
    let data = await NewsModal.find().sort([["addedOn", -1]]);
    res.render("news/news", { title: "News", admin: false, data: data });
  })
  .get("/event", async (req, res) => {
    let data = await EventModal.find().sort([["date", -1]]);
    res.render("news/event", { title: "Event", admin: false, data: data });
  })
  .get("/:id", async (req, res) => {
    let data = await NewsModal.find({ _id: req.params.id });
    res.render("news/inews", { title: "News", admin: false, data: data });
  });

module.exports = router;
