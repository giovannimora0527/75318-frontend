const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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

    // Generate a secure random token
    const token = crypto.randomBytes(16).toString('hex');
    const expires = epochNow() + 60 * 60; // 1 hour
    db.run(`INSERT INTO password_recovery_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`, [user.id, token, expires]);

    // Simulate email
    console.log(`Password recovery token for ${username}: ${token} (expires ${new Date(expires * 1000).toISOString()})`);
    auditLog({ username, ip, event: 'PASSWORD_RECOVERY_SENT', description: 'Recovery token created and email sent (simulated)' });
    return res.json({ mensaje: 'Si la cuenta existe, se ha enviado un correo con instrucciones.' });
  });
});

// Endpoint to reset password using token
app.post('/auth/password-reset', async (req, res) => {
  const { token, newPassword } = req.body || {};
  const ip = req.ip || req.connection.remoteAddress;
  if (!token || !newPassword) return res.status(400).json({ mensaje: 'Bad request' });

  db.get(`SELECT * FROM password_recovery_tokens WHERE token = ?`, [token], async (err, row) => {
    if (err) return res.status(500).json({ mensaje: 'Internal error' });
    if (!row) {
      auditLog({ username: null, ip, event: 'PASSWORD_RESET_INVALID_TOKEN', description: 'Token not found' });
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }
    if (row.used) {
      auditLog({ username: null, ip, event: 'PASSWORD_RESET_REUSED_TOKEN', description: 'Token already used' });
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }
    if (row.expires_at < epochNow()) {
      auditLog({ username: null, ip, event: 'PASSWORD_RESET_EXPIRED_TOKEN', description: 'Token expired' });
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }

    // All good: update user's password
    const newHash = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password_hash = ?, failed_login_attempts = 0, is_locked_until = NULL WHERE id = ?`, [newHash, row.user_id], function(uerr) {
      if (uerr) return res.status(500).json({ mensaje: 'Error updating password' });
      // mark token as used
      db.run(`UPDATE password_recovery_tokens SET used = 1 WHERE id = ?`, [row.id]);
      auditLog({ username: null, ip, event: 'PASSWORD_RESET', description: `Password reset for user_id ${row.user_id}` });
      return res.json({ mensaje: 'Contraseña actualizada' });
    });
  });
});

// --- Recetas endpoints under /clinica/v1/receta ---
app.get('/clinica/v1/receta/listar', (req, res) => {
  db.all(`SELECT r.id, r.cita_id as citaId, r.medicamento_id as medicamentoId, r.dosis, r.indicaciones, r.fecha_creacion as fechaCreacionRegistro, m.nombre as nombreMedicamento FROM recetas r JOIN medicamentos m ON r.medicamento_id = m.id ORDER BY r.fecha_creacion DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching recetas' });
    const items = rows.map(r => ({ id: r.id, citaId: r.citaId, medicamentoId: r.medicamentoId, dosis: r.dosis, indicaciones: r.indicaciones, fechaCreacionRegistro: new Date(r.fechaCreacionRegistro * 1000).toISOString(), nombreMedicamento: r.nombreMedicamento }));
    res.json(items);
  });
});

app.post('/clinica/v1/receta/guardar', (req, res) => {
  const { citaId, medicamentoId, dosis, indicaciones } = req.body || {};
  const ts = Math.floor(Date.now() / 1000);
  if (!citaId || !medicamentoId || !dosis) return res.status(400).json({ mensaje: 'Invalid data' });
  db.run(`INSERT INTO recetas (cita_id, medicamento_id, dosis, indicaciones, fecha_creacion) VALUES (?,?,?,?,?)`, [citaId, medicamentoId, dosis, indicaciones || null, ts], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error saving receta' });
    auditLog({ username: null, ip: req.ip, event: 'RECETA_CREATED', description: `Receta ${this.lastID} creada` });
    res.json({ mensaje: 'Receta guardada', status: 200 });
  });
});

app.post('/clinica/v1/receta/actualizar', (req, res) => {
  const { id, citaId, medicamentoId, dosis, indicaciones } = req.body || {};
  if (!id || !citaId || !medicamentoId || !dosis) return res.status(400).json({ mensaje: 'Invalid data' });
  db.run(`UPDATE recetas SET medicamento_id = ?, dosis = ?, indicaciones = ? WHERE id = ?`, [medicamentoId, dosis, indicaciones || null, id], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error updating receta' });
    auditLog({ username: null, ip: req.ip, event: 'RECETA_UPDATED', description: `Receta ${id} actualizada` });
    res.json({ mensaje: 'Receta actualizada', status: 200 });
  });
});

// Medicamentos list
app.get('/clinica/v1/medicamento/listar', (req, res) => {
  db.all(`SELECT id, nombre FROM medicamentos ORDER BY nombre`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching medicamentos' });
    res.json(rows.map(r => ({ id: r.id, nombre: r.nombre }))); 
  });
});

// Medicamento: guardar, actualizar, eliminar
app.post('/clinica/v1/medicamento/guardar', (req, res) => {
  const { nombre } = req.body || {};
  if (!nombre) return res.status(400).json({ mensaje: 'Invalid data' });
  db.run(`INSERT INTO medicamentos (nombre) VALUES (?)`, [nombre], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error saving medicamento' });
    auditLog({ username: null, ip: req.ip, event: 'MEDICAMENTO_CREATED', description: `Medicamento ${this.lastID} creado` });
    res.json({ mensaje: 'Medicamento guardado', status: 200 });
  });
});

app.post('/clinica/v1/medicamento/actualizar', (req, res) => {
  const { id, nombre } = req.body || {};
  if (!id || !nombre) return res.status(400).json({ mensaje: 'Invalid data' });
  db.run(`UPDATE medicamentos SET nombre = ? WHERE id = ?`, [nombre, id], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error updating medicamento' });
    auditLog({ username: null, ip: req.ip, event: 'MEDICAMENTO_UPDATED', description: `Medicamento ${id} actualizado` });
    res.json({ mensaje: 'Medicamento actualizado', status: 200 });
  });
});

app.delete('/clinica/v1/medicamento/eliminar/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ mensaje: 'Invalid id' });
  db.run(`DELETE FROM medicamentos WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error deleting medicamento' });
    auditLog({ username: null, ip: req.ip, event: 'MEDICAMENTO_DELETED', description: `Medicamento ${id} eliminado` });
    res.json({ mensaje: 'Medicamento eliminado', status: 200 });
  });
});

// Citas: listar recientes (only PENDIENTE)
app.get('/clinica/v1/cita/listar-recientes', (req, res) => {
  const now = Math.floor(Date.now() / 1000);
  db.all(`SELECT id, fechahora as fechaHora, estado, paciente_nombre as nombreCompletoPaciente FROM citas WHERE estado != 'CUMPLIDA' AND estado != 'CANCELADA' ORDER BY fechahora ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching citas' });
    const items = rows.map(r => ({ id: r.id, fechaHora: new Date(r.fechaHora * 1000).toISOString(), estado: r.estado, nombreCompletoPaciente: r.nombreCompletoPaciente }));
    res.json(items);
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

// Especializaciones endpoints
app.get('/clinica/v1/especializacion/listar', (req, res) => {
  db.all(`SELECT id, codigoEspecializacion, nombre, descripcion FROM especializaciones ORDER BY nombre`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching especializaciones' });
    res.json(rows.map(r => ({ id: r.id, codigoEspecializacion: r.codigoEspecializacion, nombre: r.nombre, descripcion: r.descripcion })));
  });
});

app.post('/clinica/v1/especializacion/guardar', (req, res) => {
  const { codigoEspecializacion, nombre, descripcion } = req.body || {};
  if (!codigoEspecializacion || !nombre) return res.status(400).json({ mensaje: 'Invalid data' });
  db.run(`INSERT INTO especializaciones (codigoEspecializacion, nombre, descripcion) VALUES (?,?,?)`, [codigoEspecializacion, nombre, descripcion || null], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error saving especializacion' });
    auditLog({ username: null, ip: req.ip, event: 'ESPECIALIZACION_CREATED', description: `Especializacion ${this.lastID} creada` });
    res.json({ mensaje: 'Especializacion guardada', status: 200 });
  });
});

app.put('/clinica/v1/especializacion/actualizar/:id', (req, res) => {
  const id = Number(req.params.id);
  const { codigoEspecializacion, nombre, descripcion } = req.body || {};
  if (!id || !codigoEspecializacion || !nombre) return res.status(400).json({ mensaje: 'Invalid data' });
  db.run(`UPDATE especializaciones SET codigoEspecializacion = ?, nombre = ?, descripcion = ? WHERE id = ?`, [codigoEspecializacion, nombre, descripcion || null, id], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error updating especializacion' });
    auditLog({ username: null, ip: req.ip, event: 'ESPECIALIZACION_UPDATED', description: `Especializacion ${id} actualizada` });
    res.json({ mensaje: 'Especializacion actualizada', status: 200 });
  });
});

app.get('/clinica/v1/especializacion/buscar/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  db.get(`SELECT id, codigoEspecializacion, nombre, descripcion FROM especializaciones WHERE codigoEspecializacion = ?`, [codigo], (err, row) => {
    if (err) return res.status(500).json({ mensaje: 'Error searching especializacion' });
    if (!row) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Backend example listening on http://localhost:${PORT}`);
});
