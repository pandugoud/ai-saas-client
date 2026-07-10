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
  "https://ai-saas-client.onrender.com",
  "https://pandugoud.github.io"
];


app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman / mobile / server requests
      if (!origin) {
        return callback(null, true);
      }


      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      console.log("Blocked CORS origin:", origin);

      return callback(null, false);
    },


    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);


// IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended:true }));



// ===============================
// HEALTH
// ===============================

app.get("/", (req,res)=>{
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
// SERVE REACT BUILD
// ===============================


const clientPath = path.join(
  __dirname,
  "../client/dist"
);


app.use(
  express.static(clientPath)
);



app.get("*",(req,res)=>{

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


app.use((err,req,res,next)=>{

  console.error(
    "ERROR:",
    err
  );


  res.status(500).json({

    success:false,

    message:err.message

  });


});






// ===============================
// DATABASE
// ===============================


async function startServer(){

try{


if(!process.env.MONGO_URI){

throw new Error(
"MONGO_URI missing"
);

}



await mongoose.connect(
process.env.MONGO_URI
);



console.log(
"MongoDB Connected"
);



app.listen(
PORT,
"0.0.0.0",
()=>{

console.log(
`Server running on ${PORT}`
);

}

);



}
catch(error){

console.error(
error.message
);


process.exit(1);


}



}


startServer();
