// controllers/profileController.js

import User from "../../models/User.model.js";

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		console.error("getProfile error:", err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
	try {
		const { name, phone, area, city } = req.body;

		// email and role are NOT allowed to be updated here
		const updated = await User.findByIdAndUpdate(
			req.user.id,
			{ name, phone, area, city },
			{ new: true, runValidators: true },
		).select("-password");

		if (!updated) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: updated,
		});
	} catch (err) {
		console.error("updateProfile error:", err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Both current and new password are required",
			});
		}

		if (newPassword.length < 8) {
			return res.status(400).json({
				success: false,
				message: "New password must be at least 8 characters",
			});
		}

		// fetch user WITH password for comparison
		const user = await User.findById(req.user.id).select("+password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const isMatch = await user.comparePassword(currentPassword);

		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Current password is incorrect",
			});
		}

		user.password = newPassword; // pre-save hook will hash it
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (err) {
		console.error("changePassword error:", err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
