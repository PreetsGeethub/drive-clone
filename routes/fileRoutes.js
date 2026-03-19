const { Router } = require("express");
const fs = require("fs");
const router = Router();

const upload = require("../middlewares/uploadMiddleware");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {uploadFile,downloadFile,deleteFile} = require("../controllers/uploadFileController")

// temporary controller (we'll improve later)
// const uploadFileController = (req, res) => {
//   console.log(req.file); // 👈 STEP 4
//   res.send("File uploaded!");
// };

router.post(
  "/files/upload/:folderId",
  isAuthenticated,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        return res.send(err.message); // show error
      }
      next();
    });
  },
  uploadFile
);
router.get("/files/download/:id", isAuthenticated, downloadFile);
router.get("/files/delete/:id", isAuthenticated, deleteFile);
module.exports = router;