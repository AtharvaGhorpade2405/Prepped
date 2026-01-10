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
    credentials: true,
  })
);

app.use(
  session({
    name: "prepped.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,      // required in production
      sameSite: "none",  // required for cross-site cookies
    },
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", interviewRoutes);
app.use("/api/auth", authRoutes);

export default app;
