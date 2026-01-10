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

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(
  session({
    name: "prepped.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // 1. Allow cross-site usage
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      // 2. Cookie only works over HTTPS
      secure: process.env.NODE_ENV === "production",

      // 3. Duration (e.g., 24 hours)
      maxAge: 24 * 60 * 60 * 1000,

      // 4. Client-side JS cannot read this (Security best practice)
      httpOnly: true,
    },
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", interviewRoutes);
app.use("/api/auth", authRoutes);

export default app;
