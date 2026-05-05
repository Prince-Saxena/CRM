import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://crm-livid-seven-71.vercel.app"];


app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());

import userRoutes from "./routes/User/user.route.js";
import leadRoutes from "./routes/Lead/Lead.route.js";
import adminRoutes from "./routes/User/admin.route.js";
import dealerRoutes from "./routes/User/dealer.route.js";
import taskRoutes from "./routes/Task/Task.route.js";

app.use("/api/crm/task", taskRoutes);
app.use("/api/crm/user", userRoutes);
app.use("/api/crm/lead", leadRoutes);
app.use("/api/crm/admin", adminRoutes);
app.use("/api/crm/dealer", dealerRoutes);

export default app;
