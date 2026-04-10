import Lead from "../../models/Lead.model.js";

const createLead = async (req, res) => {
	try {
		const { name, email, phone, product, quantity, paymentMethod, area, message } = req.body;
		if (!name || !email || !phone || !product || !Number(quantity)) {
			return res.status(400).json({ message: "All required fields must be filled" });
		}
		const existingLead = await Lead.findOne({ email });
		if (existingLead) {
			return res.status(400).json({ message: "Lead with this email already exists" });
		}
		const newLead = await Lead.create({
			name,
			email,
			phone,
			product,
			quantity: Number(quantity),
			paymentMethod,
			area,
			message,
		});
		return res.status(201).json({ message: "Lead created successfully", data: newLead });
	} catch (error) {
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export default createLead;
