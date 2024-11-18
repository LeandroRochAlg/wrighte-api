import express from "express";
import TextController from "../controllers/textController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const textRouter = express.Router();

// Save book
textRouter.post("/book-content", authMiddleware, TextController.saveContent);

// Save content version
textRouter.post("/content-version", authMiddleware, TextController.saveContentVersion);

// Get content versions list
textRouter.get("/content-versions-list/:id", authMiddleware, TextController.getContentVersionsList);

// Get content versions
textRouter.get("/content-versions/:id", authMiddleware, TextController.getContentVersions);

// Get content version
textRouter.get("/content-version/:contentID/:versionID", authMiddleware, TextController.getContentVersion);

// Get contents
textRouter.get("/contents", authMiddleware, TextController.getUserContents);

// Get content by ID
textRouter.get("/content/:id", authMiddleware, TextController.getContentById);

// Get user overview
textRouter.get("/user-contents/:username", authMiddleware, TextController.getUserContentDetails);

// Get all contents
textRouter.get("/all-contents", authMiddleware, TextController.getAllContents);