import { Outlet } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Sidebar from "./components/Sidebar.jsx";

export default function App() {
	return (
		<div className="h-screen flex overflow-hidden">
			{/* Sidebar */}
			<div className="w-60 bg-gray-900 text-gray-200">
				<Sidebar />
			</div>

			{/* Main Section */}
			<div className="flex-1 flex flex-col bg-gray-50">
				{/* Top Navbar */}
				{/* <Nav /> */}

				{/* Dynamic Content */}
				<div className="flex-1 overflow-y-auto p-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
