import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},

		phone: {
			type: String,
			required: true,
		},

		product: {
			type: String,
			required: true,
		},

		quantity: {
			type: Number,
			required: true,
		},

		paymentMethod: {
			type: String,
			enum: ["cod", "online"],
			default: "cod",
		},

		area: {
			type: String,
			trim: true,
		},

		message: {
			type: String,
			trim: true,
		},

		status: {
			type: String,
			enum: ["pending","assigned", "converted", "lost"],
			default: "pending",
		},

		assignedDealer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // admin who created lead
		},
	},
	{ timestamps: true },
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
