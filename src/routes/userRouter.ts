import express from "express";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

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

// Update user profile
userRouter.put("/update-profile", authMiddleware, UserController.updateUser);

// Update user password
userRouter.put("/update-password", authMiddleware, UserController.updatePassword);
