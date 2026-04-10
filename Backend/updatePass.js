import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const resetPasswords = async () => {
	try {
		const newPassword = "123456"; // 👉 your new common password
		const hashed = await bcrypt.hash(newPassword, 10);

		const result = await User.updateMany({}, { $set: { password: hashed } });

		console.log("✅ Password reset done");
		console.log("New Password for ALL users:", newPassword);
		console.log("Modified:", result.modifiedCount);

		process.exit();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

resetPasswords();
