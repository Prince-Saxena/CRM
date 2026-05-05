import express from "express";
import {
	createTask,
	updateTask,
	cancelTask,
	getMyTasks,
	getAllTasks,
	getDealersAndLeads,
} from "../../controller/Task/task.controller.js";

import { isAuthorized, isAdmin } from "../../middleware/Auth.middleware.js";

const router = express.Router();

router.post("/create", isAuthorized, isAdmin, createTask);

router.get("/mytasks", isAuthorized, getMyTasks);

router.get("/alltasks", isAuthorized, isAdmin, getAllTasks);

router.put("/updtask/:id", isAuthorized, updateTask);

router.patch("/:id/cancel", isAuthorized, isAdmin, cancelTask);
router.get("/task-meta", isAuthorized, isAdmin, getDealersAndLeads);

export default router;
