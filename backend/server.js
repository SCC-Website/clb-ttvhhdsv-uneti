import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { MongoClient } from 'mongodb';
import { createHash, randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const databaseName = process.env.MONGODB_DB || 'scc_diary';
const cookieName = 'scc_session';
const sessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;
const corsOrigins = new Set((process.env.CORS_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean).map(value => {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) return '';
    return parsed.origin;
  } catch {
    return '';
  }
}).filter(Boolean));
const allowedCompanions = new Set([
  'tran-the-phu', 'vu-thi-thu', 'duong-thi-kim-anh', 'nguyen-thu-hien',
  'dong-ngoc-han', 'to-thi-ha-vy', 'nguyen-phuong-thao', 'vu-quang-viet'
]);

let mongoClient = null;
let collections = null;

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function rankForScore(score) {
  if (score < 150) return 'Hãy cố gắng lần sau nha!';
  if (score < 300) return 'Sinh viên lễ phép';
  if (score < 450) return 'Sinh viên tuyệt vời';
  if (score < 600) return 'Sinh viên 5S';
  return 'Đại sứ Văn hoá học đường';
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function apiUnavailable(_req, res, next) {
  if (!collections) return res.status(503).json({ error: 'API chưa kết nối MongoDB Atlas. Kiểm tra MONGODB_URI trong cấu hình máy chủ.' });
  next();
}

function getSessionToken(req) {
  const cookies = (req.headers.cookie || '').split(';');
  const entry = cookies.map(item => item.trim()).find(item => item.startsWith(`${cookieName}=`));
  return entry ? entry.slice(cookieName.length + 1) : '';
}

function setSessionCookie(res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SECURE === 'true' ? 'none' : 'lax',
    path: '/',
    maxAge: sessionLifetimeMs
  });
}

function clearSessionCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SECURE === 'true' ? 'none' : 'lax',
    path: '/'
  });
}

const requireSession = asyncRoute(async (req, res, next) => {
  const token = getSessionToken(req);
  if (!token || token.length > 100) return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại bằng ID.' });
  const session = await collections.sessions.findOne({ _id: sha256(token), expiresAt: { $gt: new Date() } });
  if (!session) return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại bằng ID.' });
  const user = await collections.users.findOne({ _id: session.userId });
  if (!user) return res.status(401).json({ error: 'Không tìm thấy tài khoản. Hãy đăng nhập lại bằng ID.' });
  req.account = user;
  req.sessionHash = sha256(token);
  next();
});

function publicAccount(user) {
  return { name: user.name, studentId: user.studentId || '', createdAt: user.createdAt };
}

async function issueSession(user, res) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + sessionLifetimeMs);
  await collections.sessions.insertOne({ _id: sha256(token), userId: user._id, createdAt: new Date(), expiresAt });
  setSessionCookie(res, token);
}

function normalizeName(value) {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFC').trim();
  if (!name || Array.from(name).length > 24 || /[\u0000-\u001f\u007f]/u.test(name)) return null;
  return name;
}

function normalizeStudentId(value) {
  if (typeof value !== 'string') return null;
  const studentId = value.normalize('NFC').trim();
  if (!studentId) return '';
  if (!/^\d{11}$/u.test(studentId)) return null;
  return studentId;
}

function parsePageValue(value, fallback, max) {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
}

function corsMiddleware(req, res, next) {
  const origin = req.get('Origin');
  if (!origin) return next();
  const requestOrigin = `${req.protocol}://${req.get('host')}`;
  if (origin !== requestOrigin && !corsOrigins.has(origin)) {
    return res.status(403).json({ error: 'Origin này chưa được cho phép truy cập API.' });
  }
  res.vary('Origin');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use('/api', corsMiddleware);
app.use(express.json({ limit: '16kb', strict: true }));
app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 12, standardHeaders: true, legacyHeaders: false, message: { error: 'Thử đăng nhập quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.' } });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Đã tạo quá nhiều tài khoản từ kết nối này. Vui lòng thử lại sau.' } });

const api = express.Router();
api.get('/health', (_req, res) => {
  const ready = Boolean(collections);
  res.status(ready ? 200 : 503).json({ ready });
});

api.post('/auth/register', registerLimiter, apiUnavailable, asyncRoute(async (req, res) => {
  const name = normalizeName(req.body?.name);
  if (!name) return res.status(400).json({ error: 'Tên cần có từ 1 đến 24 ký tự và không chứa ký tự điều khiển.' });
  const loginId = `SCC-${randomBytes(32).toString('base64url')}`;
  const user = {
    name,
    loginIdHash: sha256(loginId),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await collections.users.insertOne(user);
  user._id = result.insertedId;
  await issueSession(user, res);
  res.status(201).json({ account: publicAccount(user), loginId });
}));

api.post('/auth/login', loginLimiter, apiUnavailable, asyncRoute(async (req, res) => {
  const loginId = typeof req.body?.id === 'string' ? req.body.id.trim() : '';
  if (!/^SCC-[A-Za-z0-9_-]{43}$/u.test(loginId)) return res.status(401).json({ error: 'ID không hợp lệ hoặc không tìm thấy tài khoản.' });
  const user = await collections.users.findOne({ loginIdHash: sha256(loginId) });
  if (!user) return res.status(401).json({ error: 'ID không hợp lệ hoặc không tìm thấy tài khoản.' });
  await issueSession(user, res);
  res.json({ account: publicAccount(user) });
}));

api.get('/auth/me', apiUnavailable, requireSession, asyncRoute(async (req, res) => {
  res.json({ account: publicAccount(req.account) });
}));

api.post('/auth/logout', apiUnavailable, asyncRoute(async (req, res) => {
  const token = getSessionToken(req);
  if (token && token.length <= 100) await collections.sessions.deleteOne({ _id: sha256(token) });
  clearSessionCookie(res);
  res.json({ ok: true });
}));

api.patch('/me/name', apiUnavailable, requireSession, asyncRoute(async (req, res) => {
  const name = normalizeName(req.body?.name);
  if (!name) return res.status(400).json({ error: 'Tên cần có từ 1 đến 24 ký tự và không chứa ký tự điều khiển.' });
  const updatedAt = new Date();
  await collections.users.updateOne({ _id: req.account._id }, { $set: { name, updatedAt } });
  req.account.name = name;
  res.json({ account: publicAccount(req.account) });
}));

api.patch('/me/student-id', apiUnavailable, requireSession, asyncRoute(async (req, res) => {
  const studentId = normalizeStudentId(req.body?.studentId);
  if (studentId === null) return res.status(400).json({ error: 'Mã sinh viên phải gồm đúng 11 chữ số.' });
  const updatedAt = new Date();
  await collections.users.updateOne({ _id: req.account._id }, { $set: { studentId, updatedAt } });
  req.account.studentId = studentId;
  res.json({ account: publicAccount(req.account) });
}));

api.get('/me/history', apiUnavailable, requireSession, asyncRoute(async (req, res) => {
  const limit = parsePageValue(req.query.limit, 8, 20);
  const offset = parsePageValue(req.query.offset, 0, 10000);
  const total = await collections.plays.countDocuments({ userId: req.account._id });
  const rows = await collections.plays.find({ userId: req.account._id }, { projection: { score: 1, completedDays: 1, companionId: 1, createdAt: 1 } })
    .sort({ createdAt: -1, _id: -1 }).skip(offset).limit(limit).toArray();
  res.json({ entries: rows.map(row => ({ id: row._id.toString(), score: row.score, rank: rankForScore(row.score), completedDays: row.completedDays, companionId: row.companionId, createdAt: row.createdAt })), total, offset, limit });
}));

api.post('/plays', apiUnavailable, requireSession, asyncRoute(async (req, res) => {
  const score = req.body?.score;
  const completedDays = req.body?.completedDays;
  const companionId = req.body?.companionId;
  if (!Number.isSafeInteger(score) || score < 0 || score > 1000000) return res.status(400).json({ error: 'Điểm lượt chơi không hợp lệ.' });
  if (!Number.isInteger(completedDays) || completedDays < 0 || completedDays > 7) return res.status(400).json({ error: 'Số ngày hoàn thành không hợp lệ.' });
  if (typeof companionId !== 'string' || !allowedCompanions.has(companionId)) return res.status(400).json({ error: 'Người đồng hành không hợp lệ.' });
  const play = { userId: req.account._id, score, completedDays, companionId, createdAt: new Date() };
  const result = await collections.plays.insertOne(play);
  res.status(201).json({ id: result.insertedId.toString(), score, rank: rankForScore(score), createdAt: play.createdAt });
}));

api.get('/leaderboard', apiUnavailable, asyncRoute(async (req, res) => {
  const limit = Math.max(1, parsePageValue(req.query.limit, 20, 100));
  const offset = parsePageValue(req.query.offset, 0, 100000);
  const eligibleUsers = await collections.users.find({ studentId: { $regex: '^[0-9]{11}$' } }, { projection: { _id: 1 } }).toArray();
  const eligibleUserIds = eligibleUsers.map(user => user._id);
  const total = eligibleUserIds.length ? await collections.plays.countDocuments({ userId: { $in: eligibleUserIds } }) : 0;
  const rows = await collections.plays.aggregate([
    { $match: { userId: { $in: eligibleUserIds } } },
    { $sort: { score: -1, createdAt: -1, _id: 1 } },
    { $skip: offset },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'owner' } },
    { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
    { $project: { _id: { $toString: '$_id' }, name: { $ifNull: ['$owner.name', 'Thành viên SCC'] }, score: 1, completedDays: 1, companionId: 1, createdAt: 1 } }
  ]).toArray();
  res.json({ entries: rows.map(row => ({ ...row, rank: rankForScore(row.score) })), total, offset, limit });
}));

app.use('/api', api);
if (process.env.NODE_ENV !== 'production') {
  app.use(['/backend', '/node_modules', '/.git'], (_req, res) => res.sendStatus(404));
  app.get('/diary-game.html', (_req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
    next();
  });
  app.use(express.static(projectRoot, { dotfiles: 'deny', index: 'index.html', fallthrough: true }));
}
app.use((_req, res) => res.status(404).send('Không tìm thấy trang.'));
app.use((err, _req, res, _next) => {
  if (res.headersSent) return;
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu gửi lên không đúng định dạng JSON.' });
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Dữ liệu gửi lên quá lớn.' });
  console.error(`Request failed (${err?.name || 'Error'}); details omitted.`);
  res.status(500).json({ error: 'Có lỗi máy chủ. Vui lòng thử lại sau.' });
});

async function connectMongo() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.warn('MongoDB URI is not configured; API routes will return 503. No credentials were read or logged.');
    return;
  }
  mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 10 });
  await mongoClient.connect();
  const database = mongoClient.db(databaseName);
  collections = {
    users: database.collection('users'),
    sessions: database.collection('sessions'),
    plays: database.collection('plays')
  };
  await Promise.all([
    collections.users.createIndex({ loginIdHash: 1 }, { unique: true, name: 'unique_login_id_hash' }),
    collections.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'expire_sessions' }),
    collections.sessions.createIndex({ userId: 1 }, { name: 'sessions_by_user' }),
    collections.plays.createIndex({ score: -1, createdAt: -1 }, { name: 'leaderboard_score_date' }),
    collections.plays.createIndex({ userId: 1, createdAt: -1 }, { name: 'history_by_user_date' })
  ]);
  console.log('MongoDB Atlas connection is ready.');
}

try {
  await connectMongo();
} catch (error) {
  collections = null;
  console.error(`MongoDB connection unavailable (${error?.name || 'Error'}); credential details omitted.`);
}

app.listen(port, host, () => console.log(`SCC API listening on http://${host}:${port}`));
