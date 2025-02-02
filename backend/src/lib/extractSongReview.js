import natural from "natural";
import SongReview from "../models/songReview.js";

const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

export const extractAndAnalyze = async (message, userId) => {
	const words = tokenizer.tokenize(message.content);
	let songName = null;
	let artistName = null;

	// Simple Rule-based extraction (Can be improved with NLP)
	words.forEach((word, index) => {
		if (["song", "track", "by"].includes(word.toLowerCase()) && index < words.length - 1) {
			songName = words[index + 1];
		}
		if (word.toLowerCase() === "by" && index < words.length - 1) {
			artistName = words[index + 1];
		}
	});

	// Sentiment Analysis
	const sentimentScore = analyzer.getSentiment(words);
	let sentiment = "neutral";
	if (sentimentScore > 0) sentiment = "positive";
	else if (sentimentScore < 0) sentiment = "negative";

	// Store in MongoDB
	if (songName || artistName) {
		const review = new SongReview({ songName, artistName, review: message.content, sentiment, userId });
		await review.save();
	}
};
