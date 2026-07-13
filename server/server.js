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
  "https://ai-saas-client-zeta.vercel.app",
  "https://ai-saas-client.onrender.com",
  "https://pandugoud.github.io"
];


const corsOptions = {

  origin: function(origin, callback){

    console.log("REQUEST ORIGIN:", origin);


    if(!origin){
      return callback(null,true);
    }


    if(allowedOrigins.includes(origin)){
      return callback(null,true);
    }


    return callback(
      new Error("CORS blocked")
    );

  },


  credentials:true,


  methods:[
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],


  allowedHeaders:[
    "Content-Type",
    "Authorization"
  ]

};


// MUST be first middleware
app.use(cors(corsOptions));


// Handle all OPTIONS
app.use(
  express.urlencoded({
    extended:true
  })
);


app.use(express.json());



// =====================
// HEALTH
// =====================


app.get("/",(req,res)=>{

  res.json({
    success:true,
    message:"AI SaaS Server Running"
  });

});


app.get("/api/health",(req,res)=>{

  res.json({
    success:true,
    message:"API Healthy"
  });

});



// =====================
// ROUTES
// =====================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/chat",
  generalChatRoutes
);



// =====================
// STATIC
// =====================

const clientPath = path.join(
  __dirname,
  "../client/dist"
);


app.use(
  express.static(clientPath)
);



// =====================
// FRONTEND ROUTES
// =====================

app.get(
  /^\/(?!api).*/,
  (req,res)=>{

    res.sendFile(
      path.join(
        clientPath,
        "index.html"
      )
    );

  }
);



// =====================
// ERROR
// =====================

app.use(
(err,req,res,next)=>{

console.error("ERROR:",err.message);


res.status(500).json({

success:false,

message:err.message

});


});



// =====================
// START
// =====================

async function startServer(){

try{


await mongoose.connect(
process.env.MONGO_URI
);


console.log("MongoDB Connected");


app.listen(
PORT,
"0.0.0.0",
()=>{

console.log(
`Server running ${PORT}`
);

});


}
catch(err){

console.error(err);

process.exit(1);

}

}


startServer();
