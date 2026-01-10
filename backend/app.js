import express from "express";
import interviewRoutes from "./routes/interviewRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();

// 1. Basic Middleware
app.use(express.json());
app.set("trust proxy", 1); // Good to keep for Render/Proxies

// 2. CORS (Simplified)
// Since we aren't sending credentials/cookies, the config is simpler.
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    // credentials: true, <--- You can remove this line now
  })
);

// 3. Initialize Passport
// We ONLY need initialize. We DO NOT need session().
configurePassport();
app.use(passport.initialize());

// 4. Routes
app.use("/api", interviewRoutes);
app.use("/api/auth", authRoutes);

export default app;