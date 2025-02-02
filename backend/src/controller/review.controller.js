import SongReview from "../models/songReview.js";

// Fetch stored reviews
export const getReviews = async (req, res) => {
	try {
		const reviews = await SongReview.find();
		res.json(reviews);
	} catch (error) {
		res.status(500).json({ message: "Error fetching reviews" });
	}
};
