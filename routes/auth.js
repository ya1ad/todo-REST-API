const express = require("express");
const { userModel } = require("../model/user");
const passport = require("passport");
const router = express.Router();

/** Authentication Middleware*/
const loggedInOnly = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect("/auth/login");
};

const loggedOutOnly = (req, res, next) => {
  if (req.isUnauthenticated()) next();
  else res.redirect("/");
};

function authenticate(passport) {
  router.get("/profile", loggedInOnly, (req, res) => {
    res.send(req.user);
  });

  // Login View
  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/api/todo",
      failureRedirect: "/"
    })
  );

  // Register View
  router.get("/sign_up", loggedOutOnly, (req, res) => {
    res.render("/");
  });

  router.post("/sign_up", (req, res, next) => {
    const { username, password } = req.body;
    try {
      userModel
        .create({ username, password })
        .then(user => {
          req.login(user, err => {
            if (err) next(err);
            else res.redirect("/api/todo");
          });
        })
        .catch(err => {
          if (err.name === "ValidationError") {
            res.redirect("/");
          } else next(err);
        });
    } catch (err) {
      console.log("ERROR - /auth/sign_up");
      res.render("/");
    }
  });
  // Logout Handler
  router.all("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  return router;
}
module.exports = authenticate;
module.exports.loggedInOnly = loggedInOnly;
