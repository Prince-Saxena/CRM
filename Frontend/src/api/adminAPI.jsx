import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:3000/api/crm",
	withCredentials: true,
});

export const getAdminDashboardData = async () => API.get("/admin/data");
export const getLeadsWithDealers = async () => API.get("/admin/leads-data");
export const assignLeadToDealer = async (leadId, dealerId) => API.patch("/admin/assign/lead", { leadId, dealerId });
export const getAllDealers = async () => API.get("/admin/dealers");
export const getAllOrder = async () => API.get("/admin/orders");
export const verifyDealer = async (dealerId) => API.patch(`/admin/verify-dealer/${dealerId}`);
export const createLead = async (leadData) => API.post("/admin/new-lead", leadData);