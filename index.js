import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

dotenv.config();

const dbConnection = process.env.DB_CONNECTION;

mongoose
  .connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connect OK"))
  .catch((err) => console.log("DB Error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/profile", checkAuth, UserController.getProfile);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/upload/${req.file.originalname}`,
  });
});

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.get("/posts", PostController.getAllPosts);
app.get("/posts/:id", PostController.getPostById);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    console.log("Error");
  }

  console.log("Server Ok");
});
