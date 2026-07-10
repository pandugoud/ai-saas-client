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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pandugoud.github.io",
      "https://ai-saas-client.onrender.com"
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Health API FIRST
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API Healthy"
  });
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", generalChatRoutes);



// React build path
const clientPath = path.join(__dirname, "../client/dist");


// Serve frontend
app.use(express.static(clientPath));


// React router fallback
app.get("*", (req, res) => {
  res.sendFile(
    path.join(clientPath, "index.html")
  );
});



// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success:false,
    message:err.message
  });
});



// MongoDB
async function startServer(){

  try{

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT,"0.0.0.0",()=>{
      console.log(`🚀 Server running on port ${PORT}`);
    });

  }
  catch(error){

    console.error(error.message);
    process.exit(1);

  }

}


startServer();
