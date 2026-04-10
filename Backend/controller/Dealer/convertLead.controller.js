import Lead from "../../models/Lead.model.js";
import Order from "../../models/Order.model.js";
import User from "../../models/User.model.js";

const confirmLeadToOrder = async (req, res) => {
	try {
		const { id } = req.params; // lead id
		const dealerId = req.user._id;

        
		// 🔍 find lead
		const lead = await Lead.findById(id);

		if (!lead) {
			return res.status(404).json({ message: "Lead not found" });
		}

		// ❌ check dealer assigned
		if (!lead.assignedDealer) {
			return res.status(400).json({
				message: "No dealer assigned to this lead",
			});
		}

		// ❌ check correct dealer (optional but recommended)
		if (lead.assignedDealer.toString() !== dealerId.toString()) {
			return res.status(403).json({
				message: "You are not assigned to this lead",
			});
		}

		// ❌ already converted
		if (lead.status == "converted") {
			return res.status(409).json({
				message: "Lead already converted",
			});
		}

		// ✅ create order
		const order = await Order.create({
			lead: lead._id,
			dealer: lead.assignedDealer,
			customer: lead.customer || null,

			product: lead.product,
			quantity: 1,
			price: lead.price || 0,
			totalAmount: (lead.price || 0) * 1,

			address: lead.address,
			area: lead.area,

			status: "confirmed",
			paymentStatus: "pending",
		});

		// ✅ update lead
		lead.status = "converted";
		await lead.save();

        const user = await User.create({
            name: lead.name,
            email:lead.email,
            phone:lead.phone,
            role:"customer",
            status:"customer"
        })

		return res.status(201).json({
			message: "Lead converted to order successfully",
			order,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error converting lead",
			error: error.message,
		});
	}
};

export default confirmLeadToOrder;
