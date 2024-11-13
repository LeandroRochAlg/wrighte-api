import express from "express";
import TextController from "../controllers/textController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const textRouter = express.Router();

// Save book
textRouter.post("/book-content", authMiddleware, TextController.saveContent);

// Save content version
textRouter.post("/content-version", authMiddleware, TextController.saveContentVersion);

// Get contents
textRouter.get("/contents", authMiddleware, TextController.getUserContents);

// Get content by ID
textRouter.get("/content/:id", authMiddleware, TextController.getContentById);