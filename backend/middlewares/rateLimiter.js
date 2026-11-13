import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 10 attempts per 15 minutes per IP; AUTH_RATE_LIMIT_MAX exists so automated tests can raise it.
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});
