import Order from "../../models/Order.model.js";

const getDealerOrders = async (req, res) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			data: orders,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export default getDealerOrders;
