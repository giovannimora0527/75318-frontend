const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');

const DB_FILE = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const MAX_FAILED = Number(process.env.MAX_FAILED_ATTEMPTS || 3);
const LOCK_MINUTES = Number(process.env.LOCK_DURATION_MINUTES || 5);

function epochNow() { return Math.floor(Date.now() / 1000); }

function auditLog({ username, ip, event, description }) {
  const ts = epochNow();
  db.run(`INSERT INTO audit_logs (timestamp, username, ip, event, description) VALUES (?, ?, ?, ?, ?)`, [ts, username, ip || null, event, description || null]);
}

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  const ip = req.ip || req.connection.remoteAddress;
  if (!username || !password) return res.status(400).json({ message: 'Invalid credentials' });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Internal error' });
    if (!user) {
      auditLog({ username, ip, event: 'LOGIN_FAILED', description: 'User not found' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check lock
    if (user.is_locked_until && epochNow() < user.is_locked_until) {
      auditLog({ username, ip, event: 'LOGIN_BLOCKED', description: 'User is temporarily locked' });
      return res.status(423).json({ message: 'Account temporarily locked' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      // increment failed attempts
      const attempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;
      if (attempts >= MAX_FAILED) {
        lockedUntil = epochNow() + LOCK_MINUTES * 60;
      }
      db.run(`UPDATE users SET failed_login_attempts = ?, is_locked_until = ? WHERE id = ?`, [attempts, lockedUntil, user.id]);
      auditLog({ username, ip, event: 'LOGIN_FAILED', description: `Invalid password (attempt ${attempts})` });
      if (lockedUntil) {
        auditLog({ username, ip, event: 'USER_LOCKED', description: `Locked until ${new Date(lockedUntil * 1000).toISOString()}` });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // success
    db.run(`UPDATE users SET failed_login_attempts = 0, is_locked_until = NULL WHERE id = ?`, [user.id]);
    auditLog({ username, ip, event: 'LOGIN_SUCCESS', description: 'User logged in' });
    return res.json({ message: 'Login successful' });
  });
});

app.post('/auth/password-recovery', (req, res) => {
  const { username } = req.body || {};
  const ip = req.ip || req.connection.remoteAddress;
  if (!username) return res.status(400).json({ mensaje: 'Bad request' });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).json({ mensaje: 'Internal error' });
    if (!user) {
      // Log invalid attempt but return generic message
      auditLog({ username, ip, event: 'PASSWORD_RECOVERY_INVALID_USER', description: 'Username not found' });
      return res.json({ mensaje: 'Si la cuenta existe, se ha enviado un correo con instrucciones.' });
    }

    // Generate a simple token (in real world use secure random token)
    const token = Math.random().toString(36).slice(2, 10);
    const expires = epochNow() + 60 * 60; // 1 hour
    db.run(`INSERT INTO password_recovery_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`, [user.id, token, expires]);

    // Simulate email
    console.log(`Password recovery token for ${username}: ${token} (expires ${new Date(expires * 1000).toISOString()})`);
    auditLog({ username, ip, event: 'PASSWORD_RECOVERY_SENT', description: 'Recovery token created and email sent (simulated)' });
    return res.json({ mensaje: 'Si la cuenta existe, se ha enviado un correo con instrucciones.' });
  });
});

// GET /audit/logs?page=0&size=50&username=&event=&from=&to=
app.get('/audit/logs', (req, res) => {
  const { page = 0, size = 50, username, event, from, to } = req.query;
  const offset = Number(page) * Number(size);
  const filters = [];
  const params = [];
  if (username) {
    filters.push('username = ?');
    params.push(username);
  }
  if (event) {
    filters.push('event = ?');
    params.push(event);
  }
  if (from) {
    filters.push('timestamp >= ?');
    params.push(Math.floor(new Date(from).getTime() / 1000));
  }
  if (to) {
    filters.push('timestamp <= ?');
    params.push(Math.floor(new Date(to).getTime() / 1000));
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  db.get(`SELECT COUNT(*) as cnt FROM audit_logs ${where}`, params, (err, row) => {
    if (err) return res.status(500).json({ message: 'Error counting logs' });
    const total = row ? row.cnt : 0;
    db.all(`SELECT * FROM audit_logs ${where} ORDER BY timestamp DESC LIMIT ? OFFSET ?`, params.concat([Number(size), offset]), (err2, rows) => {
      if (err2) return res.status(500).json({ message: 'Error fetching logs' });
      // Convert timestamp to ISO for client
      const items = rows.map(r => ({ ...r, timestamp: new Date(r.timestamp * 1000).toISOString() }));
      res.json({ items, total });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend example listening on http://localhost:${PORT}`);
});
