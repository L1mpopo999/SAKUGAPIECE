const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== DATA & UPLOADS — use volume if available =====
const VOLUME_PATH = '/app/data';
const useVolume = fs.existsSync(VOLUME_PATH);

const dataDir = useVolume ? VOLUME_PATH : __dirname;
const uploadsDir = path.join(dataDir, 'uploads');
const DATA_FILE = path.join(dataDir, 'clips.json');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Atomic JSON write: serialize, write to *.tmp, then rename. Rename is atomic
// on any sane filesystem, so partial writes can never leave a corrupt file —
// the worst case is the new file simply isn't there yet.
function writeJsonAtomic(filePath, data) {
  const tmp = filePath + '.tmp';
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(tmp, json, 'utf-8');
  fs.renameSync(tmp, filePath);
}

function loadClips() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
  catch { return []; }
}

function saveClips(clips) {
  writeJsonAtomic(DATA_FILE, clips);
}

console.log(`Storage: ${useVolume ? 'Volume (/app/data)' : 'Local (non-persistent)'}`);

let fileCounter = 0;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    fileCounter++;
    const unique = Date.now() + '-' + fileCounter + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

// Allow both video and image files
const uploadFiles = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const videoTypes = /video\/(mp4|webm|quicktime|x-msvideo|x-matroska)/;
    const imageTypes = /image\/(jpeg|jpg|png|gif|webp|bmp)/;
    if (videoTypes.test(file.mimetype) || imageTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены видео (MP4, WebM, MOV) и изображения (JPG, PNG, GIF, WebP)'));
    }
  }
});

// Multiple fields: 1 video + up to 20 images
const uploadHandler = uploadFiles.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 20 }
]);

// ===== ANIMATORS & FILTERS DATA =====
const ANIMATORS_FILE = path.join(dataDir, 'animators.json');
const FILTERS_FILE = path.join(dataDir, 'filters.json');

const DEFAULT_ANIMATORS = [
  "Midori Matsuda","Keiichi Ichikawa","Tatsuya Nagamine","Akihiro Ota",
  "Vincent Chansard","Tu Yong-Ce","Naotoshi Shida","Shinya Ohira",
  "Henry Thurlow","Megumi Ishitani","Takashi Kojima","Shu Sugita",
  "Yen BM","Jakisuaki","Michael Sung","Shoutarou Ban",
  "Shūichi Itō","Ryūhiro Nagaki","Masayuki Takagi","Yoshiichi Tomita",
  "Masahiro Kitasaki","Kazue Sakai","Eisaku Inoue","Makoto Muroi",
  "Hisashi Sameshima","Dai Harigi","Yasuko Chiba","Yuka Takemori",
  "Toshio Deguchi","He Ziwei","Ippei Masui","Asako Ota",
  "Narumi Takahashi","Kenji Yokoyama","Bahi JD","Masami Mori",
  "Kimitaka Itō","Takumi Yamamoto"
];

const DEFAULT_FILTERS = [
  { id: "fighting", label: "Бои", type: "tag" },
  { id: "effects", label: "Эффекты", type: "tag" },
  { id: "character_acting", label: "Эктинг", type: "tag" },
  { id: "transformation", label: "Трансформация", type: "tag" },
  { id: "Wano", label: "Wano", type: "arc" },
  { id: "Egghead", label: "Egghead", type: "arc" },
  { id: "Elbaf", label: "Elbaf", type: "arc" },
  { id: "Dressrosa", label: "Dressrosa", type: "arc" },
  { id: "Marineford", label: "Marineford", type: "arc" }
];

function loadAnimators() {
  if (!fs.existsSync(ANIMATORS_FILE)) { saveAnimators(DEFAULT_ANIMATORS); return DEFAULT_ANIMATORS; }
  try { return JSON.parse(fs.readFileSync(ANIMATORS_FILE, 'utf-8')); }
  catch { return DEFAULT_ANIMATORS; }
}
function saveAnimators(list) { writeJsonAtomic(ANIMATORS_FILE, list); }

// Detect "look-alike" duplicates: e.g. "Vincent Chansard" vs "Vincent Сhansard"
// (the latter has a Cyrillic С). We normalize to lowercase Latin, removing
// punctuation/whitespace, then compare. A match means the new name is suspiciously
// close to an existing one and we want to warn the admin.
const LATIN_LOOKALIKES = {
  // Cyrillic → Latin (visually identical letters)
  'а':'a','в':'b','е':'e','к':'k','м':'m','н':'h','о':'o','р':'p','с':'c',
  'т':'t','у':'y','х':'x','ё':'e',
  'А':'a','В':'b','Е':'e','К':'k','М':'m','Н':'h','О':'o','Р':'p','С':'c',
  'Т':'t','У':'y','Х':'x','Ё':'e'
};
function normalizeName(name) {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .split('')
    .map(ch => LATIN_LOOKALIKES[ch] || ch)
    .join('')
    .replace(/[\s._-]+/g, '');
}
// Returns the existing animator name that visually matches the input, or null.
// Exact match (case-insensitive) is also returned, so the caller can decide.
function findLookalikeAnimator(name, list) {
  if (!name) return null;
  const norm = normalizeName(name);
  if (!norm) return null;
  for (const existing of list) {
    if (normalizeName(existing) === norm && existing.toLowerCase() !== name.toLowerCase()) {
      return existing;
    }
  }
  return null;
}

function loadFilters() {
  if (!fs.existsSync(FILTERS_FILE)) { saveFilters(DEFAULT_FILTERS); return DEFAULT_FILTERS; }
  try { return JSON.parse(fs.readFileSync(FILTERS_FILE, 'utf-8')); }
  catch { return DEFAULT_FILTERS; }
}
function saveFilters(list) { writeJsonAtomic(FILTERS_FILE, list); }

// ===== EPISODES DATA =====
const EPISODES_FILE = path.join(dataDir, 'episodes.json');
const DEFAULT_EPISODES = { hidden: [], renamed: {} };

function loadEpisodes() {
  if (!fs.existsSync(EPISODES_FILE)) { saveEpisodes(DEFAULT_EPISODES); return DEFAULT_EPISODES; }
  try { return JSON.parse(fs.readFileSync(EPISODES_FILE, 'utf-8')); }
  catch { return DEFAULT_EPISODES; }
}
function saveEpisodes(data) { writeJsonAtomic(EPISODES_FILE, data); }

// ===== HIDDEN ANIMATORS =====
const HIDDEN_ANIMATORS_FILE = path.join(dataDir, 'hidden_animators.json');

function loadHiddenAnimators() {
  if (!fs.existsSync(HIDDEN_ANIMATORS_FILE)) { saveHiddenAnimators([]); return []; }
  try { return JSON.parse(fs.readFileSync(HIDDEN_ANIMATORS_FILE, 'utf-8')); }
  catch { return []; }
}
function saveHiddenAnimators(list) { writeJsonAtomic(HIDDEN_ANIMATORS_FILE, list); }

// ===== ANIMATOR BANNERS =====
// Map of { animatorName: '/uploads/<file>' }. Stored separately from the main
// animators list (which is a plain string array) so we don't have to migrate.
const ANIMATOR_BANNERS_FILE = path.join(dataDir, 'animator_banners.json');
function loadAnimatorBanners() {
  if (!fs.existsSync(ANIMATOR_BANNERS_FILE)) { saveAnimatorBanners({}); return {}; }
  try { return JSON.parse(fs.readFileSync(ANIMATOR_BANNERS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveAnimatorBanners(data) { writeJsonAtomic(ANIMATOR_BANNERS_FILE, data); }
// Case-insensitive lookup
function getAnimatorBanner(name) {
  if (!name) return null;
  const banners = loadAnimatorBanners();
  const key = Object.keys(banners).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? banners[key] : null;
}

// ===== EPISODE BANNERS =====
// Map of { episodeNumber: '/uploads/<file>' }. Episodes are referenced by their
// number (string). Same pattern as animator banners.
const EPISODE_BANNERS_FILE = path.join(dataDir, 'episode_banners.json');
function loadEpisodeBanners() {
  if (!fs.existsSync(EPISODE_BANNERS_FILE)) { saveEpisodeBanners({}); return {}; }
  try { return JSON.parse(fs.readFileSync(EPISODE_BANNERS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveEpisodeBanners(data) { writeJsonAtomic(EPISODE_BANNERS_FILE, data); }
function getEpisodeBanner(num) {
  if (!num) return null;
  const banners = loadEpisodeBanners();
  return banners[String(num)] || null;
}

// ===== DIRECTORS =====
const DIRECTORS_FILE = path.join(dataDir, 'directors.json');
const EPISODE_DIRECTORS_FILE = path.join(dataDir, 'episode_directors.json');

function loadDirectors() {
  if (!fs.existsSync(DIRECTORS_FILE)) { saveDirectors([]); return []; }
  try {
    const raw = JSON.parse(fs.readFileSync(DIRECTORS_FILE, 'utf-8'));
    // Migration: split entries that look like "A, B" into separate names. Dedupe.
    const seen = new Set();
    const out = [];
    let migrated = false;
    for (const entry of raw) {
      const parts = String(entry).split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 1) migrated = true;
      for (const p of parts) {
        const k = p.toLowerCase();
        if (!seen.has(k)) { seen.add(k); out.push(p); }
      }
    }
    if (migrated) {
      out.sort((a, b) => a.localeCompare(b));
      try { writeJsonAtomic(DIRECTORS_FILE, out); } catch {}
    }
    return out;
  } catch { return []; }
}
function saveDirectors(list) { writeJsonAtomic(DIRECTORS_FILE, list); }

// Normalize a director value to an array of trimmed names.
// Accepts: a single string (possibly comma-separated, legacy data), an array, null/undefined.
function normalizeDirectors(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
  return String(value).split(',').map(s => s.trim()).filter(Boolean);
}

function loadEpisodeDirectors() {
  if (!fs.existsSync(EPISODE_DIRECTORS_FILE)) { saveEpisodeDirectors({}); return {}; }
  try {
    const raw = JSON.parse(fs.readFileSync(EPISODE_DIRECTORS_FILE, 'utf-8'));
    // Migrate legacy strings → arrays. Also dedupe and trim.
    const out = {};
    let migrated = false;
    for (const ep of Object.keys(raw)) {
      const arr = normalizeDirectors(raw[ep]);
      if (!arr.length) continue;
      out[ep] = arr;
      if (!Array.isArray(raw[ep]) || arr.length !== raw[ep].length) migrated = true;
    }
    // Persist migration so we don't redo it on every read
    if (migrated) {
      try { writeJsonAtomic(EPISODE_DIRECTORS_FILE, out); } catch {}
    }
    return out;
  } catch { return {}; }
}
function saveEpisodeDirectors(map) { writeJsonAtomic(EPISODE_DIRECTORS_FILE, map); }


// ===== COMMENTS =====
const COMMENTS_FILE = path.join(dataDir, 'comments.json');
const NICKNAMES_FILE = path.join(dataDir, 'nicknames.json');

function loadComments() {
  if (!fs.existsSync(COMMENTS_FILE)) { saveComments({}); return {}; }
  try { return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveComments(data) { writeJsonAtomic(COMMENTS_FILE, data); }

function loadNicknames() {
  if (!fs.existsSync(NICKNAMES_FILE)) { saveNicknames({}); return {}; }
  try { return JSON.parse(fs.readFileSync(NICKNAMES_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveNicknames(data) { writeJsonAtomic(NICKNAMES_FILE, data); }

// ===== MIDDLEWARE =====

// gzip compression for all text responses (HTML, JS, CSS, JSON).
// Saves ~70% bandwidth on the initial page load and on /api/clips.
// Videos and images aren't recompressed (they're already compressed).
const compression = require('compression');
app.use(compression({
  // Don't waste CPU on responses smaller than 1KB.
  threshold: 1024,
  // filter: skip already-compressed content (videos/images served from /uploads).
  // Express's static middleware already sets the right Content-Type, so the
  // default filter handles this — but we can be explicit too.
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Security headers via helmet — closes clickjacking and various XSS vectors
const helmet = require('helmet');
app.use(helmet({
  // Content Security Policy: keep relaxed defaults so the site keeps working with
  // inline event handlers and Google Fonts. We can tighten this later.
  contentSecurityPolicy: false,
  // Allow same-origin embedding (we don't use iframes ourselves but this is a sane default)
  crossOriginEmbedderPolicy: false,
  // Allow images/uploads to be referenced from the same origin without restriction
  crossOriginResourcePolicy: { policy: 'same-origin' }
}));

// Trust proxy headers — needed because Timeweb sits in front of our Node process.
// Without this, req.ip would always be 127.0.0.1 and rate limits would treat all
// traffic as coming from one host.
app.set('trust proxy', 1);

// Rate limiting (express-rate-limit)
const rateLimit = require('express-rate-limit');

// General API limiter: 200 requests/minute per IP. Comfortable for normal use,
// painful for scrapers and DDoS-lite tools.
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много запросов. Подождите минуту.' }
});
app.use('/api/', generalLimiter);

// Stricter limiter for view counter: prevents view inflation
const viewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 view-pings per minute per IP — way more than any human needs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком часто.' }
});
// Note: applied per-route below, not globally, so it kicks in only on the specific endpoint.

// Stricter limiter for comments: prevents flooding (server-side spam check is also in place)
const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15, // 15 comment writes per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много комментариев. Подождите.' }
});

app.use(express.json());

// SEO / OpenGraph: when a /clip/:id URL is loaded directly (or fetched by a
// social-media crawler like Telegram, Twitter, Discord), inject the clip's
// title, description and image into the HTML <head>. This is what makes link
// previews show a nice card with cover art instead of a bare URL.
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
let cachedIndexHtml = null;
function getIndexHtml() {
  // Cache the file in memory but re-read if the file mtime changed (so dev edits
  // don't require a server restart).
  try {
    const st = fs.statSync(indexHtmlPath);
    if (!cachedIndexHtml || cachedIndexHtml.mtime !== st.mtimeMs) {
      cachedIndexHtml = { html: fs.readFileSync(indexHtmlPath, 'utf-8'), mtime: st.mtimeMs };
    }
  } catch { return null; }
  return cachedIndexHtml.html;
}

const SITE_BASE_URL = process.env.SITE_BASE_URL || 'https://sakugapiece.ru';

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Inject meta tags for a clip page so link unfurls work nicely
app.get(/^\/clip\/(\d+)$/, (req, res, next) => {
  const id = parseInt(req.params[0]);
  const clips = loadClips();
  const clip = clips.find(c => c.id === id);
  let html = getIndexHtml();
  if (!html) return next();

  if (clip) {
    const title = clip.title || `Клип ${id}`;
    const desc = `${clip.arc || ''} · Эпизод ${clip.episode || '?'} · ${(clip.animators || []).join(', ')}`.trim();
    const image = clip.thumbnailUrl
      ? SITE_BASE_URL + clip.thumbnailUrl
      : (clip.images && clip.images[0] ? SITE_BASE_URL + clip.images[0].url : SITE_BASE_URL + '/og-default.png');
    const url = SITE_BASE_URL + '/clip/' + id;
    const metaBlock = `
    <title>${escHtml(title)} — Sakuga Piece</title>
    <meta name="description" content="${escHtml(desc)}">
    <meta property="og:type" content="video.other">
    <meta property="og:title" content="${escHtml(title)}">
    <meta property="og:description" content="${escHtml(desc)}">
    <meta property="og:image" content="${escHtml(image)}">
    <meta property="og:url" content="${escHtml(url)}">
    <meta property="og:site_name" content="Sakuga Piece">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escHtml(title)}">
    <meta name="twitter:description" content="${escHtml(desc)}">
    <meta name="twitter:image" content="${escHtml(image)}">
    `;
    // Inject right before </head>
    html = html.replace('</head>', metaBlock + '</head>');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// XML sitemap so search engines can discover all clip pages
app.get('/sitemap.xml', (req, res) => {
  const clips = loadClips();
  const urls = [
    `<url><loc>${SITE_BASE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${SITE_BASE_URL}/#episodes</loc><changefreq>weekly</changefreq></url>`,
    `<url><loc>${SITE_BASE_URL}/#animators</loc><changefreq>weekly</changefreq></url>`,
    `<url><loc>${SITE_BASE_URL}/#about</loc><changefreq>monthly</changefreq></url>`,
    ...clips.map(c => {
      const last = c.uploadedAt ? new Date(c.uploadedAt).toISOString().slice(0, 10) : '';
      return `<url><loc>${SITE_BASE_URL}/clip/${c.id}</loc>${last ? `<lastmod>${last}</lastmod>` : ''}<changefreq>monthly</changefreq></url>`;
    })
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// Tell crawlers where to find the sitemap
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${SITE_BASE_URL}/sitemap.xml
`);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// ===== API =====
const crypto = require('crypto');

// ===== USERS & AUTH =====
const USERS_FILE = path.join(dataDir, 'users.json');
const AUDIT_LOG_FILE = path.join(dataDir, 'audit_log.json');

// Owner credentials come from environment. The OWNER user is implicit and not stored in users.json.
const OWNER_USERNAME = (process.env.OWNER_USERNAME || 'jef999').toLowerCase();
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD || 'jefp1ece2005';

// Hash a password with a per-user random salt. Format: <salt>:<hash>
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  try {
    const calc = crypto.scryptSync(password, salt, 64).toString('hex');
    // constant-time compare
    const a = Buffer.from(hash, 'hex');
    const b = Buffer.from(calc, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch { return false; }
}

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) { saveUsers([]); return []; }
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
  catch { return []; }
}
function saveUsers(list) { writeJsonAtomic(USERS_FILE, list); }

function loadAuditLog() {
  if (!fs.existsSync(AUDIT_LOG_FILE)) { saveAuditLog([]); return []; }
  try { return JSON.parse(fs.readFileSync(AUDIT_LOG_FILE, 'utf-8')); }
  catch { return []; }
}
function saveAuditLog(entries) { writeJsonAtomic(AUDIT_LOG_FILE, entries); }

function addAudit(username, action, target) {
  try {
    const log = loadAuditLog();
    log.push({
      user: username || 'unknown',
      action,
      target: target || null,
      at: new Date().toISOString()
    });
    // Keep only last 90 days
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const trimmed = log.filter(e => new Date(e.at).getTime() >= cutoff);
    saveAuditLog(trimmed);
  } catch (e) { console.error('audit log error', e); }
}

// Token store: token → { username, role, createdAt }
// Tokens are stored in-memory only. They expire after 7 days or on server restart.
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
let sessionTokens = new Map();

function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [t, info] of sessionTokens.entries()) {
    if (now - info.createdAt > TOKEN_TTL_MS) sessionTokens.delete(t);
  }
}
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // hourly cleanup

// Returns { username, role } if token is valid, null otherwise
function getSession(req) {
  const token = req.headers['x-admin-token'];
  if (!token) return null;
  const info = sessionTokens.get(token);
  if (!info) return null;
  if (Date.now() - info.createdAt > TOKEN_TTL_MS) {
    sessionTokens.delete(token);
    return null;
  }
  return { username: info.username, role: info.role };
}

// Authorization helpers
// requireAdmin: any signed-in admin (owner or admin). Returns session or null on error.
function requireAdmin(req, res) {
  const s = getSession(req);
  if (!s) { res.status(403).json({ error: 'Доступ запрещён. Войдите как админ.' }); return null; }
  return s;
}
// requireOwner: only the owner.
function requireOwner(req, res) {
  const s = getSession(req);
  if (!s) { res.status(403).json({ error: 'Доступ запрещён. Войдите как админ.' }); return null; }
  if (s.role !== 'owner') { res.status(403).json({ error: 'Только владелец сайта может это делать.' }); return null; }
  return s;
}

// Backward-compatible wrapper for existing endpoints that just need any admin.
function checkAdmin(req, res) {
  return !!requireAdmin(req, res);
}

// Login rate limit (per IP): 5 attempts per minute
const loginAttempts = new Map(); // ip -> [timestamps]
function checkLoginRateLimit(ip) {
  const now = Date.now();
  const arr = (loginAttempts.get(ip) || []).filter(t => now - t < 60000);
  loginAttempts.set(ip, arr);
  return arr.length < 5;
}
function recordLoginAttempt(ip) {
  const arr = loginAttempts.get(ip) || [];
  arr.push(Date.now());
  loginAttempts.set(ip, arr);
}

// Login endpoint — accepts username + password
app.post('/api/login', (req, res) => {
  const ip = req.ip;
  if (!checkLoginRateLimit(ip)) {
    return res.status(429).json({ error: 'Слишком много попыток. Подождите минуту.' });
  }
  recordLoginAttempt(ip);

  let { username, password } = req.body || {};
  // Backwards compat: if only password is sent (very old client), treat as owner login attempt
  if (!username && password) username = OWNER_USERNAME;
  if (!username || !password) return res.status(400).json({ error: 'Укажите логин и пароль' });

  const u = String(username).trim().toLowerCase();

  // Owner login
  if (u === OWNER_USERNAME && password === OWNER_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    sessionTokens.set(token, { username: OWNER_USERNAME, role: 'owner', canBackup: true, createdAt: Date.now() });
    addAudit(OWNER_USERNAME, 'login', null);
    return res.json({ success: true, token, username: OWNER_USERNAME, role: 'owner', canBackup: true });
  }

  // Regular admin login
  const users = loadUsers();
  const user = users.find(x => x.username.toLowerCase() === u);
  if (user && verifyPassword(password, user.passwordHash)) {
    const token = crypto.randomBytes(32).toString('hex');
    const canBackup = !!user.canBackup;
    sessionTokens.set(token, { username: user.username, role: user.role || 'admin', canBackup, createdAt: Date.now() });
    addAudit(user.username, 'login', null);
    return res.json({ success: true, token, username: user.username, role: user.role || 'admin', canBackup });
  }

  res.status(403).json({ error: 'Неверный логин или пароль' });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) {
    const info = sessionTokens.get(token);
    if (info) addAudit(info.username, 'logout', null);
    sessionTokens.delete(token);
  }
  res.json({ success: true });
});

// Verify token — returns role/username so client can adjust UI
app.get('/api/verify', (req, res) => {
  const s = getSession(req);
  if (!s) return res.json({ valid: false });
  res.json({ valid: true, username: s.username, role: s.role, canBackup: !!s.canBackup });
});

// ===== USER MANAGEMENT (owner only) =====
// List users (owner only)
app.get('/api/users', (req, res) => {
  if (!requireOwner(req, res)) return;
  const users = loadUsers().map(u => ({
    username: u.username,
    role: u.role || 'admin',
    canBackup: !!u.canBackup,
    createdAt: u.createdAt
  }));
  res.json(users);
});

// Create user (owner only)
app.post('/api/users', (req, res) => {
  const session = requireOwner(req, res);
  if (!session) return;
  const { username, password, role } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Логин и пароль обязательны' });
  const uname = String(username).trim();
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(uname)) return res.status(400).json({ error: 'Логин: 3–20 символов, латиница/цифры/_/-' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Пароль минимум 6 символов' });
  if (uname.toLowerCase() === OWNER_USERNAME) return res.status(400).json({ error: 'Этот логин зарезервирован' });
  const users = loadUsers();
  if (users.find(u => u.username.toLowerCase() === uname.toLowerCase())) {
    return res.status(400).json({ error: 'Такой логин уже существует' });
  }
  const newUser = {
    username: uname,
    passwordHash: hashPassword(String(password)),
    role: role === 'admin' ? 'admin' : 'admin', // currently only 'admin' role for non-owner
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  addAudit(session.username, 'create_user', uname);
  res.json({ success: true, username: uname });
});

// Delete user (owner only)
app.delete('/api/users/:username', (req, res) => {
  const session = requireOwner(req, res);
  if (!session) return;
  const target = String(req.params.username).toLowerCase();
  if (target === OWNER_USERNAME) return res.status(400).json({ error: 'Нельзя удалить владельца' });
  let users = loadUsers();
  const before = users.length;
  users = users.filter(u => u.username.toLowerCase() !== target);
  if (users.length === before) return res.status(404).json({ error: 'Пользователь не найден' });
  saveUsers(users);
  // Revoke all active sessions for this user
  for (const [t, info] of sessionTokens.entries()) {
    if (info.username.toLowerCase() === target) sessionTokens.delete(t);
  }
  addAudit(session.username, 'delete_user', target);
  res.json({ success: true });
});

// Reset user password (owner only)
app.put('/api/users/:username/password', (req, res) => {
  const session = requireOwner(req, res);
  if (!session) return;
  const target = String(req.params.username).toLowerCase();
  const { password } = req.body || {};
  if (!password || String(password).length < 6) return res.status(400).json({ error: 'Пароль минимум 6 символов' });
  if (target === OWNER_USERNAME) return res.status(400).json({ error: 'Пароль владельца меняется через переменные окружения' });
  const users = loadUsers();
  const user = users.find(u => u.username.toLowerCase() === target);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  user.passwordHash = hashPassword(String(password));
  saveUsers(users);
  // Revoke all active sessions for this user — they'll need to login again with new password
  for (const [t, info] of sessionTokens.entries()) {
    if (info.username.toLowerCase() === target) sessionTokens.delete(t);
  }
  addAudit(session.username, 'reset_password', target);
  res.json({ success: true });
});

// Toggle backup permission for a user (owner only)
app.put('/api/users/:username/can-backup', (req, res) => {
  const session = requireOwner(req, res);
  if (!session) return;
  const target = String(req.params.username).toLowerCase();
  const { canBackup } = req.body || {};
  if (target === OWNER_USERNAME) return res.status(400).json({ error: 'У владельца это право всегда есть' });
  const users = loadUsers();
  const user = users.find(u => u.username.toLowerCase() === target);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  user.canBackup = !!canBackup;
  saveUsers(users);
  // Update active sessions in memory so the user gets new permission immediately
  for (const info of sessionTokens.values()) {
    if (info.username.toLowerCase() === target) info.canBackup = user.canBackup;
  }
  addAudit(session.username, user.canBackup ? 'grant_backup' : 'revoke_backup', target);
  res.json({ success: true, canBackup: user.canBackup });
});

// Get audit log (owner only) — last 200 entries
app.get('/api/audit-log', (req, res) => {
  if (!requireOwner(req, res)) return;
  const log = loadAuditLog();
  res.json(log.slice(-200).reverse()); // newest first
});


// Get all clips
app.get('/api/clips', (req, res) => {
  res.json(loadClips());
});

// Returns a random clip's id. Convenience endpoint for the "🎲 Random" button.
// We return only the id so the client can navigate to /clip/:id and let the
// existing render path do the rest.
app.get('/api/clips/random', (req, res) => {
  const clips = loadClips();
  if (!clips.length) return res.status(404).json({ error: 'Нет клипов' });
  const random = clips[Math.floor(Math.random() * clips.length)];
  res.json({ id: random.id });
});

// Record a view (unique per user token)
const VIEWS_FILE = path.join(dataDir, 'views.json');
function loadViews() {
  if (!fs.existsSync(VIEWS_FILE)) { saveViews({}); return {}; }
  try { return JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveViews(data) { writeJsonAtomic(VIEWS_FILE, data); }

// Likes — stored per-clip as an array of user tokens (one like per user max).
// Same shape as views.json for consistency: { "clipId": ["tok1", "tok2", ...] }
const LIKES_FILE = path.join(dataDir, 'likes.json');
function loadLikes() {
  if (!fs.existsSync(LIKES_FILE)) { saveLikes({}); return {}; }
  try { return JSON.parse(fs.readFileSync(LIKES_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveLikes(data) { writeJsonAtomic(LIKES_FILE, data); }

// Get like counts for all clips at once
app.get('/api/likes/counts', (req, res) => {
  const likes = loadLikes();
  const out = {};
  for (const id of Object.keys(likes)) out[id] = (likes[id] || []).length;
  res.json(out);
});

// Toggle like for a clip (anonymous via userToken in body)
app.post('/api/clips/:id/like', (req, res) => {
  const { userToken } = req.body || {};
  if (!userToken) return res.status(400).json({ error: 'Нет userToken' });
  const id = parseInt(req.params.id);
  const clips = loadClips();
  if (!clips.find(c => c.id === id)) return res.status(404).json({ error: 'Клип не найден' });

  const likes = loadLikes();
  const key = String(id);
  if (!likes[key]) likes[key] = [];
  const idx = likes[key].indexOf(userToken);
  let liked;
  if (idx === -1) { likes[key].push(userToken); liked = true; }
  else { likes[key].splice(idx, 1); liked = false; }
  saveLikes(likes);
  res.json({ success: true, liked, count: likes[key].length });
});

// Get whether the current user liked a specific clip
app.get('/api/clips/:id/like-status', (req, res) => {
  const userToken = req.query.userToken;
  const id = String(parseInt(req.params.id));
  const likes = loadLikes();
  const list = likes[id] || [];
  res.json({ liked: !!userToken && list.includes(userToken), count: list.length });
});

app.post('/api/clips/:id/view', viewLimiter, (req, res) => {
  const { userToken } = req.body;
  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);
  if (!clip) return res.status(404).json({ error: 'Клип не найден' });

  const views = loadViews();
  const clipKey = String(id);
  if (!views[clipKey]) views[clipKey] = [];

  // Only count if this user hasn't viewed before
  if (userToken && !views[clipKey].includes(userToken)) {
    views[clipKey].push(userToken);
    saveViews(views);
    clip.views = views[clipKey].length;
    saveClips(clips);
  } else if (!userToken) {
    // No token — use IP as fallback. req.ip is trustworthy because of `app.set('trust proxy', 1)`.
    const ip = req.ip;
    const ipKey = 'ip_' + ip;
    if (!views[clipKey].includes(ipKey)) {
      views[clipKey].push(ipKey);
      saveViews(views);
      clip.views = views[clipKey].length;
      saveClips(clips);
    }
  }

  res.json({ success: true, views: clip.views || views[clipKey]?.length || 0 });
});

// Clip page — serve index.html for client-side routing
app.get('/clip/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload a new clip (admin only)
// Download a video file from a public URL into our uploads dir, then return the
// resulting filename so the upload form can submit it like a regular file.
// This saves the admin from having to download → re-upload manually for each clip.
//
// Limits: 200 MB max (matches multer config), https/http only, content-type must
// be video/*, hard 60s timeout.
const http = require('http');
const https = require('https');
const URL = require('url').URL;

app.post('/api/clips/from-url', express.json(), async (req, res) => {
  if (!checkAdmin(req, res)) return;
  const rawUrl = String(req.body?.url || '').trim();
  if (!rawUrl) return res.status(400).json({ error: 'URL обязателен' });

  let urlObj;
  try { urlObj = new URL(rawUrl); }
  catch { return res.status(400).json({ error: 'Некорректный URL' }); }
  if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
    return res.status(400).json({ error: 'Только http/https-ссылки' });
  }

  // Build a unique target filename in uploads dir
  const ext = (path.extname(urlObj.pathname) || '.mp4').toLowerCase().slice(0, 6);
  const safeExt = /^\.[a-z0-9]+$/.test(ext) ? ext : '.mp4';
  const filename = `${Date.now()}-from-url${safeExt}`;
  const destPath = path.join(uploadsDir, filename);
  const MAX_SIZE = 200 * 1024 * 1024; // 200 MB

  // Helper: download with redirect following (max 5 redirects)
  function download(targetUrl, redirectsLeft) {
    return new Promise((resolve, reject) => {
      const lib = targetUrl.startsWith('https:') ? https : http;
      const request = lib.get(targetUrl, { timeout: 60000 }, response => {
        // Handle redirects
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          if (redirectsLeft <= 0) return reject(new Error('Слишком много перенаправлений'));
          response.resume();
          const next = new URL(response.headers.location, targetUrl).toString();
          return resolve(download(next, redirectsLeft - 1));
        }
        if (response.statusCode !== 200) {
          response.resume();
          return reject(new Error(`Сервер вернул ${response.statusCode}`));
        }
        const ct = String(response.headers['content-type'] || '').toLowerCase();
        if (!ct.startsWith('video/')) {
          response.resume();
          return reject(new Error(`Это не видео (${ct || 'без типа'})`));
        }
        const declaredSize = parseInt(response.headers['content-length']) || 0;
        if (declaredSize && declaredSize > MAX_SIZE) {
          response.resume();
          return reject(new Error(`Файл слишком большой: ${(declaredSize / 1024 / 1024).toFixed(1)} МБ (макс 200)`));
        }

        let received = 0;
        const file = fs.createWriteStream(destPath);
        response.on('data', chunk => {
          received += chunk.length;
          if (received > MAX_SIZE) {
            request.destroy();
            file.destroy();
            try { fs.unlinkSync(destPath); } catch {}
            reject(new Error('Файл превысил лимит 200 МБ'));
          }
        });
        response.pipe(file);
        file.on('finish', () => file.close(() => resolve({ filename, size: received })));
        file.on('error', err => { try { fs.unlinkSync(destPath); } catch {}; reject(err); });
      });
      request.on('timeout', () => { request.destroy(new Error('Таймаут (60 сек)')); });
      request.on('error', reject);
    });
  }

  try {
    const result = await download(rawUrl, 5);
    res.json({ success: true, filename: result.filename, size: result.size, url: '/uploads/' + result.filename });
  } catch (err) {
    try { if (fs.existsSync(destPath)) fs.unlinkSync(destPath); } catch {}
    res.status(400).json({ error: err.message || 'Не удалось скачать' });
  }
});

app.post('/api/clips', uploadHandler, (req, res) => {
  if (!checkAdmin(req, res)) {
    // Clean up uploaded files
    if (req.files) {
      Object.values(req.files).flat().forEach(f => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    return;
  }

  const videoFile = req.files?.video?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];
  const imageFiles = req.files?.images || [];

  // Pre-downloaded video filename (from /api/clips/from-url). The file already
  // sits in uploads/ — we just record its path on the clip.
  const preloadedFilename = req.body?.preloadedVideo
    ? String(req.body.preloadedVideo).replace(/[^a-zA-Z0-9._-]/g, '')
    : null;
  const preloadedExists = preloadedFilename && fs.existsSync(path.join(uploadsDir, preloadedFilename));

  if (!videoFile && !preloadedExists && imageFiles.length === 0) {
    return res.status(400).json({ error: 'Загрузите видео или хотя бы одно изображение' });
  }

  const { title, titleEn, animators, episode, arc, tags, notes, notesEn, timecodes, clipOrder } = req.body;

  if (!title || !animators || !episode) {
    // Clean up
    if (videoFile && fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
    imageFiles.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    if (preloadedExists) { try { fs.unlinkSync(path.join(uploadsDir, preloadedFilename)); } catch {} }
    return res.status(400).json({ error: 'Заполните название, аниматора и номер эпизода' });
  }

  // Effective video info: either an uploaded multipart file OR a pre-downloaded one
  const effectiveVideoName = videoFile ? videoFile.filename : (preloadedExists ? preloadedFilename : null);
  const effectiveVideoSize = videoFile ? videoFile.size : (preloadedExists ? fs.statSync(path.join(uploadsDir, preloadedFilename)).size : 0);

  const clips = loadClips();

  const newClip = {
    id: Date.now(),
    title: title.trim(),
    titleEn: titleEn ? titleEn.trim() : '',
    animators: animators.split(',').map(a => a.trim()).filter(Boolean),
    episode: episode.trim(),
    arc: arc || 'Unknown',
    tags: tags ? tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean) : [],
    notes: notes || '',
    notesEn: notesEn ? notesEn.trim() : '',
    timecodes: timecodes || '',
    clipOrder: parseInt(clipOrder) || 0,
    // Thumbnail
    thumbnailUrl: thumbnailFile ? '/uploads/' + thumbnailFile.filename : null,
    // Video (either uploaded or downloaded-from-URL)
    filename: effectiveVideoName,
    videoUrl: effectiveVideoName ? '/uploads/' + effectiveVideoName : null,
    // Images
    images: imageFiles.map(f => ({
      filename: f.filename,
      url: '/uploads/' + f.filename
    })),
    quality: effectiveVideoName ? '1080p' : null,
    type: effectiveVideoName ? 'video' : 'images',
    size: effectiveVideoName ? effectiveVideoSize : imageFiles.reduce((sum, f) => sum + f.size, 0),
    uploadedAt: new Date().toISOString()
  };

  clips.unshift(newClip);
  saveClips(clips);

  // Auto-add new animators to the list
  const animatorList = loadAnimators();
  let animatorsChanged = false;
  newClip.animators.forEach(a => {
    if (!animatorList.find(existing => existing.toLowerCase() === a.toLowerCase())) {
      animatorList.push(a);
      animatorsChanged = true;
    }
  });
  if (animatorsChanged) {
    animatorList.sort((a, b) => a.localeCompare(b));
    saveAnimators(animatorList);
  }

  res.json({ success: true, clip: newClip });
});

// Edit a clip (admin only)
app.put('/api/clips/:id', express.json(), (req, res) => {
  if (!checkAdmin(req, res)) return;

  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);

  if (!clip) return res.status(404).json({ error: 'Клип не найден' });

  const { title, titleEn, animators, episode, arc, tags, notes, notesEn, timecodes, clipOrder, directorOverride } = req.body;

  if (title !== undefined) clip.title = title.trim();
  if (titleEn !== undefined) clip.titleEn = titleEn.trim();
  if (animators !== undefined) clip.animators = animators.split(',').map(a => a.trim()).filter(Boolean);
  if (episode !== undefined) clip.episode = episode.trim();
  if (arc !== undefined) clip.arc = arc;
  if (tags !== undefined) clip.tags = tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean);
  if (notes !== undefined) clip.notes = notes;
  if (notesEn !== undefined) clip.notesEn = (notesEn || '').trim();
  if (timecodes !== undefined) clip.timecodes = timecodes;
  if (clipOrder !== undefined) clip.clipOrder = parseInt(clipOrder) || 0;
  if (directorOverride !== undefined) {
    const v = (directorOverride || '').trim();
    if (v) {
      clip.directorOverride = v;
      // Auto-add to directors list if needed
      const dlist = loadDirectors();
      if (!dlist.find(d => d.toLowerCase() === v.toLowerCase())) {
        dlist.push(v); dlist.sort((a,b)=>a.localeCompare(b)); saveDirectors(dlist);
      }
    } else {
      delete clip.directorOverride;
    }
  }

  saveClips(clips);
  res.json({ success: true, clip });
});

// Upload thumbnail for existing clip (admin only)
const thumbnailUpload = uploadFiles.single('thumbnail');
app.post('/api/clips/:id/thumbnail', thumbnailUpload, (req, res) => {
  if (!checkAdmin(req, res)) {
    if (req.file) fs.unlinkSync(req.file.path);
    return;
  }
  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);
  if (!clip) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Клип не найден' }); }
  if (!req.file) return res.status(400).json({ error: 'Файл обязателен' });

  // Remove old thumbnail if exists
  if (clip.thumbnailUrl) {
    const oldPath = path.join(uploadsDir, path.basename(clip.thumbnailUrl));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  clip.thumbnailUrl = '/uploads/' + req.file.filename;
  saveClips(clips);
  res.json({ success: true, thumbnailUrl: clip.thumbnailUrl });
});

// Upload/replace video for existing clip (admin only)
const videoUpload = uploadFiles.single('video');
app.post('/api/clips/:id/video', videoUpload, (req, res) => {
  if (!checkAdmin(req, res)) {
    if (req.file) fs.unlinkSync(req.file.path);
    return;
  }
  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);
  if (!clip) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Клип не найден' }); }
  if (!req.file) return res.status(400).json({ error: 'Файл обязателен' });

  // Remove old video if exists
  if (clip.filename) {
    const oldPath = path.join(uploadsDir, clip.filename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  clip.filename = req.file.filename;
  clip.videoUrl = '/uploads/' + req.file.filename;
  clip.type = 'video';
  clip.quality = '1080p';
  clip.size = req.file.size;
  saveClips(clips);
  res.json({ success: true, videoUrl: clip.videoUrl });
});

// Add images to existing clip (admin only)
const imagesUpload = uploadFiles.array('images', 20);
app.post('/api/clips/:id/images', imagesUpload, (req, res) => {
  if (!checkAdmin(req, res)) {
    if (req.files) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    return;
  }
  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);
  if (!clip) { if (req.files) req.files.forEach(f => fs.unlinkSync(f.path)); return res.status(404).json({ error: 'Клип не найден' }); }
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'Файлы обязательны' });

  if (!clip.images) clip.images = [];
  req.files.forEach(f => {
    clip.images.push({ filename: f.filename, url: '/uploads/' + f.filename });
  });
  saveClips(clips);
  res.json({ success: true, images: clip.images });
});

// Remove single image from clip (admin only)
app.delete('/api/clips/:id/images/:filename', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);
  if (!clip) return res.status(404).json({ error: 'Клип не найден' });

  const filename = req.params.filename;
  const img = clip.images?.find(i => i.filename === filename);
  if (img) {
    const fp = path.join(uploadsDir, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    clip.images = clip.images.filter(i => i.filename !== filename);
    saveClips(clips);
  }
  res.json({ success: true, images: clip.images || [] });
});

// Delete a clip (admin only)
app.delete('/api/clips/:id', (req, res) => {
  const session = requireAdmin(req, res);
  if (!session) return;

  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);

  if (!clip) return res.status(404).json({ error: 'Клип не найден' });

  // Remove video
  if (clip.filename) {
    const fp = path.join(uploadsDir, clip.filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  // Remove images
  if (clip.images) {
    clip.images.forEach(img => {
      const fp = path.join(uploadsDir, img.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
  }

  saveClips(clips.filter(c => c.id !== id));
  addAudit(session.username, 'delete_clip', `${id}: ${clip.title}`);
  res.json({ success: true });
});

// ===== ANIMATORS API =====
app.get('/api/animators', (req, res) => { res.json(loadAnimators()); });

app.post('/api/animators', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name, force } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Имя обязательно' });
  const list = loadAnimators();
  const trimmed = name.trim();
  if (list.find(a => a.toLowerCase() === trimmed.toLowerCase())) return res.status(400).json({ error: 'Аниматор уже существует' });

  // Look for "visually identical" lookalikes (e.g. mixed cyrillic/latin letters).
  // If found and the admin didn't pass `force: true`, return a warning instead of creating.
  const lookalike = findLookalikeAnimator(trimmed, list);
  if (lookalike && !force) {
    return res.status(409).json({
      error: 'duplicate_lookalike',
      lookalike,
      message: `Очень похоже на «${lookalike}». Если это всё-таки разные люди — повторите с force=true.`
    });
  }

  list.push(trimmed);
  list.sort((a, b) => a.localeCompare(b));
  saveAnimators(list);
  res.json({ success: true, animators: list });
});

app.delete('/api/animators', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  let list = loadAnimators();
  list = list.filter(a => a.toLowerCase() !== name.toLowerCase());
  saveAnimators(list);
  res.json({ success: true, animators: list });
});

app.put('/api/animators/rename', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { oldName, newName } = req.body;
  if (!oldName || !newName) return res.status(400).json({ error: 'Укажите старое и новое имя' });

  // Rename in animators list
  let list = loadAnimators();
  const idx = list.findIndex(a => a.toLowerCase() === oldName.toLowerCase());
  if (idx !== -1) list[idx] = newName.trim();
  saveAnimators(list);

  // Rename in all clips
  const clips = loadClips();
  let changed = 0;
  clips.forEach(clip => {
    clip.animators = clip.animators.map(a => {
      if (a.toLowerCase() === oldName.toLowerCase()) { changed++; return newName.trim(); }
      return a;
    });
  });
  if (changed) saveClips(clips);

  res.json({ success: true, renamed: changed });
});

// Hidden animators
app.get('/api/animators/hidden', (req, res) => { res.json(loadHiddenAnimators()); });

// ===== ANIMATOR BANNER (admin only) =====
// GET — return current banner URL for an animator (public)
app.get('/api/animators/:name/banner', (req, res) => {
  res.json({ url: getAnimatorBanner(req.params.name) || null });
});

// Get all banners at once (used by client to render profile pages without N requests)
app.get('/api/animator-banners', (req, res) => { res.json(loadAnimatorBanners()); });

// Upload a banner. Reuses the existing single-file uploader; the field is "banner".
// Replaces any existing banner for that animator.
app.post('/api/animators/:name/banner', uploadFiles.single('banner'), (req, res) => {
  if (!checkAdmin(req, res)) return;
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
  if (!/image\//.test(req.file.mimetype)) {
    return res.status(400).json({ error: 'Загрузите изображение (JPG/PNG/WebP)' });
  }
  const name = req.params.name;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Имя аниматора обязательно' });
  const banners = loadAnimatorBanners();

  // If there's an existing banner file, try to remove it from disk so we don't pile up orphans
  const prev = getAnimatorBanner(name);
  if (prev && prev.startsWith('/uploads/')) {
    const prevPath = path.join(uploadsDir, path.basename(prev));
    fs.unlink(prevPath, () => {}); // best-effort
  }

  // Match the canonical name from the animators list if present (preserves case)
  const list = loadAnimators();
  const canonical = list.find(a => a.toLowerCase() === name.toLowerCase()) || name.trim();
  banners[canonical] = '/uploads/' + req.file.filename;
  // Drop any other key that case-insensitively equals — keep storage clean
  Object.keys(banners).forEach(k => {
    if (k !== canonical && k.toLowerCase() === canonical.toLowerCase()) delete banners[k];
  });
  saveAnimatorBanners(banners);
  res.json({ success: true, url: banners[canonical] });
});

app.delete('/api/animators/:name/banner', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const banners = loadAnimatorBanners();
  const key = Object.keys(banners).find(k => k.toLowerCase() === req.params.name.toLowerCase());
  if (key) {
    const url = banners[key];
    if (url && url.startsWith('/uploads/')) {
      const p = path.join(uploadsDir, path.basename(url));
      fs.unlink(p, () => {});
    }
    delete banners[key];
    saveAnimatorBanners(banners);
  }
  res.json({ success: true });
});

// ===== EPISODE BANNER (admin only) =====
app.get('/api/episodes/:num/banner', (req, res) => {
  res.json({ url: getEpisodeBanner(req.params.num) || null });
});

app.get('/api/episode-banners', (req, res) => { res.json(loadEpisodeBanners()); });

app.post('/api/episodes/:num/banner', uploadFiles.single('banner'), (req, res) => {
  if (!checkAdmin(req, res)) return;
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
  if (!/image\//.test(req.file.mimetype)) {
    return res.status(400).json({ error: 'Загрузите изображение (JPG/PNG/WebP)' });
  }
  const num = String(req.params.num).trim();
  if (!num) return res.status(400).json({ error: 'Номер эпизода обязателен' });
  const banners = loadEpisodeBanners();
  const prev = banners[num];
  if (prev && prev.startsWith('/uploads/')) {
    const prevPath = path.join(uploadsDir, path.basename(prev));
    fs.unlink(prevPath, () => {});
  }
  banners[num] = '/uploads/' + req.file.filename;
  saveEpisodeBanners(banners);
  res.json({ success: true, url: banners[num] });
});

app.delete('/api/episodes/:num/banner', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const num = String(req.params.num);
  const banners = loadEpisodeBanners();
  if (banners[num]) {
    const url = banners[num];
    if (url && url.startsWith('/uploads/')) {
      const p = path.join(uploadsDir, path.basename(url));
      fs.unlink(p, () => {});
    }
    delete banners[num];
    saveEpisodeBanners(banners);
  }
  res.json({ success: true });
});

app.post('/api/animators/hide', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  const list = loadHiddenAnimators();
  if (!list.includes(name)) list.push(name);
  saveHiddenAnimators(list);
  res.json({ success: true, hidden: list });
});

app.post('/api/animators/unhide', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  let list = loadHiddenAnimators();
  list = list.filter(a => a !== name);
  saveHiddenAnimators(list);
  res.json({ success: true, hidden: list });
});

// ===== DIRECTORS API =====
// Get all directors
app.get('/api/directors', (req, res) => { res.json(loadDirectors()); });

// Get episode → director map
app.get('/api/episode-directors', (req, res) => { res.json(loadEpisodeDirectors()); });

// Add new director (admin)
app.post('/api/directors', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Имя обязательно' });
  const list = loadDirectors();
  const trimmed = name.trim();
  if (list.find(d => d.toLowerCase() === trimmed.toLowerCase())) return res.status(400).json({ error: 'Режиссёр уже существует' });
  list.push(trimmed);
  list.sort((a, b) => a.localeCompare(b));
  saveDirectors(list);
  res.json({ success: true, directors: list });
});

// Delete director (admin) — also clears assignments
app.delete('/api/directors', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  let list = loadDirectors();
  list = list.filter(d => d.toLowerCase() !== name.toLowerCase());
  saveDirectors(list);
  // Remove this director from all episode assignments (now arrays)
  const map = loadEpisodeDirectors();
  let cleared = 0;
  for (const ep of Object.keys(map)) {
    const before = map[ep] || [];
    const after = before.filter(d => d.toLowerCase() !== name.toLowerCase());
    if (after.length !== before.length) {
      cleared++;
      if (after.length === 0) delete map[ep];
      else map[ep] = after;
    }
  }
  if (cleared) saveEpisodeDirectors(map);
  // Remove from any clip overrides
  const clips = loadClips();
  let clipsChanged = 0;
  clips.forEach(c => {
    if (c.directorOverride && c.directorOverride.toLowerCase() === name.toLowerCase()) {
      delete c.directorOverride;
      clipsChanged++;
    }
  });
  if (clipsChanged) saveClips(clips);
  res.json({ success: true, directors: list, cleared, clipsChanged });
});

// Rename director (admin) — propagates everywhere
app.put('/api/directors/rename', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { oldName, newName } = req.body;
  if (!oldName || !newName) return res.status(400).json({ error: 'Укажите старое и новое имя' });
  const trimmed = newName.trim();
  // Rename in directors list
  let list = loadDirectors();
  const idx = list.findIndex(d => d.toLowerCase() === oldName.toLowerCase());
  if (idx !== -1) list[idx] = trimmed;
  saveDirectors(list);
  // Rename in episode assignments (arrays)
  const map = loadEpisodeDirectors();
  let epChanged = 0;
  for (const ep of Object.keys(map)) {
    const arr = map[ep] || [];
    let changed = false;
    const newArr = arr.map(d => {
      if (d.toLowerCase() === oldName.toLowerCase()) { changed = true; return trimmed; }
      return d;
    });
    if (changed) {
      // Dedupe in case the renamed director was already in the list
      const seen = new Set();
      map[ep] = newArr.filter(d => {
        const k = d.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      epChanged++;
    }
  }
  if (epChanged) saveEpisodeDirectors(map);
  // Rename in clip overrides
  const clips = loadClips();
  let clipsChanged = 0;
  clips.forEach(c => {
    if (c.directorOverride && c.directorOverride.toLowerCase() === oldName.toLowerCase()) {
      c.directorOverride = trimmed; clipsChanged++;
    }
  });
  if (clipsChanged) saveClips(clips);
  res.json({ success: true, epChanged, clipsChanged });
});

// Assign director(s) to an episode (admin). Accepts string, array, or null/empty to clear.
app.put('/api/episode-directors/:episode', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const ep = req.params.episode;
  const { director, directors } = req.body || {};
  const map = loadEpisodeDirectors();
  // Either `directors` (preferred) or legacy `director`
  const names = normalizeDirectors(directors !== undefined ? directors : director);
  if (!names.length) {
    delete map[ep];
  } else {
    // Auto-add any new names to the global directors list
    const list = loadDirectors();
    let listChanged = false;
    for (const name of names) {
      if (!list.find(d => d.toLowerCase() === name.toLowerCase())) {
        list.push(name);
        listChanged = true;
      }
    }
    if (listChanged) {
      list.sort((a, b) => a.localeCompare(b));
      saveDirectors(list);
    }
    map[ep] = names;
  }
  saveEpisodeDirectors(map);
  res.json({ success: true, episode: ep, directors: map[ep] || [] });
});


app.get('/api/filters', (req, res) => { res.json(loadFilters()); });

app.post('/api/filters', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { id, label, labelEn, type } = req.body;
  if (!id || !label) return res.status(400).json({ error: 'ID и название обязательны' });
  const list = loadFilters();
  if (list.find(f => f.id === id)) return res.status(400).json({ error: 'Фильтр с таким ID уже есть' });
  list.push({ id: id.trim(), label: label.trim(), labelEn: (labelEn || '').trim(), type: type || 'tag' });
  saveFilters(list);
  res.json({ success: true, filters: list });
});

app.delete('/api/filters', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID обязателен' });
  let list = loadFilters();
  list = list.filter(f => f.id !== id);
  saveFilters(list);
  res.json({ success: true, filters: list });
});

// Update filter English label
app.put('/api/filters/:id/label-en', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const list = loadFilters();
  const filter = list.find(f => f.id === req.params.id);
  if (!filter) return res.status(404).json({ error: 'Фильтр не найден' });
  filter.labelEn = (req.body.labelEn || '').trim();
  saveFilters(list);
  res.json({ success: true, filter });
});

// Update filter description
app.put('/api/filters/:id/description', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const list = loadFilters();
  const filter = list.find(f => f.id === req.params.id);
  if (!filter) return res.status(404).json({ error: 'Фильтр не найден' });
  filter.description = (req.body.description || '').toString();
  filter.descriptionEn = (req.body.descriptionEn || '').toString();
  saveFilters(list);
  res.json({ success: true, filter });
});

// ===== EPISODES API =====
app.get('/api/episodes', (req, res) => { res.json(loadEpisodes()); });

// Hide episode
app.post('/api/episodes/hide', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { episode } = req.body;
  if (!episode) return res.status(400).json({ error: 'Укажите серию' });
  const data = loadEpisodes();
  if (!data.hidden.includes(episode)) data.hidden.push(episode);
  saveEpisodes(data);
  res.json({ success: true, episodes: data });
});

// Unhide episode
app.post('/api/episodes/unhide', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { episode } = req.body;
  if (!episode) return res.status(400).json({ error: 'Укажите серию' });
  const data = loadEpisodes();
  data.hidden = data.hidden.filter(e => e !== episode);
  saveEpisodes(data);
  res.json({ success: true, episodes: data });
});

// Rename episode
app.post('/api/episodes/rename', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { oldEpisode, newEpisode } = req.body;
  if (!oldEpisode || !newEpisode) return res.status(400).json({ error: 'Укажите старый и новый номер' });
  const data = loadEpisodes();
  // Update renamed map
  data.renamed[oldEpisode] = newEpisode;
  saveEpisodes(data);
  // Rename in all clips
  const clips = loadClips();
  let changed = 0;
  clips.forEach(clip => {
    if (clip.episode.trim() === oldEpisode) { clip.episode = newEpisode; changed++; }
  });
  if (changed) saveClips(clips);
  res.json({ success: true, renamed: changed });
});

// ===== COMMENTS API =====
// Get comments for a clip
app.get('/api/clips/:id/comments', (req, res) => {
  const comments = loadComments();
  const clipId = req.params.id;
  const list = comments[clipId] || [];
  const reqToken = req.headers['x-user-token'];
  const reqAdminToken = req.headers['x-admin-token'];
  const isAdminReq = reqAdminToken && sessionTokens.has(reqAdminToken);
  const safe = list.map(c => ({
    id: c.id,
    nickname: c.nickname,
    text: c.text,
    createdAt: c.createdAt,
    editedAt: c.editedAt || null,
    isOwn: !!(reqToken && c.userToken && c.userToken === reqToken),
    // Only expose userToken to admin for banning
    userToken: isAdminReq ? (c.userToken || null) : undefined
  }));
  res.json(safe);
});

// Get comment counts for all clips
app.get('/api/comments/counts', (req, res) => {
  const comments = loadComments();
  const counts = {};
  for (const [clipId, arr] of Object.entries(comments)) {
    if (arr.length) counts[clipId] = arr.length;
  }
  res.json(counts);
});

// ===== COMMENT ANTI-SPAM =====
const BANNED_USERS_FILE = path.join(dataDir, 'banned_users.json');
const commentRateLimit = new Map(); // userToken -> array of timestamps

function loadBannedUsers() {
  if (!fs.existsSync(BANNED_USERS_FILE)) { saveBannedUsers([]); return []; }
  try { return JSON.parse(fs.readFileSync(BANNED_USERS_FILE, 'utf-8')); }
  catch { return []; }
}
function saveBannedUsers(list) { writeJsonAtomic(BANNED_USERS_FILE, list); }

function containsLinks(text) {
  return /https?:\/\/|www\.|\.com|\.ru|\.org|\.net|\.io|t\.me\//i.test(text);
}

function getUserDailyCommentCount(userToken) {
  const comments = loadComments();
  const today = new Date().toISOString().slice(0, 10);
  let count = 0;
  for (const arr of Object.values(comments)) {
    arr.forEach(c => {
      if (c.userToken === userToken && c.createdAt && c.createdAt.startsWith(today)) count++;
    });
  }
  return count;
}

// Ban user (admin only)
app.post('/api/comments/ban', (req, res) => {
  const session = requireAdmin(req, res);
  if (!session) return;
  const { userToken } = req.body;
  if (!userToken) return res.status(400).json({ error: 'Токен обязателен' });
  const list = loadBannedUsers();
  if (!list.includes(userToken)) { list.push(userToken); saveBannedUsers(list); }
  addAudit(session.username, 'ban_user', userToken.slice(0, 12) + '…');
  res.json({ success: true });
});

// Unban user (admin only)
app.post('/api/comments/unban', (req, res) => {
  const session = requireAdmin(req, res);
  if (!session) return;
  const { userToken } = req.body;
  if (!userToken) return res.status(400).json({ error: 'Токен обязателен' });
  let list = loadBannedUsers();
  list = list.filter(t => t !== userToken);
  saveBannedUsers(list);
  addAudit(session.username, 'unban_user', userToken.slice(0, 12) + '…');
  res.json({ success: true });
});

// Add comment to a clip (no auth needed)
app.post('/api/clips/:id/comments', commentLimiter, (req, res) => {
  const { nickname, text, userToken } = req.body;
  if (!nickname || !nickname.trim()) return res.status(400).json({ error: 'Укажите ник' });
  if (!text || !text.trim()) return res.status(400).json({ error: 'Напишите комментарий' });
  if (nickname.trim().length > 30) return res.status(400).json({ error: 'Ник слишком длинный (макс 30 символов)' });
  if (text.trim().length > 1000) return res.status(400).json({ error: 'Комментарий слишком длинный (макс 1000 символов)' });

  // Check ban
  if (userToken && loadBannedUsers().includes(userToken)) {
    return res.status(403).json({ error: 'Вы заблокированы и не можете оставлять комментарии' });
  }

  // Check links
  if (containsLinks(text)) {
    return res.status(400).json({ error: 'Ссылки в комментариях запрещены' });
  }

  // Rate limit: after 3 comments in a row, 30 sec cooldown
  if (userToken) {
    const times = commentRateLimit.get(userToken) || [];
    // Clean old timestamps (older than 30 sec)
    const recent = times.filter(t => Date.now() - t < 30000);
    if (recent.length >= 3) {
      const oldest = recent[0];
      const wait = Math.ceil((30000 - (Date.now() - oldest)) / 1000);
      return res.status(429).json({ error: `Подождите ${wait} сек. перед следующим комментарием` });
    }
  }

  // Daily limit: 50 comments per day
  if (userToken && getUserDailyCommentCount(userToken) >= 50) {
    return res.status(429).json({ error: 'Достигнут лимит комментариев на сегодня (50)' });
  }

  const nick = nickname.trim().toLowerCase();
  const nicknames = loadNicknames();

  // Admins skip the nickname-uniqueness check entirely — they should be able to
  // comment under any nickname (including ones they've used from other browsers).
  const reqAdminToken = req.headers['x-admin-token'];
  const isAdminReq = reqAdminToken && sessionTokens.has(reqAdminToken);

  // Only check nickname ownership if userToken is provided AND requester is not admin
  if (userToken && !isAdminReq) {
    if (nicknames[nick] && nicknames[nick] !== userToken) {
      return res.status(400).json({ error: 'Такой никнейм уже существует' });
    }
    if (!nicknames[nick]) {
      nicknames[nick] = userToken;
      saveNicknames(nicknames);
    }
  }

  const comments = loadComments();
  const clipId = req.params.id;
  if (!comments[clipId]) comments[clipId] = [];

  const comment = {
    id: Date.now(),
    nickname: nickname.trim(),
    text: text.trim(),
    userToken: userToken || null,
    createdAt: new Date().toISOString()
  };

  comments[clipId].push(comment);
  saveComments(comments);

  // Update rate limit
  if (userToken) {
    const times = (commentRateLimit.get(userToken) || []).filter(t => Date.now() - t < 30000);
    times.push(Date.now());
    commentRateLimit.set(userToken, times);
  }

  res.json({ success: true, comment });
});

// Delete comment (admin or own comment)
app.delete('/api/clips/:id/comments/:commentId', (req, res) => {
  const comments = loadComments();
  const clipId = req.params.id;
  const commentId = parseInt(req.params.commentId);
  if (!comments[clipId]) return res.status(404).json({ error: 'Комментарий не найден' });
  
  const comment = comments[clipId].find(c => c.id === commentId);
  if (!comment) return res.status(404).json({ error: 'Комментарий не найден' });

  // Check: admin or own comment
  const adminToken = req.headers['x-admin-token'];
  const userToken = req.headers['x-user-token'];
  const isAdminReq = adminToken && sessionTokens.has(adminToken);
  const isOwner = userToken && comment.userToken && comment.userToken === userToken;

  if (!isAdminReq && !isOwner) {
    return res.status(403).json({ error: 'Можно удалять только свои комментарии' });
  }

  comments[clipId] = comments[clipId].filter(c => c.id !== commentId);
  saveComments(comments);
  res.json({ success: true });
});

// Edit comment (own comment only)
app.put('/api/clips/:id/comments/:commentId', (req, res) => {
  const comments = loadComments();
  const clipId = req.params.id;
  const commentId = parseInt(req.params.commentId);
  if (!comments[clipId]) return res.status(404).json({ error: 'Комментарий не найден' });

  const comment = comments[clipId].find(c => c.id === commentId);
  if (!comment) return res.status(404).json({ error: 'Комментарий не найден' });

  const userToken = req.headers['x-user-token'];
  const adminToken = req.headers['x-admin-token'];
  const isAdminReq = adminToken && sessionTokens.has(adminToken);
  const isOwner = userToken && comment.userToken && comment.userToken === userToken;

  if (!isAdminReq && !isOwner) {
    return res.status(403).json({ error: 'Можно редактировать только свои комментарии' });
  }

  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Напишите комментарий' });
  if (text.trim().length > 1000) return res.status(400).json({ error: 'Комментарий слишком длинный' });

  comment.text = text.trim();
  comment.editedAt = new Date().toISOString();
  saveComments(comments);
  res.json({ success: true, comment });
});

// ===== BACKUP (admin only) =====
// Helper: recursively get total size of a directory
function getDirSize(dirPath) {
  let total = 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dirPath, ent.name);
      try {
        if (ent.isDirectory()) total += getDirSize(full);
        else total += fs.statSync(full).size;
      } catch {}
    }
  } catch {}
  return total;
}

app.get('/api/backup', (req, res) => {
  const token = req.query.token || req.headers['x-admin-token'];
  const info = token ? sessionTokens.get(token) : null;
  // Allow if owner, OR admin who has been explicitly granted canBackup permission by the owner
  const isAllowed = info && (info.role === 'owner' || info.canBackup === true);
  if (!isAllowed) return res.status(403).send('Доступ запрещён');
  addAudit(info.username, 'download_backup', null);

  // Compute estimated total size (raw, before zip compression).
  // This is what the client uses for the progress bar.
  const filesToInclude = [
    DATA_FILE, ANIMATORS_FILE, FILTERS_FILE, EPISODES_FILE, HIDDEN_ANIMATORS_FILE,
    COMMENTS_FILE, NICKNAMES_FILE, VIEWS_FILE, LIKES_FILE, BANNED_USERS_FILE,
    DIRECTORS_FILE, EPISODE_DIRECTORS_FILE,
    USERS_FILE, AUDIT_LOG_FILE
  ];
  let estimatedSize = 0;
  for (const f of filesToInclude) {
    try { if (fs.existsSync(f)) estimatedSize += fs.statSync(f).size; } catch {}
  }
  if (fs.existsSync(uploadsDir)) estimatedSize += getDirSize(uploadsDir);

  const archiver = require('archiver');
  const archive = archiver('zip', { zlib: { level: 5 } });

  res.attachment('sakugapiece-backup.zip');
  // Custom header so the client can show real progress.
  // Content-Length isn't usable here because the zip stream length isn't known in advance.
  res.setHeader('X-Backup-Estimated-Size', String(estimatedSize));
  // Allow JS to read this header on the client (CORS-style allow-list)
  res.setHeader('Access-Control-Expose-Headers', 'X-Backup-Estimated-Size');
  archive.pipe(res);

  // Add clips.json
  if (fs.existsSync(DATA_FILE)) archive.file(DATA_FILE, { name: 'clips.json' });
  // Add animators.json
  if (fs.existsSync(ANIMATORS_FILE)) archive.file(ANIMATORS_FILE, { name: 'animators.json' });
  // Add filters.json
  if (fs.existsSync(FILTERS_FILE)) archive.file(FILTERS_FILE, { name: 'filters.json' });
  // Add episodes.json
  if (fs.existsSync(EPISODES_FILE)) archive.file(EPISODES_FILE, { name: 'episodes.json' });
  // Add hidden_animators.json
  if (fs.existsSync(HIDDEN_ANIMATORS_FILE)) archive.file(HIDDEN_ANIMATORS_FILE, { name: 'hidden_animators.json' });
  // Add comments.json
  if (fs.existsSync(COMMENTS_FILE)) archive.file(COMMENTS_FILE, { name: 'comments.json' });
  // Add nicknames.json
  if (fs.existsSync(NICKNAMES_FILE)) archive.file(NICKNAMES_FILE, { name: 'nicknames.json' });
  // Add views.json
  if (fs.existsSync(VIEWS_FILE)) archive.file(VIEWS_FILE, { name: 'views.json' });
  if (fs.existsSync(LIKES_FILE)) archive.file(LIKES_FILE, { name: 'likes.json' });
  // Add users.json (admin accounts)
  if (fs.existsSync(USERS_FILE)) archive.file(USERS_FILE, { name: 'users.json' });
  // Add audit_log.json
  if (fs.existsSync(AUDIT_LOG_FILE)) archive.file(AUDIT_LOG_FILE, { name: 'audit_log.json' });
  // Add banned_users.json
  if (fs.existsSync(BANNED_USERS_FILE)) archive.file(BANNED_USERS_FILE, { name: 'banned_users.json' });
  // Add directors.json
  if (fs.existsSync(DIRECTORS_FILE)) archive.file(DIRECTORS_FILE, { name: 'directors.json' });
  // Add episode_directors.json
  if (fs.existsSync(EPISODE_DIRECTORS_FILE)) archive.file(EPISODE_DIRECTORS_FILE, { name: 'episode_directors.json' });
  // Add uploads folder
  if (fs.existsSync(uploadsDir)) archive.directory(uploadsDir, 'uploads');

  archive.finalize();
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Файл слишком большой (максимум 200 МБ)' });
    return res.status(400).json({ error: err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`\n  ⚓ Sakuga Piece запущен: http://localhost:${PORT}\n`);
});
