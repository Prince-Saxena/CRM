import express from "express";
import getDealerDashboard from "../../controller/Dealer/dashboardData.controller.js";
import { isAuthorized } from "../../middleware/Auth.middleware.js";
import confirmLeadToOrder from "../../controller/Dealer/convertLead.controller.js";

const router = express.Router()


router.get("/dashboard", isAuthorized, getDealerDashboard)
router.post("/convert-lead/:id", isAuthorized, confirmLeadToOrder)

export default router