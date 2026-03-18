import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /api/menu — get all menu items
router.get("/", (req, res) => {
  db.all(`SELECT * FROM menu_items`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// POST /api/menu — add a new menu item
router.post("/", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price required" });
  }

  db.run(
    `INSERT INTO menu_items (name, price) VALUES (?, ?)`,
    [name, price],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ id: this.lastID, name, price, available: 1 });
    }
  );
});

// PATCH /api/menu/:id/availability — toggle availability
router.patch("/:id/availability", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT available FROM menu_items WHERE id = ?`, [id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Item not found" });

    const newStatus = row.available === 1 ? 0 : 1;

    db.run(
      `UPDATE menu_items SET available = ? WHERE id = ?`,
      [newStatus, id],
      (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ id, available: newStatus });
      }
    );
  });
});

// PATCH /api/menu/:id — update name or price
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  db.run(
    `UPDATE menu_items SET name = COALESCE(?, name), price = COALESCE(?, price) WHERE id = ?`,
    [name, price, id],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ updated: this.changes });
    }
  );
});

export default router;
