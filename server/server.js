const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const generalChatRoutes = require("./routes/generalChatRoutes");

const PORT = process.env.PORT || 5000;

// =====================
// CORS
// =====================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-saas-client.onrender.com",
  "https://pandugoud.github.io",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// HEALTH
// =====================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI SaaS Server Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API Healthy",
  });
});

// =====================
// API ROUTES
// =====================

app.use("/api/auth", authRoutes);
app.use("/api/chat", generalChatRoutes);

// =====================
// STATIC FRONTEND
// =====================

const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

// React routes మాత్రమే
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// =====================
// API 404
// =====================

app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// =====================
// ERROR
// =====================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// =====================
// START
// =====================

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
