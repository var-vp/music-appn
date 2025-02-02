import mongoose from "mongoose";

const SongReviewSchema = new mongoose.Schema({
	songName: String,
	artistName: String,
	review: String,
	sentiment: String,
	userId: String,
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SongReview", SongReviewSchema);