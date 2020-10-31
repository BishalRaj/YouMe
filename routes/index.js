"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");
const NewsModal = require("../modal/newsModal");
const EventModal = require("../modal/eventModal");
const GalleryModal = require("../modal/galleryModal");
const InquiryModal = require("../modal/inquiryModal");
const TestimonialModal = require("../modal/testimonialModal");

var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
// route for views
router
  .get("/", async (req, res) => {
    // let news = await NewsModal.find().limit(3);
    let news = await NewsModal.find()
      .sort([["addedOn", -1]])
      .limit(3);
    let event = await EventModal.find();
    let gallery = await GalleryModal.find().limit(6);
    let testimonial = await TestimonialModal.find();
    res.render("home", {
      title: "YouMe School",
      admin: false,
      news: news,
      event: event,
      gallery: gallery,
      testimonial: testimonial,
    });
  })
  .get("/login", (req, res) => {
    res.render("login", {
      title: "YouMe School",
      admin: false,
      message: "",
    });
  })
  .post("/login", (req, res, next) => {
    // const { email, password } = req.body;
    // let errors = [];
    // if (!email || !password) {
    //   errors.push({ msj: "Please fill in all fields" });
    // }
    passport.authenticate("local", {
      successRedirect: "/admin",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  })
  .get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  })
  .post("/inquiry", (req, res) => {
    var { email, message } = req.body;
    if (!email || !message) {
      req.flash("error_msg", "Cannot Inquire on empty fields.");
      res.redirect(req.get("referer"));
    } else {
      const data = new InquiryModal({
        email: email,
        message: message,
        time: date + " , " + time,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Feedback Sent");
          res.redirect(req.get("referer"));
        })
        .catch((err) => {
          req.flash("error_msg", "Cannot send Feedback ");
          res.redirect(req.get("referer"));
        });
    }
  });

module.exports = router;
