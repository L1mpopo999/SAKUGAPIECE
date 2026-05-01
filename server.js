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

function loadClips() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
  catch { return []; }
}

function saveClips(clips) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(clips, null, 2), 'utf-8');
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
function saveAnimators(list) { fs.writeFileSync(ANIMATORS_FILE, JSON.stringify(list, null, 2), 'utf-8'); }

function loadFilters() {
  if (!fs.existsSync(FILTERS_FILE)) { saveFilters(DEFAULT_FILTERS); return DEFAULT_FILTERS; }
  try { return JSON.parse(fs.readFileSync(FILTERS_FILE, 'utf-8')); }
  catch { return DEFAULT_FILTERS; }
}
function saveFilters(list) { fs.writeFileSync(FILTERS_FILE, JSON.stringify(list, null, 2), 'utf-8'); }

// ===== EPISODES DATA =====
const EPISODES_FILE = path.join(dataDir, 'episodes.json');
const DEFAULT_EPISODES = { hidden: [], renamed: {} };

function loadEpisodes() {
  if (!fs.existsSync(EPISODES_FILE)) { saveEpisodes(DEFAULT_EPISODES); return DEFAULT_EPISODES; }
  try { return JSON.parse(fs.readFileSync(EPISODES_FILE, 'utf-8')); }
  catch { return DEFAULT_EPISODES; }
}
function saveEpisodes(data) { fs.writeFileSync(EPISODES_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// ===== HIDDEN ANIMATORS =====
const HIDDEN_ANIMATORS_FILE = path.join(dataDir, 'hidden_animators.json');

function loadHiddenAnimators() {
  if (!fs.existsSync(HIDDEN_ANIMATORS_FILE)) { saveHiddenAnimators([]); return []; }
  try { return JSON.parse(fs.readFileSync(HIDDEN_ANIMATORS_FILE, 'utf-8')); }
  catch { return []; }
}
function saveHiddenAnimators(list) { fs.writeFileSync(HIDDEN_ANIMATORS_FILE, JSON.stringify(list, null, 2), 'utf-8'); }

// ===== DIRECTORS =====
const DIRECTORS_FILE = path.join(dataDir, 'directors.json');
const EPISODE_DIRECTORS_FILE = path.join(dataDir, 'episode_directors.json');

function loadDirectors() {
  if (!fs.existsSync(DIRECTORS_FILE)) { saveDirectors([]); return []; }
  try { return JSON.parse(fs.readFileSync(DIRECTORS_FILE, 'utf-8')); }
  catch { return []; }
}
function saveDirectors(list) { fs.writeFileSync(DIRECTORS_FILE, JSON.stringify(list, null, 2), 'utf-8'); }

function loadEpisodeDirectors() {
  if (!fs.existsSync(EPISODE_DIRECTORS_FILE)) { saveEpisodeDirectors({}); return {}; }
  try { return JSON.parse(fs.readFileSync(EPISODE_DIRECTORS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveEpisodeDirectors(map) { fs.writeFileSync(EPISODE_DIRECTORS_FILE, JSON.stringify(map, null, 2), 'utf-8'); }


// ===== COMMENTS =====
const COMMENTS_FILE = path.join(dataDir, 'comments.json');
const NICKNAMES_FILE = path.join(dataDir, 'nicknames.json');

function loadComments() {
  if (!fs.existsSync(COMMENTS_FILE)) { saveComments({}); return {}; }
  try { return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveComments(data) { fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

function loadNicknames() {
  if (!fs.existsSync(NICKNAMES_FILE)) { saveNicknames({}); return {}; }
  try { return JSON.parse(fs.readFileSync(NICKNAMES_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveNicknames(data) { fs.writeFileSync(NICKNAMES_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// ===== API =====
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jefp1ece2005';
const crypto = require('crypto');
let adminTokens = new Set();

function checkAdmin(req, res) {
  const token = req.headers['x-admin-token'];
  if (!token || !adminTokens.has(token)) {
    res.status(403).json({ error: 'Доступ запрещён. Войдите как админ.' });
    return false;
  }
  return true;
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    adminTokens.add(token);
    res.json({ success: true, token });
  } else {
    res.status(403).json({ error: 'Неверный пароль' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) adminTokens.delete(token);
  res.json({ success: true });
});

// Verify token
app.get('/api/verify', (req, res) => {
  const token = req.headers['x-admin-token'];
  res.json({ valid: !!(token && adminTokens.has(token)) });
});

// Get all clips
app.get('/api/clips', (req, res) => {
  res.json(loadClips());
});

// Record a view (unique per user token)
const VIEWS_FILE = path.join(dataDir, 'views.json');
function loadViews() {
  if (!fs.existsSync(VIEWS_FILE)) { saveViews({}); return {}; }
  try { return JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveViews(data) { fs.writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

app.post('/api/clips/:id/view', (req, res) => {
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
    // No token — use IP as fallback
    const ip = req.headers['x-real-ip'] || req.ip;
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

  if (!videoFile && imageFiles.length === 0) {
    return res.status(400).json({ error: 'Загрузите видео или хотя бы одно изображение' });
  }

  const { title, animators, episode, arc, tags, notes, timecodes, clipOrder } = req.body;

  if (!title || !animators || !episode) {
    // Clean up
    if (videoFile && fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
    imageFiles.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    return res.status(400).json({ error: 'Заполните название, аниматора и номер эпизода' });
  }

  const clips = loadClips();

  const newClip = {
    id: Date.now(),
    title: title.trim(),
    animators: animators.split(',').map(a => a.trim()).filter(Boolean),
    episode: episode.trim(),
    arc: arc || 'Unknown',
    tags: tags ? tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean) : [],
    notes: notes || '',
    timecodes: timecodes || '',
    clipOrder: parseInt(clipOrder) || 0,
    // Thumbnail
    thumbnailUrl: thumbnailFile ? '/uploads/' + thumbnailFile.filename : null,
    // Video
    filename: videoFile ? videoFile.filename : null,
    videoUrl: videoFile ? '/uploads/' + videoFile.filename : null,
    // Images
    images: imageFiles.map(f => ({
      filename: f.filename,
      url: '/uploads/' + f.filename
    })),
    quality: videoFile ? '1080p' : null,
    type: videoFile ? 'video' : 'images',
    size: videoFile ? videoFile.size : imageFiles.reduce((sum, f) => sum + f.size, 0),
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

  const { title, animators, episode, arc, tags, notes, timecodes, clipOrder, directorOverride } = req.body;

  if (title !== undefined) clip.title = title.trim();
  if (animators !== undefined) clip.animators = animators.split(',').map(a => a.trim()).filter(Boolean);
  if (episode !== undefined) clip.episode = episode.trim();
  if (arc !== undefined) clip.arc = arc;
  if (tags !== undefined) clip.tags = tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean);
  if (notes !== undefined) clip.notes = notes;
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
  if (!checkAdmin(req, res)) return;

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
  res.json({ success: true });
});

// ===== ANIMATORS API =====
app.get('/api/animators', (req, res) => { res.json(loadAnimators()); });

app.post('/api/animators', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Имя обязательно' });
  const list = loadAnimators();
  const trimmed = name.trim();
  if (list.find(a => a.toLowerCase() === trimmed.toLowerCase())) return res.status(400).json({ error: 'Аниматор уже существует' });
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
  // Remove this director from all episode assignments
  const map = loadEpisodeDirectors();
  let cleared = 0;
  for (const ep of Object.keys(map)) {
    if (map[ep] && map[ep].toLowerCase() === name.toLowerCase()) { delete map[ep]; cleared++; }
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
  // Rename in episode assignments
  const map = loadEpisodeDirectors();
  let epChanged = 0;
  for (const ep of Object.keys(map)) {
    if (map[ep] && map[ep].toLowerCase() === oldName.toLowerCase()) { map[ep] = trimmed; epChanged++; }
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

// Assign director to an episode (admin). null/empty value clears it.
app.put('/api/episode-directors/:episode', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const ep = req.params.episode;
  const { director } = req.body;
  const map = loadEpisodeDirectors();
  if (!director || !String(director).trim()) {
    delete map[ep];
  } else {
    const name = String(director).trim();
    // Auto-add to directors list if not present
    const list = loadDirectors();
    if (!list.find(d => d.toLowerCase() === name.toLowerCase())) {
      list.push(name);
      list.sort((a, b) => a.localeCompare(b));
      saveDirectors(list);
    }
    map[ep] = name;
  }
  saveEpisodeDirectors(map);
  res.json({ success: true, episode: ep, director: map[ep] || null });
});


app.get('/api/filters', (req, res) => { res.json(loadFilters()); });

app.post('/api/filters', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { id, label, type } = req.body;
  if (!id || !label) return res.status(400).json({ error: 'ID и название обязательны' });
  const list = loadFilters();
  if (list.find(f => f.id === id)) return res.status(400).json({ error: 'Фильтр с таким ID уже есть' });
  list.push({ id: id.trim(), label: label.trim(), type: type || 'tag' });
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

// Update filter description
app.put('/api/filters/:id/description', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const list = loadFilters();
  const filter = list.find(f => f.id === req.params.id);
  if (!filter) return res.status(404).json({ error: 'Фильтр не найден' });
  filter.description = req.body.description || '';
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
  const isAdminReq = reqAdminToken && adminTokens.has(reqAdminToken);
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
function saveBannedUsers(list) { fs.writeFileSync(BANNED_USERS_FILE, JSON.stringify(list, null, 2), 'utf-8'); }

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
  if (!checkAdmin(req, res)) return;
  const { userToken } = req.body;
  if (!userToken) return res.status(400).json({ error: 'Токен обязателен' });
  const list = loadBannedUsers();
  if (!list.includes(userToken)) { list.push(userToken); saveBannedUsers(list); }
  res.json({ success: true });
});

// Unban user (admin only)
app.post('/api/comments/unban', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { userToken } = req.body;
  if (!userToken) return res.status(400).json({ error: 'Токен обязателен' });
  let list = loadBannedUsers();
  list = list.filter(t => t !== userToken);
  saveBannedUsers(list);
  res.json({ success: true });
});

// Add comment to a clip (no auth needed)
app.post('/api/clips/:id/comments', (req, res) => {
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

  // Only check nickname ownership if userToken is provided
  if (userToken) {
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
  const isAdminReq = adminToken && adminTokens.has(adminToken);
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
  const isAdminReq = adminToken && adminTokens.has(adminToken);
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
app.get('/api/backup', (req, res) => {
  const token = req.query.token || req.headers['x-admin-token'];
  if (!token || !adminTokens.has(token)) return res.status(403).send('Доступ запрещён');

  const archiver = require('archiver');
  const archive = archiver('zip', { zlib: { level: 5 } });

  res.attachment('sakugapiece-backup.zip');
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
