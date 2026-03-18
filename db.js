import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file
const dbPath = path.join(__dirname, "database.sqlite");

// Connect to SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("SQLite connection error:", err);
  else console.log("SQLite connected");
});

// Create tables
db.serialize(() => {
  // Owners table
  db.run(`
    CREATE TABLE IF NOT EXISTS owners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pin TEXT NOT NULL
    )
  `);

  // Insert owner PIN if not exists
  db.get(`SELECT * FROM owners`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO owners (pin) VALUES (?)`, ["0419"]);
      console.log("Owner PIN 0419 added");
    }
  });

  // Menu items
  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      available INTEGER DEFAULT 1
    )
  `);

  // Insert sample menu if empty
  db.get(`SELECT COUNT(*) AS count FROM menu_items`, (err, row) => {
    if (row.count === 0) {
      const items = [
        ["Kraken Burger", 12.99],
        ["Tentacle Tacos", 10.49],
        ["Deep Sea Fries", 4.99],
        ["Ocean Lemonade", 3.49]
      ];
      items.forEach(([name, price]) => {
        db.run(`INSERT INTO menu_items (name, price) VALUES (?, ?)`, [name, price]);
      });
      console.log("Sample menu items added");
    }
  });

  // Orders
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'received',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Truck location
  db.run(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default location if empty
  db.get(`SELECT COUNT(*) AS count FROM locations`, (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO locations (location) VALUES ('Not set')`);
      console.log("Default location added");
    }
  });
});

export default db;
