import express from "express";
import TextController from "../controllers/textController";

export const textRouter = express.Router();

// Save book
textRouter.post("/book-content", async (req, res) => {
    await TextController.saveContent(req, res);
});

// Get contents
textRouter.get("/contents", async (req, res) => {
    await TextController.getUserContents(req, res);
});

// Get content by ID
textRouter.get("/content/:id", async (req, res) => {
    await TextController.getContentById(req, res);
});