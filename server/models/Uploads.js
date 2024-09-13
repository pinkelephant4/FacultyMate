const mongoose = require("mongoose");
const User = require("./User");

const uploadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["faculty", "student"],
  },
  Achievement_Type: {
    type: String,
    enum: [
      "Award",
      "Patent Publication",
      "Confrence Paper",
      "Research Paper",
      "Certification",
    ],
  },
  Expiry_Date: {
    type: String, //change when frontend connected
  },
  Achievement_Title: {
    type: String,
  },
  Achievement_Details: {
    type: String,
  },
  files: [
    {
      type: String,
    },
  ],
  // userId: [User.Types.ObjectId],
  Student_Name: {
    type: String,
    required: function () {
      return this.category === "student";
    },
  },
  Student_Registration_No: {
    type: Number,
    required: function () {
      return this.category === "student";
    },
  },
  Student_Branch: {
    type: String,
    enum: ["CCE", "IOT"],
    required: function () {
      return this.category === "student";
    },
  },
  Student_Batch: {
    type: Number,
    required: function () {
      return this.category === "student";
    },
  },
});

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;

// faculty upload
// Achievement Type -> Award Patent Publication Confrence Paper Research Paper Certification
// Expiry Date -> date
// Ach title -> string
// Ach details -> string
// files

// student upload
// Student Name -> string
// Student Registration No -> number
// Student Branch -> CCE IOT
// Student Batch -> number

// Achievement Type -> Award Patent Publication Confrence Paper Research Paper Certification
// Expiry Date -> date
// Ach title -> string
// Ach details -> string
// files
