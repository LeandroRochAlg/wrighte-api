import express from "express";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";
import BookContentController from "../controllers/bookContentController";

export const userRouter = express.Router();

// Login
userRouter.post("/login", async (req, res) => {
    await AuthController.login(req, res);
});

// Logout
userRouter.post("/logout", AuthController.logout);

// Register
userRouter.post("/register", AuthController.register);

// Get users
userRouter.get("/users", UserController.getUsers);

// Save book
userRouter.post("/book-content", async (req, res) => {
    await BookContentController.saveContent(req, res);
});

userRouter.get("/contents", async (req, res) => {
    await BookContentController.getUserContents(req, res);
});

userRouter.get("/content/:id", async (req, res) => {
    await BookContentController.getContentById(req, res);
});