const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== DATA FILE =====
const DATA_FILE = path.join(__dirname, 'clips.json');

function loadClips() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveClips(clips) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(clips, null, 2), 'utf-8');
}

// ===== UPLOADS =====
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: (req, file, cb) => {
    const allowed = /video\/(mp4|webm|quicktime|x-msvideo|x-matroska)/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только видеофайлы (MP4, WebM, MOV, AVI, MKV)'));
    }
  }
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// ===== API =====

// Get all clips
app.get('/api/clips', (req, res) => {
  const clips = loadClips();
  res.json(clips);
});

// Upload a new clip
app.post('/api/clips', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Видеофайл обязателен' });
  }

  const { title, animators, episode, arc, tags, notes } = req.body;

  if (!title || !animators || !episode) {
    // Remove uploaded file if validation fails
    fs.unlinkSync(req.file.path);
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
    filename: req.file.filename,
    videoUrl: '/uploads/' + req.file.filename,
    quality: '1080p',
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  };

  clips.unshift(newClip);
  saveClips(clips);

  res.json({ success: true, clip: newClip });
});

// Delete a clip
app.delete('/api/clips/:id', (req, res) => {
  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);

  if (!clip) {
    return res.status(404).json({ error: 'Клип не найден' });
  }

  // Remove video file
  const filePath = path.join(uploadsDir, clip.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const filtered = clips.filter(c => c.id !== id);
  saveClips(filtered);

  res.json({ success: true });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (максимум 200 МБ)' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`\n  ⚓ Sakuga Piece запущен: http://localhost:${PORT}\n`);
});
