"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const fs = require("fs");

const GalleryCategory = require("../../modal/galleryCategory");
const GalleryModal = require("../../modal/galleryModal");
const NewsModal = require("../../modal/newsModal");
const EventModal = require("../../modal/eventModal");
const ArticleModal = require("../../modal/articleModal");
const ActivitiesModal = require("../../modal/activitiesModal");
const MessageModal = require("../../modal/messageModal");
const InquiryModal = require("../../modal/inquiryModal");
const AdmissionModal = require("../../modal/admissionModal");
const TestimonialModal = require("../../modal/testimonialModal");
const UserModal = require("../../modal/userModal");
var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var addedOn = date;
// route for views
router
  .get("/", (req, res) => {
    let role;
    if (!req.user.role) {
      UserModal.find({ role: "a" })
        .then((result) => {
          role = result.length >= 1 ? "u" : "a";
          UserModal.findOneAndUpdate({ _id: req.user._id }, { role: role })
            .then((result) => {
              role = result.role;
            })
            .catch((err) => {});
        })
        .catch((err) => (role = "u"));
    } else {
      role = req.user.role;
    }
    res.render("admin/index", {
      name: req.user.name,
      role: role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Dashboard",
      admin: true,
    });
  })
  .get("/message", async (req, res) => {
    let data = await MessageModal.find().sort([["time", -1]]);
    res.render("admin/message/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Message",
      admin: true,
      data: data,
    });
  })
  .get("/inquiry", async (req, res) => {
    let data = await InquiryModal.find().sort([["time", -1]]);
    res.render("admin/inquiry/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Inquiry & Feedbacks",
      admin: true,
      data: data,
    });
  })
  .get("/admission", async (req, res) => {
    let data = await AdmissionModal.find().sort([["appliedOn", -1]]);
    res.render("admin/admission/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Admissions",
      admin: true,
      data: data,
    });
  });

router
  .get("/user", async (req, res) => {
    if (req.user.role != "a") {
      res.redirect("/admin");
    }
    let data = await UserModal.find();
    res.render("admin/user/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "User",
      admin: true,
      data: data,
    });
  })
  .get("/user/add", (req, res) => {
    if (req.user.role != "a") {
      res.redirect("/admin");
    }
    res.render("admin/user/add", {
      name: req.user.name,
      role: req.user.role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Add User",
      admin: true,
    });
  })
  .get("/user/edit/:id", async (req, res) => {
    if (req.user.role != "a") {
      res.redirect("/admin");
    }
    let data = await UserModal.findById(req.params.id);
    res.render("admin/user/edit", {
      name: req.user.name,
      role: req.user.role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Edit User",
      admin: true,
      data: data,
    });
  })
  .get("/user/editpwd/:id", async (req, res) => {
    let data = await UserModal.findById(req.params.id);
    res.render("admin/user/editpwd", {
      name: req.user.name,
      role: req.user.role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Edit Password",
      admin: true,
      data: data,
    });
  })
  .post("/user/add", (req, res) => {
    if (req.user.role != "a") {
      res.redirect("/admin");
    }
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/user/add");
    } else {
      UserModal.find({ email: email })
        .then((result) => {
          if (result.length <= 0) {
            const data = new UserModal({
              name: name,
              email: email,
              password: password,
              role: role,
              addedOn: addedOn,
            });
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(data.password, salt, (err, hash) => {
                if (err) throw err;
                // Set password to hashed
                data.password = hash;
                // Save user
                data
                  .save()
                  .then((data) => {
                    req.flash("success_msg", "User added");
                    res.redirect("/admin/user/add");
                  })
                  .catch((err) => {
                    req.flash("error_msg", err);
                    res.redirect("/admin/user/add");
                  });
              })
            );
          } else {
            req.flash("error_msg", "User already exist");
            res.redirect("/admin/user/add");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  })
  .post("/user/delete", (req, res) => {
    if (req.user.role != "a") {
      res.redirect("/admin");
    }
    UserModal.deleteOne({ _id: req.body.n_id }, function (err) {
      if (err) {
        req.flash("error_msg", "Could not remove User");
        res.redirect("/admin/user");
      }
      req.flash("success_msg", "User removed ");
      res.redirect("/admin/user");
    });
  })
  .post("/user/update", (req, res) => {
    if (req.user.role != "a") {
      res.redirect("/admin");
    }
    let { id, name, email, role } = req.body;
    if (!name || !email || !role) {
      req.flash("error_msg", "Please fill all fields");
      res.redirect("/admin/user/edit/" + id);
    } else {
      let data = {
        name: name,
        email: email,
        role: role,
      };
      UserModal.findOneAndUpdate({ _id: id }, data)
        .then((result) => {
          req.flash("success_msg", "User details Updated");
          res.redirect("/admin/user");
        })
        .catch((err) => {
          req.flash("error_msg", "User details Update Failed");
          res.redirect("/admin/user");
        });
    }
  })
  .post("/user/updatepwd", (req, res) => {
    let { id, password, password2 } = req.body;
    if (!password || !password2) {
      req.flash("error_msg", "Please fill all fields");
      res.redirect("/admin/user/editpwd/" + id);
    } else if (password != password2) {
      req.flash("error_msg", "Password did not match");
      res.redirect("/admin/user/editpwd/" + id);
    } else {
      let data = {
        password: password,
      };
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(data.password, salt, (err, hash) => {
          if (err) throw err;
          // Set password to hashed
          data.password = hash;
          // Update user
          UserModal.findOneAndUpdate({ _id: id }, data)
            .then((result) => {
              req.flash("success_msg", "User password Updated");
              res.redirect("/admin/user/editpwd/" + id);
            })
            .catch((err) => {
              req.flash("error_msg", "User password Update Failed");
              res.redirect("/admin/user/editpwd/" + id);
            });
        })
      );
    }
  });

router
  .get("/news", async (req, res) => {
    let data = await NewsModal.find();
    res.render("admin/news/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "View News",
      admin: true,
      data: data,
    });
  })
  .get("/news/add", (req, res) => {
    res.render("admin/news/add", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Add News",
      admin: true,
    });
  })
  .get("/news/edit/:id", async (req, res) => {
    let data = await NewsModal.findById(req.params.id);
    res.render("admin/news/edit", {
      name: req.user.name,
      role: req.user.role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Edit News",
      admin: true,
      data: data,
    });
  })
  .post("/news/add", (req, res) => {
    let { title, image, description } = req.body;
    if (!title || !description) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/news/add");
    } else {
      image = !image ? "default.jpg" : image;
      const data = new NewsModal({
        title: title,
        image: image,
        description: description,
        showPopup: false,
        addedOn: addedOn,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "News added");
          res.redirect("/admin/news/add");
        })
        .catch((err) => {
          req.flash("error_msg", err);
          res.redirect("/admin/news/add");
        });
    }
  })
  .post("/news/delete", (req, res) => {
    try {
      fs.unlink(
        __dirname + "../../../public/image/" + req.body.image_name,
        (err) => {}
      );
    } catch (error) {}

    NewsModal.deleteOne({ _id: req.body.n_id }, function (err) {
      if (err) {
        req.flash("error_msg", "Could not delete News");
        res.redirect("/admin/news");
      }
      req.flash("success_msg", "News Deleted");
      res.redirect("/admin/news");
    });
  })
  .post("/news/update", (req, res) => {
    let { id, title, description } = req.body;
    let image = req.body.image ? req.body.image : req.body.oldimage;
    if (req.body.image) {
      try {
        fs.unlink(
          __dirname + "../../../public/image/" + req.body.oldimage,
          (err) => {}
        );
      } catch (error) {}
    }
    let data = {
      title: title,
      description: description,
      image: image,
    };
    NewsModal.findOneAndUpdate({ _id: id }, data)
      .then((result) => {
        req.flash("success_msg", "News Updated");
        res.redirect("/admin/news");
      })
      .catch((err) => {
        req.flash("error_msg", "News Update Failed");
        res.redirect("/admin/news");
      });
  })
  .post("/news/popup", (req, res) => {
    let { id, popup } = req.body;
    NewsModal.findOneAndUpdate(
      { _id: id },
      {
        showPopup: popup,
      }
    )
      .then((result) => {
        req.flash("success_msg", "Popup selected Updated");
        res.redirect("/admin/news");
      })
      .catch((err) => {
        req.flash("error_msg", "Popup selection Failed");
        res.redirect("/admin/news");
      });
  });

router
  .get("/gallery", async (req, res) => {
    await GalleryModal.find()
      .populate("category")
      .then((data) => {
        res.render("admin/gallery/view", {
          name: req.user.name,
          id: req.user._id,
          role: req.user.role,
          title: "YouMe School-Admin",
          heading: "View Gallery",
          admin: true,
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
        req.flash("error_msg", "Error viewing gallery.");
        res.redirect("/admin");
      });
  })
  .get("/gallery/add/:id", async (req, res) => {
    let selected = req.params.id;
    let data = await GalleryCategory.find();
    res.render("admin/gallery/add", {
      name: req.user.name,
      role: req.user.role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Add Gallery",
      admin: true,
      selected: selected,
      data: data,
    });
  })
  .get("/gallery/add", async (req, res) => {
    let data = await GalleryCategory.find();
    res.render("admin/gallery/add", {
      name: req.user.name,
      role: req.user.role,
      id: req.user._id,
      title: "YouMe School-Admin",
      heading: "Add Gallery",
      admin: true,
      selected: "",
      data: data,
    });
  })
  .get("/gallery/edit/:id", async (req, res) => {
    let category = await GalleryCategory.find();
    GalleryModal.findById(req.params.id)
      .populate("category")
      .then((data) => {
        res.render("admin/gallery/edit", {
          name: req.user.name,

          id: req.user._id,
          role: req.user.role,
          title: "YouMe School-Admin",
          heading: "Edit Gallery",
          admin: true,
          data: data,
          category: category,
        });
      })
      .catch();
  })
  .post("/gallery/add", (req, res) => {
    let { title, image, category } = req.body;
    const data = new GalleryModal({
      title: !title ? "YouMe School" : title,
      image: !image ? "default.jpg" : image,
      category: category,
      addedOn: addedOn,
    });
    data
      .save()
      .then((data) => {
        req.flash("success_msg", "Image added to gallery");
        res.redirect("/admin/gallery/add");
      })
      .catch((err) => {
        req.flash("error_msg", "Error performing the task");
        res.redirect("/admin/gallery/add");
      });
  })
  .post("/gallery/delete", (req, res) => {
    try {
      fs.unlink(
        __dirname + "../../../public/image/" + req.body.image_name,
        (err) => {}
      );
    } catch (error) {}
    GalleryModal.deleteOne({ _id: req.body.g_id }, function (err) {
      if (err) return handleError(err);
      req.flash("success_msg", "Item Deleted");
      res.redirect("/admin/gallery");
    });
  })
  .post("/gallery/update", (req, res) => {
    let { id, title, category, description } = req.body;
    let image = req.body.image ? req.body.image : req.body.oldimage;
    if (req.body.image) {
      try {
        fs.unlink(
          __dirname + "../../../public/image/" + req.body.oldimage,
          (err) => {}
        );
      } catch (error) {}
    }
    let data = {
      title: title,
      category: category,
      description: description,
      image: image,
    };
    GalleryModal.findOneAndUpdate({ _id: id }, data)
      .then((result) => {
        req.flash("success_msg", "Gallery Updated");
        res.redirect("/admin/gallery");
      })
      .catch((err) => {
        req.flash("error_msg", "Gallery Update Failed");
        res.redirect("/admin/gallery");
      });
  });

router
  .get("/event", async (req, res) => {
    let data = await EventModal.find();
    res.render("admin/event/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "View Event",
      admin: true,
      data: data,
    });
  })
  .get("/event/add", (req, res) => {
    res.render("admin/event/add", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Add Event",
      admin: true,
    });
  })
  .get("/event/edit/:id", async (req, res) => {
    let data = await EventModal.findById(req.params.id);
    res.render("admin/event/edit", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Edit Event",
      admin: true,
      data: data,
    });
  })
  .post("/event/add", (req, res) => {
    let { title, image, date, description } = req.body;
    if (!title || !date || !description) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/event/add");
    } else {
      image = !image ? "default.jpg" : image;
      const data = new EventModal({
        title: title,
        image: image,
        date: date,
        description: description,
        showPopup: false,
        addedOn: addedOn,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Event added");
          res.redirect("/admin/event/add");
        })
        .catch((err) => {
          req.flash("error_msg", "Error performing the task.");
          res.redirect("/admin/event/add");
        });
    }
  })
  .post("/event/delete", (req, res) => {
    try {
      fs.unlink(
        __dirname + "../../../public/image/" + req.body.image_name,
        (err) => {}
      );
    } catch (error) {}
    EventModal.deleteOne({ _id: req.body.e_id }, function (err) {
      if (err) {
        req.flash("error_msg", "Could not delete event");
        res.redirect("/admin/event");
      }

      req.flash("success_msg", "Event Deleted");
      res.redirect("/admin/event");
    });
  })
  .post("/event/update", (req, res) => {
    let { id, title, description } = req.body;
    let image = req.body.image ? req.body.image : req.body.oldimage;
    if (req.body.image) {
      try {
        fs.unlink(
          __dirname + "../../../public/image/" + req.body.oldimage,
          (err) => {}
        );
      } catch (error) {}
    }
    let data = {
      title: title,
      description: description,
      image: image,
    };
    EventModal.findOneAndUpdate({ _id: id }, data)
      .then((result) => {
        req.flash("success_msg", "Event Updated");
        res.redirect("/admin/event");
      })
      .catch((err) => {
        req.flash("error_msg", "Event Update Failed");
        res.redirect("/admin/event");
      });
  })
  .post("/event/popup", (req, res) => {
    let { id, popup } = req.body;
    EventModal.findOneAndUpdate(
      { _id: id },
      {
        showPopup: popup,
      }
    )
      .then((result) => {
        req.flash("success_msg", "Popup selected Updated");
        res.redirect("/admin/event");
      })
      .catch((err) => {
        req.flash("error_msg", "Popup selection Failed");
        res.redirect("/admin/event");
      });
  });

router
  .get("/article", async (req, res) => {
    let data = await ArticleModal.find();
    res.render("admin/article/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "View Article",
      admin: true,
      data: data,
    });
  })
  .get("/article/add", (req, res) => {
    res.render("admin/article/add", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Add Article",
      admin: true,
    });
  })
  .get("/article/edit/:id", async (req, res) => {
    let data = await ArticleModal.findById(req.params.id);
    res.render("admin/article/edit", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Edit Article",
      admin: true,
      data: data,
    });
  })
  .post("/article/add", (req, res) => {
    let { title, image, description } = req.body;
    if (!title) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/article/add");
    } else {
      image = !image ? "default.jpg" : image;
      const data = new ArticleModal({
        title: title,
        image: image,
        description: description,
        addedOn: addedOn,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Article added");
          res.redirect("/admin/article/add");
        })
        .catch((err) => {
          req.flash("error_msg", err);
          res.redirect("/admin/article/add");
        });
    }
  })
  .post("/article/delete", (req, res) => {
    try {
      fs.unlink(
        __dirname + "../../../public/image/" + req.body.image_name,
        (err) => {}
      );
    } catch (error) {}

    ArticleModal.deleteOne({ _id: req.body.a_id }, function (err) {
      if (err) {
        req.flash("error_msg", "Could not delete Article ");
        res.redirect("/admin/article");
      }
      req.flash("success_msg", "Article Deleted");
      res.redirect("/admin/article");
    });
  })
  .post("/article/update", (req, res) => {
    let { id, title, description } = req.body;
    let image = req.body.image ? req.body.image : req.body.oldimage;
    if (req.body.image) {
      try {
        fs.unlink(
          __dirname + "../../../public/image/" + req.body.oldimage,
          (err) => {}
        );
      } catch (error) {}
    }
    let data = {
      title: title,
      description: description,
      image: image,
    };
    ArticleModal.findOneAndUpdate({ _id: id }, data)
      .then((result) => {
        req.flash("success_msg", "Activities Updated");
        res.redirect("/admin/article");
      })
      .catch((err) => {
        req.flash("error_msg", "Activities Update Failed");
        res.redirect("/admin/article");
      });
  });

router
  .get("/activities", async (req, res) => {
    let data = await ActivitiesModal.find();
    res.render("admin/activities/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "View Activities",
      admin: true,
      data: data,
    });
  })
  .get("/activities/add", (req, res) => {
    res.render("admin/activities/add", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Add Activities",
      admin: true,
    });
  })
  .get("/activities/edit/:id", async (req, res) => {
    let data = await ActivitiesModal.findById(req.params.id);
    res.render("admin/activities/edit", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Edit Activities",
      admin: true,
      data: data,
    });
  })
  .post("/activities/add", (req, res) => {
    let { title, image, description } = req.body;
    if (!title) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/activities/add");
    } else {
      image = !image ? "default.jpg" : image;
      const data = new ActivitiesModal({
        title: title,
        image: image,
        description: description,
        addedOn: addedOn,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Activities added");
          res.redirect("/admin/activities/add");
        })
        .catch((err) => {
          req.flash("error_msg", err);
          res.redirect("/admin/activities/add");
        });
    }
  })
  .post("/activities/delete", (req, res) => {
    try {
      fs.unlink(
        __dirname + "../../../public/image/" + req.body.image_name,
        (err) => {}
      );
    } catch (error) {}
    ActivitiesModal.deleteOne({ _id: req.body.e_id }, function (err) {
      if (err) return handleError(err);
      req.flash("success_msg", "Activities Deleted");
      res.redirect("/admin/activities");
    });
  })
  .post("/activities/update", (req, res) => {
    let { id, title, description } = req.body;
    let image = req.body.image ? req.body.image : req.body.oldimage;
    if (req.body.image) {
      try {
        fs.unlink(
          __dirname + "../../../public/image/" + req.body.oldimage,
          (err) => {}
        );
      } catch (error) {}
    }
    let data = {
      title: title,
      description: description,
      image: image,
    };
    ActivitiesModal.findOneAndUpdate({ _id: id }, data)
      .then((result) => {
        req.flash("success_msg", "Activities Updated");
        res.redirect("/admin/activities");
      })
      .catch((err) => {
        req.flash("error_msg", "Activities Update Failed");
        res.redirect("/admin/activities");
      });
  });

router
  .get("/categoryG", async (req, res) => {
    let data = await GalleryCategory.find();
    res.render("admin/galleryCategories/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "View Gallery Category",
      admin: true,
      data: data,
    });
  })
  .get("/categoryG/add", (req, res) => {
    res.render("admin/galleryCategories/add", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Add Gallery Category",
      admin: true,
    });
  })
  .get("/categoryG/edit/:id", async (req, res) => {
    let data = await GalleryCategory.findById(req.params.id);
    res.render("admin/galleryCategories/edit", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Edit Category",
      admin: true,
      data: data,
    });
  })
  .post("/categoryG/add", (req, res) => {
    const { category } = req.body;
    if (!category) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/categoryG/add");
    } else {
      const data = new GalleryCategory({
        category: category,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Gallery Category added");
          res.redirect("/admin/categoryG/add");
        })
        .catch((err) => {
          req.flash("error_msg", err);
          res.redirect("/admin/categoryG/add");
        });
    }
  })
  .post("/categoryG/delete", (req, res) => {
    GalleryCategory.deleteOne({ _id: req.body.c_id }, function (err) {
      if (err) return handleError(err);

      req.flash("success_msg", "Gallery Category Deleted");
      res.redirect("/admin/categoryG");
    });
  })
  .post("/categoryG/update", (req, res) => {
    let { id, category } = req.body;
    GalleryCategory.findOneAndUpdate({ _id: id }, { category: category })
      .then((result) => {
        req.flash("success_msg", "Category Updated");
        res.redirect("/admin/categoryG");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error_msg", "Category Update Failed");
        res.redirect("/admin/categoryG");
      });
  });

router
  .get("/testimonial", async (req, res) => {
    let data = await TestimonialModal.find();
    res.render("admin/testimonial/view", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "View Testimonial",
      admin: true,
      data: data,
    });
  })
  .get("/testimonial/add", (req, res) => {
    res.render("admin/testimonial/add", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Add Testimonial",
      admin: true,
    });
  })
  .get("/testimonial/edit/:id", async (req, res) => {
    let data = await TestimonialModal.findById(req.params.id);
    res.render("admin/testimonial/edit", {
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
      title: "YouMe School-Admin",
      heading: "Edit Testimonial",
      admin: true,
      data: data,
    });
  })
  .post("/testimonial/add", (req, res) => {
    const { name, testimonial, grade } = req.body;
    if (!testimonial) {
      req.flash("error_msg", "Please fill in all fields");
      res.redirect("/admin/testimonial/add");
    } else {
      const data = new TestimonialModal({
        name: name,
        testimonial: testimonial,
        grade: grade,
        addedOn: addedOn,
      });

      data
        .save()
        .then((data) => {
          req.flash("success_msg", "Gallery Testimonial added");
          res.redirect("/admin/testimonial/add");
        })
        .catch((err) => {
          req.flash("error_msg", err);
          res.redirect("/admin/testimonial/add");
        });
    }
  })
  .post("/testimonial/delete", (req, res) => {
    TestimonialModal.deleteOne({ _id: req.body.id }, function (err) {
      if (err) return handleError(err);

      req.flash("success_msg", "Gallery Testimonial Deleted");
      res.redirect("/admin/testimonial");
    });
  })
  .post("/testimonial/update", (req, res) => {
    let { id, name, testimonial, grade } = req.body;
    let data = { name: name, testimonial: testimonial, grade: grade };
    TestimonialModal.findOneAndUpdate({ _id: id }, data)
      .then((result) => {
        req.flash("success_msg", "Testimonial Updated");
        res.redirect("/admin/testimonial");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error_msg", "Testimonial Update Failed");
        res.redirect("/admin/testimonial");
      });
  });

router.use((req, res, next) => {
  const error = new Error("404: Not found");
  res.render("error.ejs", {
    name: req.user.name,
    id: req.user._id,
    role: req.user.role,
    title: error,
    admin: true,
  });
});

module.exports = router;
