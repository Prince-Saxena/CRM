import Lead from "../../models/Lead.model.js";

const getLead = async (req, res) => {
     try {
            const dealerId = req.user._id;
            console.log("Dealer",dealerId);
            
			const leads = await Lead.find({ assignedDealer: dealerId }).select("-password -__v");
			res.status(200).json({ success: true, data: leads });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
}

export default getLead;