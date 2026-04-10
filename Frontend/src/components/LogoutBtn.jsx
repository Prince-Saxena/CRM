import axios from "axios";
import { useUser } from "../context/userContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/userAPI.jsx";

const LogoutButton = () => {
	const { setUser } = useUser();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const response = confirm("Are you sure you want to logout?");
			if (!response) return;
			await logoutUser();

			// ✅ clear frontend state
			setUser(null);
			localStorage.removeItem("user");
			localStorage.removeItem("token");

			// ✅ redirect
			navigate("/login");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
			Logout
		</button>
	);
};

export default LogoutButton;
