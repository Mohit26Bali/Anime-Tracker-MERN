import { body } from "express-validator";
import { checkPassword } from "../utils/passwordPolicy.js";

const usernameRule = (chain) =>
  chain
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[A-Za-z0-9_.-]+$/)
    .withMessage("Username may contain only letters, numbers, '_', '.' and '-'");

// Strength policy applies to NEW passwords only (registration). Login stays lenient so that
// accounts created before the policy existed can still sign in.
const newPasswordRule = body("password").custom((value, { req }) => {
  const result = checkPassword(value, { username: req.body.username, email: req.body.email });
  if (!result.ok) throw new Error(result.errors[0]);
  return true;
});

export const registerValidator = [
  usernameRule(body("username")),
  body("email").trim().isEmail().withMessage("A valid email is required").isLength({ max: 254 }),
  newPasswordRule,
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password").isString().notEmpty().isLength({ max: 1024 }).withMessage("Password is required"),
];

// Used after `protect`, so the user's own username/email come from req.user, not from the request body.
export const changePasswordValidator = [
  body("currentPassword").isString().notEmpty().isLength({ max: 1024 }).withMessage("Current password is required"),
  body("newPassword").custom((value, { req }) => {
    const result = checkPassword(value, { username: req.user?.username, email: req.user?.email });
    if (!result.ok) throw new Error(result.errors[0]);
    if (value === req.body.currentPassword) {
      throw new Error("New password must be different from the current password");
    }
    return true;
  }),
];

export const updateProfileValidator = [
  usernameRule(body("username").optional()),
  body("avatar")
    .optional({ values: "falsy" })
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Avatar must be a valid http(s) URL")
    .isLength({ max: 500 }),
];
