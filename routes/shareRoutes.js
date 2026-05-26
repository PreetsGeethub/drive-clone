const { Router } = require("express");
const router = Router();

const { createShareLink, viewSharedFolder } = require("../controllers/shareController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// Create link (logged in)
router.get("/share/create/:folderId", isAuthenticated, createShareLink);

// Access link (public)
router.get("/share/:uuid", viewSharedFolder);

module.exports = router;