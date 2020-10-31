"use strict";
const express = require("express");
const router = express.Router();
// route for views
router
  .get("/", (req, res) => {
    res.render("about", { title: "About Us", admin: false });
  })
  .get("/aim", (req, res) => {
    res.render("about/aim", { title: "Our Aim", admin: false });
  })
  .get("/message", (req, res) => {
    res.render("about/message", { title: "Message", admin: false });
  })
  .get("/vision", (req, res) => {
    res.render("about/vision", { title: "Our Vision", admin: false });
  })
  .get("/team", (req, res) => {
    res.render("about/team", { title: "Our Team", admin: false });
  });

module.exports = router;
