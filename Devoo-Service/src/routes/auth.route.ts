import express from "express";
import { signup, login, logout, updateProfile, cheackAuth } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check-auth", protectRoute, cheackAuth);

export default router;
