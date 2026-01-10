import express from "express";
import interviewRoutes from "./routes/interviewRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    sameSite: "lax",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", interviewRoutes);
app.use("/api/auth", authRoutes);

export default app;
