import express from "express";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";

export const userRouter = express.Router();

// Login
userRouter.post("/login", AuthController.login);

// Logout
userRouter.post("/logout", AuthController.logout);

// Register
userRouter.post("/register", AuthController.register);

// Get users
userRouter.get("/users", UserController.getUsers);