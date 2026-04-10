import User from "../../models/User.model.js";
import Lead from "../../models/Lead.model.js";
import Order from "../../models/Order.model.js";

const getAdminDashboard = async (req, res) => {
	try {

		const totalUsers = await User.countDocuments();
		const totalDealers = await User.countDocuments({ role: "dealer" });

		const [
			totalLeads,
			convertedLeads,
			pendingLeads,
			totalOrders,
			assignedLeads,
			recentLeads,
			recentOrders,
			lostLeads,

			// 👉 region counts
			northCount,
			southCount,
			eastCount,
			westCount,

			// 👉 revenue
			northRevenue,
			southRevenue,
			eastRevenue,
			westRevenue,
		] = await Promise.all([
			Lead.countDocuments(),
			Lead.countDocuments({ status: "converted" }),
			Lead.countDocuments({ status: "pending" }),
			Order.countDocuments(),
			Lead.countDocuments({ status: "assigned" }),
			Lead.find().sort({ createdAt: -1 }).limit(5),
			Order.find().sort({ createdAt: -1 }).limit(5),
			Lead.countDocuments({ status: "lost" }),

			// counts
			Order.countDocuments({ area: "north" }),
			Order.countDocuments({ area: "south" }),
			Order.countDocuments({ area: "east" }),
			Order.countDocuments({ area: "west" }),

			// revenue
			Order.aggregate([
				{ $match: { area: "north" } },
				{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
			]),
			Order.aggregate([
				{ $match: { area: "south" } },
				{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
			]),
			Order.aggregate([
				{ $match: { area: "east" } },
				{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
			]),
			Order.aggregate([
				{ $match: { area: "west" } },
				{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
			]),
		]);

		// ✅ build final object
		const regionStats = {
			north: {
				count: northCount,
				totalRevenue: northRevenue[0]?.total || 0,
			},
			south: {
				count: southCount,
				totalRevenue: southRevenue[0]?.total || 0,
			},
			east: {
				count: eastCount,
				totalRevenue: eastRevenue[0]?.total || 0,
			},
			west: {
				count: westCount,
				totalRevenue: westRevenue[0]?.total || 0,
			},
		};

		res.status(200).json({
			success: true,
			data: {
				totalUsers,
				totalDealers,
				totalLeads,
				convertedLeads,
				pendingLeads,
				totalOrders,
				assignedLeads,
				lostLeads,
				regionStats,
				recentLeads,
				recentOrders,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export default getAdminDashboard;
