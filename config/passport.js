// const LocalStrategy=require('passport-strategy');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../modal/userModal");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Invalid user" });
          }

          // check password
          bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
            if (err) {
              return done(null, false, {
                message: "Invalid credentials. Please try again!",
              });
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
