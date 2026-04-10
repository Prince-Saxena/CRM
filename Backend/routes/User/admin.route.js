import express from "express";
import getAdminDashboard from "../../controller/Admin/dashboardData.controller.js";

import { isAdmin, isAuthorized } from "../../middleware/Auth.middleware.js";
import verifyDealer from "../../controller/Admin/verifyDealer.controller.js";
import assignLead from "../../controller/Admin/assignLead.controller.js";
import { getLeadsWithDealers } from "../../controller/Admin/getLeadwithDealers.controller.js";
import getAllDealers from "../../controller/Admin/getAllDealers.controller.js";
import getDealerOrders from "../../controller/Dealer/getOrders.controller.js";
import createLead from "../../controller/Admin/createLead.controller.js";

const router = express.Router();


router.get("/data",isAuthorized, isAdmin, getAdminDashboard);
router.get("/leads-data", isAuthorized, isAdmin, getLeadsWithDealers);
router.post("/new-lead", isAuthorized, isAdmin, createLead);
router.get("/dealers", isAuthorized, isAdmin, getAllDealers);
router.get("/orders", isAuthorized, isAdmin, getDealerOrders);
router.patch("/assign/lead",isAuthorized, isAdmin, assignLead);
router.patch("/verify-dealer/:id", isAuthorized, isAdmin, verifyDealer); 

export default router;
