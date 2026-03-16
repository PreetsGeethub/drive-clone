const express = require("express");
require("dotenv").config();
const path = require("node:path");

const app = express();

const userRoutes = require("./routes/userRoutes");
const sessionMiddleware = require("./config/session");
const passport = require("passport");

// load passport strategy
require("./config/passport");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session middleware
app.use(sessionMiddleware);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});


app.get("/test", (req, res) => {
  res.send(req.user);
});

app.use(userRoutes);

module.exports = app;