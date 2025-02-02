import express from "express";
import { extractAndAnalyze } from "../lib/extractSongReview.js";

const router = express.Router();

// Process message for song details & sentiment
router.post("/extract", async (req, res) => {
	try {
		const { message } = req.body;
		await extractAndAnalyze(message);
		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ message: "Error processing message" });
	}
});

export default router;
