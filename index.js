import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import paymentsRouter from "./routes/payments.js";
import menuRouter from "./routes/menu.js";
import ordersRouter from "./routes/orders.js";
import ownerRouter from "./routes/owner.js";
import locationRouter from "./routes/location.js";

import "./db.js"; // initializes SQLite tables

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the Square payment page
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/pay", paymentsRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/location", locationRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Foodtruck backend is running");
});

// Render uses PORT env var, fallback to 4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
