import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET /api/orders/:id — get order status
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM orders WHERE id = ?`, [id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Order not found" });
    res.json(row);
  });
});

// POST /api/orders — create a new order
router.post("/", (req, res) => {
  const { items, total } = req.body;

  if (!items || !total) {
    return res.status(400).json({ error: "Items and total required" });
  }

  const id = uuidv4();
  const itemsString = JSON.stringify(items);

  db.run(
    `INSERT INTO orders (id, items, total) VALUES (?, ?, ?)`,
    [id, itemsString, total],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({
        id,
        status: "received",
        items,
        total
      });
    }
  );
});

// PATCH /api/orders/:id/status — update order status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["received", "cooking", "ready", "picked_up"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.run(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      if (this.changes === 0) return res.status(404).json({ error: "Order not found" });

      res.json({ id, status });
    }
  );
});

export default router;
