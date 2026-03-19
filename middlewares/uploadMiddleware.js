const multer = require("multer");

// 1️⃣ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// 2️⃣ Allowed types
const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg"
];

// 3️⃣ File filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Invalid file type"), false); // reject file
  }
};

// 4️⃣ Create upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

module.exports = upload;