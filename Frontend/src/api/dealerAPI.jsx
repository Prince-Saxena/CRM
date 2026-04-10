import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:3000/api/crm",
	withCredentials: true,
});


export const getDealerDashboardData = async () => API.get("/dealer/data");
export const getLead = async () => API.get("/dealer/leads");
export const getOrder = async () => API.get("/dealer/orders");
