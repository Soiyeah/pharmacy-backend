import sqlite3 from "sqlite3";

export const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  // Dummy User data
  db.run(
    `INSERT INTO users (name, username, password, role) VALUES ('Owner', 'owner', 'owner123', 'owner')`
  );
  db.run(
    `INSERT INTO users (name, username, password, role) VALUES ('Manager', 'manager', 'manager123', 'manager')`
  );
  db.run(
    `INSERT INTO users (name, username, password, role) VALUES ('Cashier', 'cashier', 'cashier123', 'cashier')`
  );

  db.run(`CREATE TABLE medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    quantity INTEGER,
    deleted INTEGER DEFAULT 0
  )`);

  // Dummy medication data
  db.run(
    `INSERT INTO medications (name, description, quantity) VALUES ('Panadol', 'painkiller', 100)`
  );
  db.run(
    `INSERT INTO medications (name, description, quantity) VALUES ('Augmentin', 'Antibiotic', 200)`
  );

  db.run(`CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    deleted INTEGER DEFAULT 0
  )`);

  // Dummy customer data

  db.run(`INSERT INTO customers (name) VALUES ('Customer 1')`);
  db.run(`INSERT INTO customers (name) VALUES ('Customer 2')`);
});
