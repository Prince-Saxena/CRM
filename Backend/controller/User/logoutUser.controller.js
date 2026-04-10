const logoutUser = (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
		secure: false, // true in production
	});

	res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};
export default logoutUser;