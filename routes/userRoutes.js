const { Router } = require("express");
const userRoutes = Router();

const { createUserController } = require("../controllers/userController");
const passport = require("passport");

const { showFolders } = require("../controllers/folderController");

const {isAuthenticated} = require("../middlewares/authMiddleware")
// Render signup page
userRoutes.get("/signup", (req, res) => {
  res.render("signup", { errors: [] });
});

// Handle signup form submission
userRoutes.post("/signup", createUserController);

// Render login page
userRoutes.get("/login", (req, res) => {
  res.render("login", { errors: [] });
});

// Handle login
userRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  })
);

userRoutes.get("/dashboard", isAuthenticated, showFolders);

userRoutes.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/login");
  });
});
module.exports = userRoutes;