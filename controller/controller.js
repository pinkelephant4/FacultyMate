const User = require("../models/User");
const Upload = require("../models/Uploads");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

module.exports.createUser = async (req, res) => {
  try {
    const { email, password, role, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // console.log("user created", user);
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.getCredentials = async (req, res, next) => {
  try {
    const { email } = req.user;
    const credentials = await Upload.find({ email }).exec();
    if (credentials.length === 0) {
      res.json({
        message: "No Credentials Uploaded yet",
      });
    } else {
      res.json({
        message: "Credentials found",
        credentials,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.createStuCredentials = async (req, res, next) => {
  try {
    const {
      //email, //where do i even get this from
      // category,
      Achievement_Type,
      Expiry_Date,
      Achievement_Title,
      Achievement_Details,
      Student_Name,
      Student_Registration_No,
      Student_Branch,
      Student_Batch,
    } = req.body;
    email = req.user.email;
    const uploadedFiles = [];
    req.files.forEach((f) => {
      uploadedFiles.push(f.path);
    });

    const credential = await Upload.create({
      email,
      category: "student",
      Achievement_Type,
      Expiry_Date,
      Achievement_Title,
      Achievement_Details,
      files: uploadedFiles, //change upload model to file= array of strings//done
      Student_Name,
      Student_Registration_No,
      Student_Branch,
      Student_Batch,
    });
    // console.log("student credential created", credential);
    res.json({ message: "student credential created", credential });
  } catch (error) {
    // console.error("Error uploding student credential:", error);
    res.status(500).json({
      error: "Internal Server Error",
      "Error uploding student credential": error,
    });
  }
  // res.redirect("/");
};
module.exports.createFacCredentials = async (req, res, next) => {
  try {
    const {
      //email,
      // category,
      Achievement_Type,
      Expiry_Date,
      Achievement_Title,
      Achievement_Details,
    } = req.body;

    email = req.user.email;
    const uploadedFiles = [];
    req.files.forEach((f) => {
      uploadedFiles.push(f.path);
    });

    const credential = await Upload.create({
      email,
      category: "faculty",
      Achievement_Type,
      Expiry_Date,
      Achievement_Title,
      Achievement_Details,
      files: uploadedFiles,
    });
    // console.log("Faculty Credential created", credential);
    res.json({ message: "Faculty Credential created", credential });
  } catch (error) {
    // console.error("Error uploding faculty credential:", error);
    res.status(500).json({
      "Error uploding faculty credential:": error,
      error: "Internal Server Error",
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }

    // const isPasswordValid = user.matchPassword(password);
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid Password" });
    }

    const exp =
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;

    const token = jwt.sign({ sub: user._id, exp }, process.env.JWT_SECRET);

    const options = {
      expires: new Date(exp),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.status(200).cookie("token", token, options).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.checkAuth = (req, res) => {
  res.status(200).json({ message: "success" });
};

module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out Successfully" });
  }
  res.status(200).json({ message: "Already Logged out" });
};

module.exports.dwdCredentials = async (req, res) => {
  const { _id } = req.user;
  console.log(path.join(__dirname, `../uploads/${_id}/`));
  try {
    res.zip({
      files: [
        {
          path: path.join(__dirname, `../uploads/${_id}/`),
          name: `${_id}`,
        },
      ],
      filename: "credentials.zip",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.dwdCurrCredential = async (req, res) => {
  // const { email } = req.user;
  // try {
  //   const credential = await Upload.findOne({ email });
  //   if (!credential) {
  //     return res.status(404).json({ message: "No current credential found" });
  //   }
  //   let file = path.join(__dirname, "..", credential.files[0]);
  //   res.download(file);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "Server error" });
  // }

  const cred_id = req._id; //change as required
  const credential = await Upload.findById(cred_id);
  res.download("", credential.Achievement_Title);
};
// dwd current
// router.get('/:id/download', function (req, res, next) {
//   var filePath = "/my/file/path/..."; // Or format the path using the `id` rest param
//   var fileName = "report.pdf"; // The default name the browser will use

//   res.download(filePath, fileName);
// });
