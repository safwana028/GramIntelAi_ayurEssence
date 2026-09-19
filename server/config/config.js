import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "ayuressence-sdmca-smvitm-secret-key-2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  DATA_FILE_PATH: path.join(__dirname, "..", "data", "db.json"),
  APP_NAME: "AyurEssence API",
  VERSION: "1.0.0",
  INSTITUTIONS: [
    "SDM College of Ayurveda & Hospital, Udupi",
    "Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Bantakal"
  ]
};
