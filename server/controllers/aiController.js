const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const trainDocumentController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "file is required",
      });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("botId", req.body.botId || "default-bot");
    formData.append("userId", req.body.userId || req.user?.id || "");

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/documents/train`,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("trainDocumentController error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Document training failed",
      details: error.response?.data || null,
    });
  }
};

const askDocController = async (req, res) => {
  try {
    const { question, botId, userId, sessionId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/chat/ask`, {
      question,
      botId: botId || "default-bot",
      userId: userId || req.user?.id || "",
      sessionId: sessionId || "",
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("askDocController error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Document chat failed",
      details: error.response?.data || null,
    });
  }
};

module.exports = {
  trainDocumentController,
  askDocController,
};