import express from "express";
import commentController from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { minEditorLevel } from "../middlewares/minEditorLevelMiddleware";

export const commentRouter = express.Router();

// Save comment
commentRouter.post("/comment", authMiddleware, commentController.saveComment);

// Get comments
commentRouter.get("/comments/:contentID/:versionID", authMiddleware, minEditorLevel, commentController.getComments);