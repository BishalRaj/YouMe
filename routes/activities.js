"use strict";
const express = require("express");
const router = express.Router();
const ActivitiesModal = require("../modal/activitiesModal");

// route for views
router.get("/", async (req, res) => {
  let data = await ActivitiesModal.find();
  res.render("activities", { title: "Activities", admin: false, data: data });
});

module.exports = router;
