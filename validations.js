import { body } from "express-validator";

export const loginValidation = [
  body("email", "invalid mail format").isEmail(),
  body("password", "password must contain at least 5 characters").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "invalid mail format").isEmail(),
  body("password", "password must contain at least 5 characters").isLength({
    min: 5,
  }),
  body("fullName", "username must contain at least 3 characters").isLength({
    min: 3,
  }),
  body("avatarUrl", "invalid url").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Enter article title").isLength({ min: 3 }).isString(),
  body("text", "Enter article text").isLength({ min: 10 }).isString(),
  body("tags", "invalid tag format").optional().isString(),
  body("imageUrl", "invalid url link").optional().isString(),
];
