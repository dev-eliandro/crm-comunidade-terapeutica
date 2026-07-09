import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDb,
  createHash,
  findUserByIdentifier,
  findUserByEmail,
  findUserByResetToken,
  createUser,
  updateUserPassword,
  setResetToken,
  clearResetToken,
  getUserById,
} from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const createToken = (user) => Buffer.from(JSON.stringify({ id: user.id, username: user.username, email: user.email, exp: Date.now() + 1000 * 60 * 60 })).toString('base64');
const sanitizeUser = (user) => ({ id: user.id, username: user.username, email: user.email });

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  const user = await findUserByIdentifier(identifier);

  if (!user || user.password_hash !== createHash(password)) {
    return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
  }

  return res.json({
    token: createToken(user),
    user: sanitizeUser(user),
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const existing = await findUserByIdentifier(username) || await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'Usuário ou e-mail já cadastrados.' });
  }

  const newUser = await createUser({
    id: `user-${Date.now()}`,
    username,
    email,
    passwordHash: createHash(password),
  });

  return res.status(201).json({
    token: createToken(newUser),
    user: sanitizeUser(newUser),
  });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: 'E-mail não encontrado.' });
  }

  const resetToken = crypto.randomBytes(8).toString('hex');
  await setResetToken(email, resetToken);

  return res.json({
    message: 'Instruções de recuperação enviadas para o e-mail informado.',
    resetToken,
  });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await findUserByResetToken(token);

  if (!user) {
    return res.status(400).json({ message: 'Token inválido ou expirado.' });
  }

  await updateUserPassword(user.id, createHash(newPassword));
  await clearResetToken(user.id);

  return res.json({ message: 'Senha redefinida com sucesso.' });
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Não autenticado.' });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (!decoded || decoded.exp < Date.now()) {
      throw new Error('token inválido');
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(401).json({ message: 'Sessão inválida.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

await initDb();

app.listen(PORT, () => {
  console.log(`Sistema rodando em http://localhost:${PORT}`);
});
