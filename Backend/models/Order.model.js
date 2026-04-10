import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		// 🔗 Reference to Lead
		lead: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Lead",
			required: true,
		},

		// 🔗 Dealer who handled the order
		dealer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// 🔗 Customer (optional if separate user)
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		// 📦 Order details
		product: {
			type: String,
			required: true,
			default:"machine"
		},

		quantity: {
			type: Number,
			default: 1,
		},

		price: {
			type: Number,
			required: true,
		},

		totalAmount: {
			type: Number,
			required: true,
		},

		// 📌 Order status
		status: {
			type: String,
			enum: ["pending", "confirmed", "delivered", "cancelled"],
			default: "pending",
		},

		// 📍 Delivery info
		address: {
			type: String,
		},

		area: {
			type: String,
		},

		// 💳 Payment
		paymentMethod: {
			type: String,
			enum: ["cod", "online"],
			default: "cod",
		},

		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

// ✅ Fix for overwrite error
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
