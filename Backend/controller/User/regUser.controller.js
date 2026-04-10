import bcrypt from "bcryptjs";
import User from "../../models/User.model.js";
const regUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}
		if (role == "admin") {
			const adminList = process.env.ADMIN_LIST.split(",");
			if (!adminList.includes(email)) {
				return res.status(403).json({ message: "Admin Regsitration not allowed!" });
			}
		}
		if (name && email && password && role) {
			if (existingUser) {
				return res.status(400).json({ message: "User already exists" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			// console.log(hashedPassword);

			const newUser = await User.create({
				name,
				email,
				role,
				password: hashedPassword,
				status: role === "admin" ? "verified" : "unverified",
			});
			return res.status(201).json({
				message: "User created successfully",
				user: {
					id: newUser._id,
					name: newUser.name,
					email: newUser.email,
					role: newUser.role,
				},
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export default regUser;
