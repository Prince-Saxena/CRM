import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn.jsx";
import { useUser } from "../context/userContextProvider.jsx";

export default function Sidebar() {
	const { user } = useUser();

	return (
		<div className="w-60 h-screen bg-gray-900 text-gray-200 flex flex-col sticky top-0 p-5">
			<h1 className="text-xl font-semibold mb-8">CRM</h1>

			<nav className="space-y-3 text-sm">
				{/* Dashboard */}
				<Link to="/" className="flex items-center gap-2 hover:text-white">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
					</svg>
					Dashboard
				</Link>

				{/* Leads */}
				<Link to="/leads" className="flex items-center gap-2 hover:text-white">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
					</svg>
					Leads
				</Link>

				{/* Dealers (Admin only) */}
				{user.role === "admin" && (
					<Link to="/dealers" className="flex items-center gap-2 hover:text-white">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<rect x="2" y="7" width="20" height="14" rx="2" />
							<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
						</svg>
						Dealers
					</Link>
				)}

				{/* Orders */}
				<Link to="/orders" className="flex items-center gap-2 hover:text-white">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
						<line x1="3" y1="6" x2="21" y2="6" />
					</svg>
					Orders
				</Link>

				{/* Account */}
				<Link to="/profile" className="flex items-center gap-2 hover:text-white">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<circle cx="12" cy="7" r="4" />
						<path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
					</svg>
					Account
				</Link>

				{/* Logout */}
				<div className="pt-3">
					<LogoutBtn />
				</div>
			</nav>
		</div>
	);
}
