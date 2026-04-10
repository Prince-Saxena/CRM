import Lead from "../../models/Lead.model.js";
import User from "../../models/User.model.js";

export const getLeadsWithDealers = async (req, res) => {
	try {
		// 🔥 get leads (only required fields)
		const leads = await Lead.find()
			.select("_id name product area status assignedDealer createdAt")
			.sort({ createdAt: -1 });

		// 🔥 get verified dealers only
		const dealers = await User.find({
			role: "dealer",
			status: "verified", // adjust if your field name differs
		}).select("_id name area");

		res.status(200).json({
			success: true,
			data: {
				leads,
				dealers,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
