const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

require("./config/connection");
require("./config/passport")(passport);

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(cors());
// app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets", express.static(__dirname + "/public"));
app.use("/favicon.ico", express.static(__dirname + "/public/favicon.ico"));

app.use(
  session({
    secret: require("./config/keys").secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const indexRoute = require("./routes/index");
const aboutRoute = require("./routes/about");
const academicsRoute = require("./routes/academics");
const admissionRoute = require("./routes/admission");
const activitiesRoute = require("./routes/activities");
const newsRoute = require("./routes/news");
const articleRoute = require("./routes/article");
const galleryRoute = require("./routes/gallery");
const contactRoute = require("./routes/contact");
const adminRoute = require("./routes/admin/index");
const fileUploadRoute = require("./routes/admin/upload");
// const adminNewsRoute = require("./routes/admin/news");
// const adminEventRoute = require("./routes/admin/event");
// const adminArticleRoute = require("./routes/admin/article");
// const adminGalleryRoute = require("./routes/admin/gallery");

// Setting up globle variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Initializing Routes
const { ensureAuthenticated } = require("./config/auth");

app.use("/", indexRoute);
app.use("/about", aboutRoute);
app.use("/academics", academicsRoute);
app.use("/admission", admissionRoute);
app.use("/activities", activitiesRoute);
app.use("/news", newsRoute);
app.use("/article", articleRoute);
app.use("/gallery", galleryRoute);
app.use("/contact", contactRoute);
app.use("/image", ensureAuthenticated, fileUploadRoute);
app.use("/admin", ensureAuthenticated, adminRoute);
// app.use("/admin/news", adminNewsRoute);
// app.use("/admin/event", adminEventRoute);
// app.use("/admin/article", adminArticleRoute);
// app.use("/admin/gallery", adminGalleryRoute);

//error handling
app.use((req, res, next) => {
  const error = new Error("404: Not found");
  res.render("error.ejs", { title: error, admin: false });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
