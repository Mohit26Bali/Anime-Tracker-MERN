import jwt from "jsonwebtoken";

// `tokenVersion` (User.tokenVersion) is embedded as `v` so that changing the password
// invalidates every token issued before the change.
const generateToken = (res, userId, tokenVersion = 0) => {
  const token = jwt.sign({ id: userId, v: tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
