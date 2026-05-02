import bcrypt from "bcryptjs";
import User from "../../models/User.model.js";
import generateToken from "../../utils/genToken.js";

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		// console.log("Email:",email,"Password", password,);

		if (email && password) {
			const user = await User.findOne({ email });
			// console.log(user);

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: "Invalid credentials" });
			}
			const token = generateToken(user._id, user.role, user.name);
			res.cookie("token", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
			return res.status(200).json({
				token,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			});
		} else {
			return res.status(400).json({ message: "Email or Password not found!" });
		}
	} catch (error) {
		return res.status(500).json({ meggage: error });
	}
};

export default loginUser;
