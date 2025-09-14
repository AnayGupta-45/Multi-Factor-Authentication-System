import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js";

if (!process.env.SESSION_SECRET) {
  console.error("FATAL ERROR: SESSION_SECRET is not defined. Shutting down.");
  process.exit(1);
}

dbConnect();

const app = express();

app.set('trust proxy', 1); 

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
