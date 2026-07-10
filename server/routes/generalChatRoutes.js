const express = require("express");
const axios = require("axios");
const { requireAuth } = require("../middlewares/authMiddleware");
const chatLimitMiddleware = require("../middlewares/chatLimitMiddleware");

const router = express.Router();

router.post("/", requireAuth, chatLimitMiddleware, async (req, res) => {
  try {
    const { message, sessionId, mode } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const aiServiceUrl =
      process.env.AI_SERVICE_URL || "http://127.0.0.1:8001/api/chat/ask";

    const response = await axios.post(
      aiServiceUrl,
      {
        message: message.trim(),
        userId: req.user.id,
        sessionId: sessionId || `session-${Date.now()}`,
        mode: mode || "general",
      },
      {
        timeout: 600000,
      }
    );

    const user = req.currentUserDoc;
    const today = new Date().toISOString().slice(0, 10);

    if (user.dailyChatDate !== today) {
      user.dailyChatDate = today;
      user.dailyChatCount = 0;
    }

    if (user.plan === "free") {
      user.dailyChatCount += 1;
      await user.save();
    }

    const dailyLimit = 10;

    const usage = {
      plan: user.plan,
      usedChats: user.dailyChatCount,
      dailyLimit: user.plan === "free" ? dailyLimit : null,
      remainingChats:
        user.plan === "free"
          ? Math.max(dailyLimit - user.dailyChatCount, 0)
          : null,
    };

    return res.status(200).json({
      ...response.data,
      usage,
    });
  } catch (error) {
    return res.status(error?.response?.status || 500).json({
      message:
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error.message ||
        "AI request failed",
    });
  }
});

module.exports = router;
