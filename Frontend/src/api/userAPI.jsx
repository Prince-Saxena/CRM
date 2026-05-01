import axios from "axios"

const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

export const regUser = async (data) => API.post("/user/register",data)
export const loginUser = async (data) => API.post("/user/login",data)
export const logoutUser = async (data) => API.post("/user/logout")
export const getProfile = async () => API.get("/user/profile")
export const updateProfile = async (data) => API.get("/user/update-profile",data)
export const changePassword = async (data) => API.get("/user/change-password",data)