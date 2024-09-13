const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Use a pre-save hook to hash the password before saving to the database
// userSchema.pre("save", async function (next) {
//   try {
//     // Only hash the password if it's modified or a new user
//     if (this.isModified("password") || this.isNew) {
//       const hashedPassword = await bcrypt.hash(this.password, 10);
//       this.password = hashedPassword;
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
