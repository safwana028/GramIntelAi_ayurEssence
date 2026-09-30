import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "tridoshalab-sdmca-smvitm-secret-key-2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  DATA_FILE_PATH: path.join(__dirname, "..", "data", "db.json"),
  APP_NAME: "TridoshaLab API",
  VERSION: "3.0.0",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [
        "https://tridoshalab.com",
        "https://www.tridoshalab.com",
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173"
      ],
  INSTITUTIONS: [
    "SDM College of Ayurveda & Hospital, Udupi",
    "Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Bantakal"
  ],
  DATABASE_URL: process.env.DATABASE_URL || "",
  DB_POOL_MIN: Number(process.env.DB_POOL_MIN) || 2,
  DB_POOL_MAX: Number(process.env.DB_POOL_MAX) || 20,
  DB_CONNECTION_TIMEOUT_MS: Number(process.env.DB_CONNECTION_TIMEOUT_MS) || 5000,
  DB_IDLE_TIMEOUT_MS: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,
  ADAPTIVE_DOSHA_THRESHOLD: Number(process.env.ADAPTIVE_DOSHA_THRESHOLD) || 80,
  CACHE_ENABLED: process.env.CACHE_ENABLED !== "false"
};
