const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const webSearchController = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "query is required",
      });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/web/search`, {
      query,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("webSearchController error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Web search failed",
      details: error.response?.data || null,
    });
  }
};

module.exports = {
  webSearchController,
};