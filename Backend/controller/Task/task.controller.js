import Task from "../../models/Task.model.js";
import User from "../../models/User.model.js";
import Lead from "../../models/Lead.model.js";

// Create Task
export const createTask = async (req, res) => {
	try {
		const { title, type, dueDate, assignedTo, lead, dealer } = req.body;

		if (!title || !type || !dueDate || !assignedTo) {
			return res.status(400).json({ message: "Required fields missing!" });
		}

		const task = await Task.create({
			title,
			type,
			dueDate,
			assignedTo,
			assignedBy: req.user?._id,
			lead,
			dealer,
		});

		return res.status(201).json({
			message: "Task created successfully",
			task,
		});
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

// Get My Tasks
export const getMyTasks = async (req, res) => {
	try {
		const userId = req.user._id;
		const today = new Date();

		const tasks = await Task.find({ assignedTo: userId }).sort({ dueDate: 1 });

		const overdue = tasks.filter((t) => t.dueDate < today && t.status === "pending");
		const upcoming = tasks.filter((t) => t.dueDate >= today && t.status === "pending");
		const completed = tasks.filter((t) => t.status === "completed");

		return res.status(200).json({
			overdue,
			upcoming,
			completed,
		});
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

// Complete Task
export const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const { remark, status } = req.body;

		const task = await Task.findById(id);

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		task.status = status || task.status;

		if (status === "completed") {
			task.completedAt = new Date();
		}

		if (remark) {
			task.lastRemark = remark;
		}

		await task.save();

		return res.status(200).json({
			message: "Task updated successfully",
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// Update Task
// export const completeTask = async (req, res) => {
// 	try {
// 		const { id } = req.params;

// 		const task = await Task.findByIdAndUpdate(id, req.body, {
// 			new: true,
// 		});

// 		if (!task) {
// 			return res.status(404).json({ message: "Task not found" });
// 		}

// 		return res.status(200).json({
// 			message: "Task updated successfully",
// 			task,
// 		});
// 	} catch (error) {
// 		return res.status(500).json({ message: "Server error" });
// 	}
// };

// Cancel Task
export const cancelTask = async (req, res) => {
	try {
		const { id } = req.params;

		const task = await Task.findById(id);

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		task.status = "cancelled";
		await task.save();

		return res.status(200).json({
			message: "Task cancelled successfully",
		});
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

// Get All Tasks (Admin)
export const getAllTasks = async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ message: "Access denied" });
		}

		const tasks = await Task.find()
			.populate("assignedTo", "name email")
			.populate("assignedBy", "name email")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			message: "All tasks fetched successfully",
			tasks,
		});
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

export const getDealersAndLeads = async (req, res) => {
	try {
		const dealers = await User.find({ role: "dealer" }).select("_id name");
		const leads = await Lead.find().select("_id name assignedDealer");

		return res.status(200).json({
			dealers,
			leads,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
