const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const askUnifiedChatController = async (req, res) => {
  try {
    const { message, sessionId, mode } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/chat/ask`, {
      userId: req.user.id,
      sessionId: sessionId || `session-${Date.now()}`,
      message,
      mode: mode || "general",
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("askUnifiedChatController error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.detail || error.message || "Chat failed",
      details: error.response?.data || null,
    });
  }
};

module.exports = {
  askUnifiedChatController,
};