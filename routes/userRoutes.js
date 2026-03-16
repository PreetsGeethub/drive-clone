const { Router } = require("express");
const userRoutes = Router();

const { createUserController } = require("../controllers/userController");
const passport = require("passport");

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

module.exports = userRoutes;