const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const generalChatController = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/chat/general`, {
      userId: req.user.id,
      sessionId: sessionId || `session-${Date.now()}`,
      message,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("generalChatController error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.detail || error.message || "General chat failed",
      details: error.response?.data || null,
    });
  }
};

module.exports = {
  generalChatController,
};