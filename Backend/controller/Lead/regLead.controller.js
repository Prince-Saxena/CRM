import Lead from "../../models/Lead.model.js";

const registerLead = async (req, res) => {
	try {
		const { name, email, phone, area, message } = req.body;

		if (!name || !phone) {
			return res.status(400).json({ message: "Name and phone are required!" });
		}

		const existingLead = await Lead.findOne({ email });

		if (existingLead) {
			return res.status(409).json({ message: "Lead already exists!" });
		}

		const newlead = await Lead.create({
			name,
			email,
			phone,
			area,
			message,
		});

		return res.status(201).json({
			message: "Lead registered successfully",
			newlead,
		});
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

export default registerLead;
