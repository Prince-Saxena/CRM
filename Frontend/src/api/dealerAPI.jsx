import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});


export const getDealerDashboardData = async () => API.get("/dealer/data");
export const getLead = async () => API.get("/dealer/leads");
export const getOrder = async () => API.get("/dealer/orders");
