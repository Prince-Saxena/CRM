import express from "express";
import loginUser from "../../controller/User/loginUser.controller.js";
import regUser from "../../controller/User/regUser.controller.js";
import logoutUser from "../../controller/User/logoutUser.controller.js";
import { isAuthorized } from "../../middleware/Auth.middleware.js";
import { getProfile,updateProfile,changePassword } from "../../controller/User/profile.controller.js";

const router = express.Router();

router.post("/register", regUser);
router.post("/login", loginUser);
router.post("/logout",isAuthorized, logoutUser);
router.get("/profile",isAuthorized, getProfile);
router.get("/update-profile",isAuthorized, updateProfile);
router.get("/change-password",isAuthorized, changePassword);


export default router;
