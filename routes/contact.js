"use strict";
const express = require("express");
const router = express.Router();
const MessageModal = require("../modal/messageModal");
var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
// route for views
router
  .get("/", (req, res) => {
    res.render("contact", { title: "Contact Us", admin: false });
  })
  .post("/", (req, res) => {
    var { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      req.flash("error_msg", "Please fill all the fields");
      res.redirect("/contact");
    } else {
      const data = new MessageModal({
        name: name,
        email: email,
        subject: subject,
        message: message,
        time: date + " , " + time,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Your message is sent");
          res.redirect("/contact");
        })
        .catch((err) => {
          req.flash("error_msg", "Your message is not sent");
          res.redirect("/contact");
        });
    }
  });

module.exports = router;
