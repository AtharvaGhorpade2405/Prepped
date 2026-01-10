import express from "express";
import { createInterview, getMyInterviews } from "../controllers/interviewController.js";
import requireAuth  from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/interviews", requireAuth, createInterview);

router.get("/interviews/mine",requireAuth, getMyInterviews);

export default router;
