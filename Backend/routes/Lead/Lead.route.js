
import express from "express"
import registerLead from "../../controller/Lead/regLead.controller.js";
const router = express.Router();

router.get("/register", registerLead);

export default router
