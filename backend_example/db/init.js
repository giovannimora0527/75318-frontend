const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const DB_FILE = path.join(__dirname, '..', 'data.sqlite');

if (fs.existsSync(DB_FILE)) {
  try { fs.unlinkSync(DB_FILE); console.log('Removed existing DB'); } catch(e) { console.warn('Could not remove DB, it may be in use:', e.message); }
}

const db = new sqlite3.Database(DB_FILE);

// Use serialize and callbacks to ensure ordering
db.serialize(() => {
  // create tables
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0,
    is_locked_until INTEGER DEFAULT NULL
  )`);

  db.run(`CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    username TEXT,
    ip TEXT,
    event TEXT NOT NULL,
    description TEXT
  )`);

  db.run(`CREATE TABLE password_recovery_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE especializaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigoEspecializacion TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT
  )`);

  db.run(`CREATE TABLE citas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fechahora INTEGER NOT NULL,
    estado TEXT NOT NULL,
    paciente_nombre TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE recetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cita_id INTEGER NOT NULL,
    medicamento_id INTEGER NOT NULL,
    dosis TEXT NOT NULL,
    indicaciones TEXT,
    fecha_creacion INTEGER NOT NULL,
    FOREIGN KEY(cita_id) REFERENCES citas(id),
    FOREIGN KEY(medicamento_id) REFERENCES medicamentos(id)
  )`);

  // Seed users sequentially
  const users = [
    { username: 'jdoe', email: 'jdoe@example.com', password: 'Password123' },
    { username: 'asmith', email: 'asmith@example.com', password: 'Secret123' }
  ];

  const seedUsers = async () => {
    for (const u of users) {
      // eslint-disable-next-line no-await-in-loop
      const hash = await bcrypt.hash(u.password, 10);
      // wrap run in Promise
      await new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, [u.username, u.email, hash], function(err) {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  };

  const seedOthers = () => {
    return new Promise((resolve, reject) => {
      const meds = [ 'Paracetamol', 'Amoxicilina', 'Ibuprofeno' ];
      const now = Math.floor(Date.now() / 1000);
      db.serialize(() => {
        const insertMed = db.prepare(`INSERT INTO medicamentos (nombre) VALUES (?)`);
        meds.forEach(m => insertMed.run(m));
        insertMed.finalize();

        const insertCita = db.prepare(`INSERT INTO citas (fechahora, estado, paciente_nombre) VALUES (?, ?, ?)`);
        insertCita.run(now + 3600, 'PENDIENTE', 'Juan Perez');
        insertCita.run(now + 7200, 'PENDIENTE', 'Ana Gomez');
        insertCita.finalize();

        // seed a receta
        db.run(`INSERT INTO recetas (cita_id, medicamento_id, dosis, indicaciones, fecha_creacion) VALUES (?,?,?,?,?)`, [1, 1, '1 cada 8h', 'Tomar con agua', now], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  };

  (async () => {
    try {
      await seedUsers();
      await seedOthers();
      console.log('Database initialized and seeded.');
    } catch (e) {
      console.error('Error seeding DB:', e);
    } finally {
      db.close();
    }
  })();
});
