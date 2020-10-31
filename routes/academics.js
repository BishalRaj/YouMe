"use strict";
const express = require("express");
const router = express.Router();
// route for views
router
  .get("/", (req, res) => {
    res.render("academics", { title: "About Us", admin: false });
  })
  .get("/primary", (req, res) => {
    res.render("academics/primary", { title: "Primary Level", admin: false });
  })
  .get("/secondary", (req, res) => {
    res.render("academics/secondary", {
      title: "Secondary Level",
      admin: false,
    });
  })
  .get("/higher", (req, res) => {
    res.render("academics/higher", {
      title: "Higher Secondary Level",
      admin: false,
    });
  });

module.exports = router;
