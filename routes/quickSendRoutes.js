const { Router } = require("express");
const router = Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  createQuickSend,
  accessQuickSend,
  showEnterCodePage,
  receiveFile
} = require("../controllers/quickSendController");

// Render Quick Send upload page
router.get("/quick-send", (req, res) => {
  res.render("quickSend");
});

// Handle file upload + code generation
router.post(
  "/quick-send",
  upload.single("file"),
  createQuickSend
);

// Access file using code
router.get(
  "/quick-send/:code",
  accessQuickSend
);

router.get("/enter-code", (req, res) => {
  res.render("enterCode");
});
router.post("/enter-code", (req, res) => {
  const { code } = req.body;

  res.redirect(`/quick-send/${code}`);
});

router.get("/receive-file", showEnterCodePage);

router.post("/receive-file", receiveFile);
module.exports = router;