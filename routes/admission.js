"use strict";
const express = require("express");
const AdmissionModal = require("../modal/admissionModal");
const router = express.Router();
// route for views
var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

router
  .get("/", (req, res) => {
    res.render("admission", { title: "Admission", admin: false });
  })
  .post("/", (req, res) => {
    const {
      name,
      gender,
      nationality,
      dobAD,
      dobBS,
      grade,
      houseNo,
      area,
      ward,
      vdc,
      district,
      guardianName,
      relation,
      phone,
      email,
    } = req.body;

    if (
      !name ||
      !gender ||
      !nationality ||
      !dobAD ||
      !dobBS ||
      !grade ||
      !houseNo ||
      !area ||
      !ward ||
      !vdc ||
      !district ||
      !guardianName ||
      !relation ||
      !phone ||
      !email
    ) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admission");
    } else {
      const data = new AdmissionModal({
        name: name,
        gender: gender,
        nationality: nationality,
        dobAD: dobAD,
        dobBS: dobBS,
        grade: grade,
        houseNo: houseNo,
        area: area,
        ward: ward,
        vdc: vdc,
        district: district,
        guardianName: guardianName,
        relation: relation,
        phone: phone,
        email: email,
        appliedOn: date + " , " + time,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Application form submitted");
          res.redirect("/admission");
        })
        .catch((err) => {
          req.flash("error_msg", err);
          res.redirect("/admission");
        });
    }
  });

module.exports = router;
