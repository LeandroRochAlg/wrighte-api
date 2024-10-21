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
userRouter.post("/book-content", BookContentController.bookContent);