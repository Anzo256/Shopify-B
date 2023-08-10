const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

app.use(express.json())
app.use(cookieParser());
//route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

//route paths
app.use("/api/v1",product);
app.use("/api/v1",user);

//Middleware for Error
app.use(errorMiddleware);


module.exports = app