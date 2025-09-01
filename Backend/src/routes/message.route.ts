import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getUser, getMessage, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/users", protectRoute, getUser);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id", protectRoute, sendMessage);

export default router;