import Lead from "../../models/Lead.model.js";
import User from "../../models/User.model.js";

const assignLead = async (req, res) => {
	try {
		const { leadId, dealerId } = req.body;
		if (!leadId && !dealerId) {
			return res.status(400).json({ message: "Lead ID or Dealer ID not found!" });
		}
		const currDealerId = await User.findOne({ _id: dealerId });
		if (currDealerId.status == "unverified") {
			return res.status(403).json({ message: "Dealer is'nt verified yet!" });
		}
		const lead = await Lead.findOneAndUpdate(
			{ _id: leadId },
			{ assignedDealer: dealerId },
			{ status: "assigned" },
			{ new: true },
		);
		if (!lead) {
			return res.status(400).json({ message: "Lead ID is not valid!" });
		}

		return res.status(200).json({ message: "Dealer assigned!", lead });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

export default assignLead;
