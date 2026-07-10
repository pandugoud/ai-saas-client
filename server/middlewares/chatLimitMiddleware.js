const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (user.dailyChatDate !== today) {
      user.dailyChatDate = today;
      user.dailyChatCount = 0;
      await user.save();
    }

    if (user.plan === "free" && user.dailyChatCount >= 10) {
      return res.status(403).json({
        message: "Daily free chat limit reached",
      });
    }

    req.currentUserDoc = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Chat limit check failed",
    });
  }
};
