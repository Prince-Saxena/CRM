import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "dealer", "customer"],
			default: "dealer",
		},
		status: {
			type: String,
			enum: ["unverified", "verified", "customer"],
			default: "unverified",
		},
		area:{
			type: String,
			enum: ["north", "south", "east", "west"],
			required: true,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
