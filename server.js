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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
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
  { name: 'images', maxCount: 20 }
]);

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// ===== API =====
const ADMIN_PASSWORD = 'jefp1ece2005';

function checkAdmin(req, res) {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) {
    res.status(403).json({ error: 'Доступ запрещён. Войдите как админ.' });
    return false;
  }
  return true;
}

// Get all clips
app.get('/api/clips', (req, res) => {
  res.json(loadClips());
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
  const imageFiles = req.files?.images || [];

  if (!videoFile && imageFiles.length === 0) {
    return res.status(400).json({ error: 'Загрузите видео или хотя бы одно изображение' });
  }

  const { title, animators, episode, arc, tags, notes, timecodes } = req.body;

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

  res.json({ success: true, clip: newClip });
});

// Edit a clip (admin only)
app.put('/api/clips/:id', express.json(), (req, res) => {
  if (!checkAdmin(req, res)) return;

  const clips = loadClips();
  const id = parseInt(req.params.id);
  const clip = clips.find(c => c.id === id);

  if (!clip) return res.status(404).json({ error: 'Клип не найден' });

  const { title, animators, episode, arc, tags, notes, timecodes } = req.body;

  if (title !== undefined) clip.title = title.trim();
  if (animators !== undefined) clip.animators = animators.split(',').map(a => a.trim()).filter(Boolean);
  if (episode !== undefined) clip.episode = episode.trim();
  if (arc !== undefined) clip.arc = arc;
  if (tags !== undefined) clip.tags = tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean);
  if (notes !== undefined) clip.notes = notes;
  if (timecodes !== undefined) clip.timecodes = timecodes;

  saveClips(clips);
  res.json({ success: true, clip });
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
