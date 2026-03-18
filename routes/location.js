import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /api/location/current — get current truck location
router.get("/current", (req, res) => {
  db.get(
    `SELECT location, updated_at FROM locations ORDER BY id DESC LIMIT 1`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(row);
    }
  );
});

// POST /api/location/update — update today's location
router.post("/update", (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: "Location required" });
  }

  db.run(
    `INSERT INTO locations (location) VALUES (?)`,
    [location],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({
        success: true,
        location,
        updated_at: new Date().toISOString()
      });
    }
  );
});

export default router;
