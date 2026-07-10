const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  trainDocumentController,
  askDocController,
} = require("../controllers/aiController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/train", requireAuth, upload.single("file"), trainDocumentController);
router.post("/ask-doc", requireAuth, askDocController);

module.exports = router;