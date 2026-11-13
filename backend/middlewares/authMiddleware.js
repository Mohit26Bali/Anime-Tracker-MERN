import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Tokens issued before a password change carry an older version (tokens from before this
    // feature have no `v`, which counts as version 0).
    if ((decoded.v ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ message: "Session expired, please sign in again" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
