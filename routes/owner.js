import express from "express";
import db from "../db.js";

const router = express.Router();

// POST /api/owner/login — verify PIN
router.post("/login", (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ error: "PIN required" });
  }

  db.get(`SELECT * FROM owners WHERE pin = ?`, [pin], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) {
      return res.status(401).json({ success: false, message: "Invalid PIN" });
    }

    res.json({ success: true, message: "Owner authenticated" });
  });
});

export default router;
