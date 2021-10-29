const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// USE BODY_PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CONNECT DB
require("./db/connection");

// <-----------------------------------------------Import Routes----------------------------------------------->

const authRoute = require("./routes/auth");

// <-----------------------------------------------Route Middlewares------------------------------------------->
app.use("/api/user", authRoute);

// <-----------------------------------------------Error Handling---------------------------------------------->
// IMPORT STATUS_CODE_FILE
const { statusCode } = require("./constant/statusCode");
app.use((req, res) => {
  res.status(statusCode.errorCode).json({
    error: "Bad Request",
  });
});

app.listen(3000, () => {
  console.log("Server Up and Running...");
});
