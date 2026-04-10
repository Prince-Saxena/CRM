import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContextProvider.jsx";
import DashboardSkeleton from "./Skeleton.jsx";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useUser();

	if (loading) {
		return <DashboardSkeleton />;
	}
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
