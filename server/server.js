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


// ===============================
// CORS CONFIG
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://pandugoud.github.io",
  "https://ai-saas-client.onrender.com"
];


const corsOptions = {

  origin: function (origin, callback) {

    // Allow Postman / server requests
    if (!origin) {
      return callback(null, true);
    }


    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }


    console.log("Blocked CORS Origin:", origin);

    return callback(null, false);

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


  optionsSuccessStatus: 204

};


// CORS MUST BE FIRST
app.use(cors(corsOptions));


// Preflight requests
app.options("*", cors(corsOptions));



// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);



// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "AI SaaS API Running"
  });

});


app.get("/api/health", (req, res) => {

  res.json({
    success: true,
    message: "API Healthy"
  });

});



// ===============================
// API ROUTES
// ===============================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/chat",
  generalChatRoutes
);



// ===============================
// SERVE REACT FRONTEND (OPTIONAL)
// ===============================

const clientPath = path.join(
  __dirname,
  "../client/dist"
);


app.use(
  express.static(clientPath)
);


// React Router fallback
app.get("*", (req, res) => {

  res.sendFile(
    path.join(
      clientPath,
      "index.html"
    )
  );

});



// ===============================
// ERROR HANDLER
// ===============================

app.use(
  (err, req, res, next) => {

    console.error(
      "Server Error:",
      err.message
    );


    res.status(500).json({

      success: false,

      message: err.message

    });

  }
);



// ===============================
// DATABASE + SERVER START
// ===============================

async function startServer() {

  try {


    if (!process.env.MONGO_URI) {

      throw new Error(
        "MONGO_URI missing"
      );

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
