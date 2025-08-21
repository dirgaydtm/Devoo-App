import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getUser } from "../controllers/message.controller";

const router = express.Router();

router.get("/users", protectRoute, getUser);

export default router;