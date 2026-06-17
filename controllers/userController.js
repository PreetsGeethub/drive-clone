const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {prisma} = require("../prismaClient");

const userValidation = [
  body("firstName")
    .notEmpty().withMessage("First name cannot be empty")
    .trim()
    .isAlpha().withMessage("Only letters allowed"),

  body("lastName")
    .notEmpty().withMessage("Last name cannot be empty")
    .trim()
    .isAlpha().withMessage("Only letters allowed"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];

const createUserController = [
  ...userValidation,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("signup", {
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Save user in database
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
        },
      });

      // Redirect after success
      res.redirect("/login");
    } catch (err) {
      console.error(err);
      res.send("Error creating user");
    }
  },
];

module.exports = {
  createUserController,
};
