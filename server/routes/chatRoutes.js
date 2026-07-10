const express = require("express");
const { askUnifiedChatController } = require("../controllers/chatController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/ask", requireAuth, askUnifiedChatController);

module.exports = router;