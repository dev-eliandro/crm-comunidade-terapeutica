import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'auth.db');

sqlite3.verbose();

const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, (err) => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(row);
  });
});

export async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      reset_token TEXT
    );
  `);
  await seedDefaultUser();
}

export function createHash(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export async function seedDefaultUser() {
  const existing = await get('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!existing) {
    await run(
      'INSERT INTO users (id, username, email, password_hash, reset_token) VALUES (?, ?, ?, ?, ?)',
      ['user-1', 'admin', 'admin@crm.local', createHash('123456'), null],
    );
  }
}

export async function findUserByIdentifier(identifier) {
  return get('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);
}

export async function findUserByEmail(email) {
  return get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function findUserByResetToken(token) {
  return get('SELECT * FROM users WHERE reset_token = ?', [token]);
}

export async function createUser({ id, username, email, passwordHash }) {
  await run(
    'INSERT INTO users (id, username, email, password_hash, reset_token) VALUES (?, ?, ?, ?, ?)',
    [id, username, email, passwordHash, null],
  );
  return get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function updateUserPassword(id, passwordHash) {
  await run('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

export async function setResetToken(email, token) {
  await run('UPDATE users SET reset_token = ? WHERE email = ?', [token, email]);
}

export async function clearResetToken(id) {
  await run('UPDATE users SET reset_token = ? WHERE id = ?', [null, id]);
}

export async function getUserById(id) {
  return get('SELECT * FROM users WHERE id = ?', [id]);
}
