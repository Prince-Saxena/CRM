import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173", // ❗ exact frontend URL
		credentials: true, // ❗ must
	}),
);
app.use(express.json());
app.use(cookieParser());

import userRoutes from "./routes/User/user.route.js";
import leadRoutes from "./routes/Lead/Lead.route.js";
import adminRoutes from "./routes/User/admin.route.js";
import dealerRoutes from "./routes/User/dealer.route.js";
app.use("/api/crm/user", userRoutes);
app.use("/api/crm/lead", leadRoutes);
app.use("/api/crm/admin", adminRoutes);
app.use("/api/crm/dealer", dealerRoutes);

export default app;
