const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const DB_FILE = path.join(__dirname, '..', 'data.sqlite');

if (fs.existsSync(DB_FILE)) {
  fs.unlinkSync(DB_FILE);
  console.log('Removed existing DB');
}

const db = new sqlite3.Database(DB_FILE);

db.serialize(async () => {
  // users table
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0,
    is_locked_until INTEGER DEFAULT NULL
  )`);

  // audit logs
  db.run(`CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    username TEXT,
    ip TEXT,
    event TEXT NOT NULL,
    description TEXT
  )`);

  // password recovery tokens
  db.run(`CREATE TABLE password_recovery_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0
  )`);

  // Seed users
  const users = [
    { username: 'jdoe', email: 'jdoe@example.com', password: 'Password123' },
    { username: 'asmith', email: 'asmith@example.com', password: 'Secret123' }
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, [u.username, u.email, hash]);
  }

  console.log('Database initialized and seeded.');
  db.close();
});
