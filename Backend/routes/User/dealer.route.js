import express from 'express';
import {isAuthorized} from '../../middleware/Auth.middleware.js';
import getDealerDashboard from '../../controller/Dealer/dashboardData.controller.js';
import getLead from '../../controller/Dealer/getLead.controller.js';
import getDealerOrders from '../../controller/Dealer/getOrders.controller.js';

const router = express.Router();

router.get("/data",isAuthorized, getDealerDashboard);
router.get("/leads",isAuthorized, getLead);
router.get("/orders", isAuthorized, getDealerOrders);

export default router;