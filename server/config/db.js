const mongoose = require("mongoose");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`For some reasons we couldn't connect to the DB`, error);
  }
};

module.exports = connectDB;
