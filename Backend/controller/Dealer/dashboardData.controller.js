import Lead from "../../models/Lead.model.js";
import Order from "../../models/Order.model.js";

const getDealerDashboard = async (req, res) => {
	try {
		const dealerId = req.user._id;

		const orderFilter = { dealer: dealerId };
		const leadFilter = { assignedDealer: dealerId };

		const [
			totalLeads,
			convertedLeads,
			pendingLeads,
			lostLeads,

			totalOrders,
			pendingOrders,

			recentLeads,
			recentOrders,

			salesData,
		] = await Promise.all([
			Lead.countDocuments(leadFilter),
			Lead.countDocuments({ ...leadFilter, status: "converted" }),
			Lead.countDocuments({ ...leadFilter, status: "pending" }),
			Lead.countDocuments({ ...leadFilter, status: "lost" }),

			Order.countDocuments(orderFilter),
			Order.countDocuments({ ...orderFilter, status: "pending" }),

			Lead.find(leadFilter).sort({ createdAt: -1 }).limit(5),
			Order.find(orderFilter).sort({ createdAt: -1 }).limit(5),

			// 🔥 total sales + avg per customer
			Order.aggregate([
				{ $match: orderFilter },
				{
					$group: {
						_id: null,
						totalSales: { $sum: "$totalAmount" },
						avgSalesPerCustomer: { $avg: "$totalAmount" },
					},
				},
			]),
		]);

		// fallback if no orders
		const totalSales = salesData[0]?.totalSales || 0;
		const avgSalesPerCustomer = salesData[0]?.avgSalesPerCustomer || 0;

		res.status(200).json({
			success: true,
			data: {
				totalLeads,
				convertedLeads,
				pendingLeads,
				lostLeads,

				totalOrders,
				pendingOrders,

				totalSales,
				avgSalesPerCustomer,

				recentLeads,
				recentOrders,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export default getDealerDashboard;
