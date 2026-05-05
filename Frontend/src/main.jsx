import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import Signup from "./pages/SignupPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leads from "./pages/Lead.jsx";
import Dealers from "./pages/Dealer.jsx";
import Order from "./pages/Order.jsx";
import Task from "./pages/Task.jsx";
import { UserContextProvider } from "./context/userContextProvider.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import App from "./App.jsx";
import "./index.css";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{/* Public Route */}
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />

			{/* Layout + Protected Pages */}
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<App />
					</ProtectedRoute>
				}
			>
				<Route index element={<Dashboard />} />
				<Route path="leads" element={<Leads />} />
				<Route path="task" element={<Task />} />
				<Route path="dealers" element={<Dealers />} />
				<Route path="orders" element={<Order />} />
				<Route path="profile" element={<Profile />} />
			</Route>
		</>,
	),
);
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserContextProvider>
			<RouterProvider router={router} />
		</UserContextProvider>
	</StrictMode>,
);
