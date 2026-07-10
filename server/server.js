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


// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://pandugoud.github.io",
  "https://ai-saas-client.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman / direct requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Same domain deployment lo CORS block avvakunda
      return callback(null, true);
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],

    credentials: true,
  })
);


app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API Healthy",
  });
});



// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", generalChatRoutes);



// ===============================
// React Frontend Serve
// ===============================

const frontendPath = path.join(
  __dirname,
  "../client/dist"
);


app.use(
  express.static(frontendPath)
);


// React Router fallback
app.get("*", (req, res) => {

  res.sendFile(
    path.join(
      frontendPath,
      "index.html"
    )
  );

});



// Error Handler
app.use((err, req, res, next) => {

  console.error(
    "Server Error:",
    err.message
  );

  res.status(500).json({
    success: false,
    message: err.message,
  });

});



// MongoDB + Server Start
async function startServer() {

  try {

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }


    await mongoose.connect(
      process.env.MONGO_URI
    );


    console.log(
      "✅ MongoDB Connected Successfully"
    );


    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );
      }
    );


  } catch (error) {

    console.error(
      "❌ MongoDB Connection Error:",
      error.message
    );

    process.exit(1);

  }

}


startServer();
