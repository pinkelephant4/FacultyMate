const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/routes");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const zip = require("express-easy-zip");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(zip());

//connnect to DB
connectDB();

//Routes
app.use("/", apiRoutes);
app.get("/", (req, res) => {
  res.send("Running server");
});

//starting server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
