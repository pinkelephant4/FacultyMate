const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    if (Date.now() > decoded.exp) {
      console.log(Date.now(), decoded.exp);
      return res.status(401).json({ message: "Token Expired, login again" });
    }
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: "No user found" });
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Error while Authorization, Login again" });
  }
};

module.exports = requireAuth;