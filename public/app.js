// ===== ANIMATORS DATABASE =====
const ANIMATORS = [
  "Midori Matsuda", "Keiichi Ichikawa", "Tatsuya Nagamine", "Akihiro Ota",
  "Vincent Chansard", "Tu Yong-Ce", "Naotoshi Shida", "Shinya Ohira",
  "Henry Thurlow", "Megumi Ishitani", "Takashi Kojima", "Shu Sugita",
  "Yen BM", "Jakisuaki", "Michael Sung", "Shoutarou Ban",
  "Shūichi Itō", "Ryūhiro Nagaki", "Masayuki Takagi", "Yoshiichi Tomita",
  "Masahiro Kitasaki", "Kazue Sakai", "Eisaku Inoue", "Makoto Muroi",
  "Hisashi Sameshima", "Dai Harigi", "Yasuko Chiba", "Yuka Takemori",
  "Toshio Deguchi", "He Ziwei", "Ippei Masui", "Asako Ota",
  "Narumi Takahashi", "Kenji Yokoyama", "Bahi JD", "Masami Mori",
  "Kimitaka Itō", "Takumi Yamamoto"
];

// ===== STATE =====
let allClips = [];
let currentFilter = 'all';
let selectedFile = null;
let selectedAnimators = [];
let currentPage = 'browse';
let currentAnimatorProfile = null;
let isAdmin = false;
let clipToDelete = null;

// Admin password — change this to your own!
const ADMIN_PASSWORD = 'sakugapiece2026';

// ===== HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const TAG_RU = {
  fighting: 'бой', effects: 'эффекты', character_acting: 'эктинг',
  transformation: 'трансформация', gear5: 'gear 5', haki: 'хаки',
};
function tagLabel(tag) { return TAG_RU[tag] || tag; }
function pluralRu(n) { const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return ''; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'а'; return 'ов'; }
function esc(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }
function getInitials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

// ===== PAGE NAVIGATION =====
function navigateTo(page, data) {
  currentPage = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-link').forEach(l => l.classList.remove('active'));

  const pageEl = $(`#page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const navBtn = $(`.nav-link[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');

  // Special handling for animator profile
  if (page === 'animator-profile' && data) {
    currentAnimatorProfile = data;
    $(`.nav-link[data-page="animators"]`).classList.add('active');
    renderAnimatorProfile(data);
  }

  if (page === 'animators') renderAnimatorGrid();

  window.scrollTo(0, 0);
}

$$('.nav-link[data-page]').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

$('#backToAnimatorsBtn').addEventListener('click', () => navigateTo('animators'));

// ===== LOAD CLIPS =====
async function loadClips() {
  try {
    const res = await fetch('/api/clips');
    allClips = await res.json();
  } catch (e) {
    allClips = [];
  }
  applyFilters();
}

// ===== CLIP RENDERING =====
function renderClipCard(clip, i) {
  return `
    <div class="clip-card" data-id="${clip.id}" style="animation-delay:${i * 0.05}s">
      <div class="clip-thumb">
        <button class="admin-delete-btn" data-delete-id="${clip.id}" title="Удалить клип">&times;</button>
        ${clip.videoUrl
          ? `<video src="${clip.videoUrl}" muted preload="metadata"></video>`
          : `<div class="clip-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>`}
        ${clip.duration ? `<span class="clip-duration">${clip.duration}</span>` : ''}
        <span class="clip-hd-badge">${clip.quality || '1080p'}</span>
        <div class="clip-play-overlay"><div class="play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg></div></div>
      </div>
      <div class="clip-info">
        <div class="clip-title">${esc(clip.title)}</div>
        <div class="clip-meta">
          <span>Эп. ${esc(clip.episode)}</span>
          <span class="clip-meta-divider">·</span>
          <span>${esc(clip.arc)}</span>
        </div>
        <div class="clip-tags">
          ${clip.animators.map(a => `<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
          ${clip.tags.slice(0, 2).map(t => `<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}
        </div>
      </div>
    </div>`;
}

function attachClipEvents(container) {
  container.querySelectorAll('.clip-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Admin delete button
      if (e.target.closest('.admin-delete-btn')) {
        e.stopPropagation();
        const id = parseInt(e.target.closest('.admin-delete-btn').dataset.deleteId);
        confirmDeleteClip(id);
        return;
      }
      // Animator tag click
      if (e.target.closest('.clip-tag.animator')) {
        e.stopPropagation();
        const name = e.target.closest('.clip-tag.animator').dataset.animator;
        navigateTo('animator-profile', name);
        return;
      }
      openPlayer(parseInt(card.dataset.id));
    });
  });
}

function renderClips(clips) {
  const grid = $('#clipGrid');
  const count = $('#resultsCount');
  count.textContent = `${clips.length} клип${pluralRu(clips.length)}`;

  if (!clips.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0">
      <p style="color:var(--text-muted);font-size:1.1rem">Клипы не найдены</p>
      <p style="color:var(--text-muted);font-size:.85rem;margin-top:.5rem">Попробуйте другой запрос или загрузите новый клип</p></div>`;
    return;
  }

  grid.innerHTML = clips.map((c, i) => renderClipCard(c, i)).join('');
  attachClipEvents(grid);
}

// ===== BROWSE FILTERS =====
function applyFilters() {
  const q = ($('#searchInput')?.value || '').toLowerCase().trim();
  let clips = allClips;

  if (currentFilter !== 'all') {
    clips = clips.filter(c => c.tags.includes(currentFilter) || c.arc.toLowerCase() === currentFilter.toLowerCase());
  }
  if (q) {
    clips = clips.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.animators.some(a => a.toLowerCase().includes(q)) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.arc.toLowerCase().includes(q) ||
      c.episode.includes(q)
    );
  }
  renderClips(clips);
}

$$('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    applyFilters();
  });
});

// ===== BROWSE SEARCH =====
$('#searchInput').addEventListener('input', () => { applyFilters(); showSuggestions(); });
$('#searchInput').addEventListener('focus', showSuggestions);
document.addEventListener('click', (e) => { if (!e.target.closest('.search-wrapper')) $('#searchSuggestions').classList.remove('visible'); });

function showSuggestions() {
  const q = $('#searchInput').value.toLowerCase().trim();
  const sug = $('#searchSuggestions');
  if (!q) { sug.classList.remove('visible'); return; }

  const am = new Map(), tm = new Map();
  allClips.forEach(c => {
    c.animators.forEach(a => { if (a.toLowerCase().includes(q)) am.set(a, (am.get(a) || 0) + 1); });
    c.tags.forEach(t => { if (t.toLowerCase().includes(q)) tm.set(t, (tm.get(t) || 0) + 1); });
  });
  // Also suggest animators from the full list
  ANIMATORS.forEach(a => { if (a.toLowerCase().includes(q) && !am.has(a)) am.set(a, 0); });

  const items = [];
  am.forEach((c, n) => items.push({ type: 'animator', name: n, count: c }));
  tm.forEach((c, n) => items.push({ type: 'tag', name: tagLabel(n), raw: n, count: c }));

  if (!items.length) { sug.classList.remove('visible'); return; }

  sug.innerHTML = items.slice(0, 8).map(it => `
    <div class="suggestion-item" data-value="${esc(it.raw || it.name)}" data-type="${it.type}">
      <span class="suggestion-type ${it.type}">${it.type === 'animator' ? 'аниматор' : 'тег'}</span>
      <span class="suggestion-name">${esc(it.name)}</span>
      <span class="suggestion-count">${it.count} клип${pluralRu(it.count)}</span>
    </div>`).join('');

  sug.querySelectorAll('.suggestion-item').forEach(el => {
    el.addEventListener('click', () => {
      if (el.dataset.type === 'animator') {
        sug.classList.remove('visible');
        $('#searchInput').value = '';
        navigateTo('animator-profile', el.dataset.value);
      } else {
        $('#searchInput').value = el.dataset.value;
        sug.classList.remove('visible');
        applyFilters();
      }
    });
  });
  sug.classList.add('visible');
}

// ===== ANIMATORS PAGE =====
function renderAnimatorGrid() {
  const q = ($('#animatorSearchInput')?.value || '').toLowerCase().trim();
  const grid = $('#animatorGrid');

  // Count clips per animator
  const counts = new Map();
  allClips.forEach(c => c.animators.forEach(a => counts.set(a, (counts.get(a) || 0) + 1)));

  let list = ANIMATORS.map(name => ({ name, count: counts.get(name) || 0 }));

  if (q) {
    list = list.filter(a => a.name.toLowerCase().includes(q));
  }

  // Sort: animators with clips first, then alphabetically
  list.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0">
      <p style="color:var(--text-muted);font-size:1.1rem">Аниматор не найден</p></div>`;
    return;
  }

  grid.innerHTML = list.map((a, i) => `
    <div class="animator-card" data-name="${esc(a.name)}" style="animation-delay:${i * 0.03}s">
      <div class="animator-avatar">${getInitials(a.name)}</div>
      <div class="animator-card-info">
        <div class="animator-card-name">${esc(a.name)}</div>
        <div class="animator-card-count">${a.count} клип${pluralRu(a.count)}</div>
      </div>
      <svg class="animator-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`).join('');

  grid.querySelectorAll('.animator-card').forEach(card => {
    card.addEventListener('click', () => navigateTo('animator-profile', card.dataset.name));
  });
}

// Animator search
const animSearchInput = $('#animatorSearchInput');
if (animSearchInput) {
  animSearchInput.addEventListener('input', renderAnimatorGrid);
}

// ===== ANIMATOR PROFILE =====
function renderAnimatorProfile(name) {
  $('#animatorProfileName').textContent = name;

  const clips = allClips.filter(c => c.animators.some(a => a.toLowerCase() === name.toLowerCase()));
  const arcs = [...new Set(clips.map(c => c.arc))];

  let statsText = `${clips.length} клип${pluralRu(clips.length)}`;
  if (arcs.length) statsText += ` · Арки: ${arcs.join(', ')}`;
  $('#animatorProfileStats').textContent = statsText;

  const grid = $('#animatorClipGrid');
  if (!clips.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0">
      <p style="color:var(--text-muted);font-size:1.1rem">Пока нет загруженных клипов</p>
      <p style="color:var(--text-muted);font-size:.85rem;margin-top:.5rem">Будьте первым — загрузите клип для этого аниматора!</p></div>`;
  } else {
    grid.innerHTML = clips.map((c, i) => renderClipCard(c, i)).join('');
    attachClipEvents(grid);
  }
}

// Upload for specific animator
$('#uploadForAnimatorBtn').addEventListener('click', () => {
  openUploadModal(currentAnimatorProfile);
});

// ===== UPLOAD MODAL =====
function openUploadModal(presetAnimator) {
  $('#uploadModal').classList.add('visible');
  document.body.style.overflow = 'hidden';

  selectedAnimators = [];
  renderAnimatorChips();

  if (presetAnimator) {
    selectedAnimators.push(presetAnimator);
    renderAnimatorChips();
  }
}

function closeUploadModal() {
  $('#uploadModal').classList.remove('visible');
  document.body.style.overflow = '';
}

$('#openUploadBtn').addEventListener('click', () => openUploadModal());
$('#closeUploadBtn').addEventListener('click', closeUploadModal);
$('#uploadModal').addEventListener('click', (e) => { if (e.target === $('#uploadModal')) closeUploadModal(); });

// ===== ANIMATOR SELECTOR IN UPLOAD =====
const animInput = $('#animatorInput');
const animDropdown = $('#animatorDropdown');

animInput.addEventListener('input', () => {
  const q = animInput.value.toLowerCase().trim();
  if (!q) { animDropdown.classList.remove('visible'); return; }

  const matches = ANIMATORS.filter(a => a.toLowerCase().includes(q));

  if (!matches.length) {
    // Allow custom entry
    animDropdown.innerHTML = `<div class="animator-dropdown-item" data-name="${esc(animInput.value.trim())}">Добавить: «${esc(animInput.value.trim())}»</div>`;
  } else {
    animDropdown.innerHTML = matches.slice(0, 8).map(a => {
      const sel = selectedAnimators.includes(a);
      return `<div class="animator-dropdown-item${sel ? ' selected' : ''}" data-name="${esc(a)}">${esc(a)}${sel ? ' ✓' : ''}</div>`;
    }).join('');
  }

  animDropdown.querySelectorAll('.animator-dropdown-item:not(.selected)').forEach(el => {
    el.addEventListener('click', () => {
      const name = el.dataset.name;
      if (!selectedAnimators.includes(name)) {
        selectedAnimators.push(name);
        renderAnimatorChips();
      }
      animInput.value = '';
      animDropdown.classList.remove('visible');
    });
  });

  animDropdown.classList.add('visible');
});

animInput.addEventListener('focus', () => { if (animInput.value.trim()) animInput.dispatchEvent(new Event('input')); });

document.addEventListener('click', (e) => {
  if (!e.target.closest('.animator-select-wrapper')) animDropdown.classList.remove('visible');
});

function renderAnimatorChips() {
  const container = $('#animatorChips');
  container.innerHTML = selectedAnimators.map(a =>
    `<span class="animator-chip">${esc(a)}<button class="animator-chip-remove" data-name="${esc(a)}">&times;</button></span>`
  ).join('');

  container.querySelectorAll('.animator-chip-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedAnimators = selectedAnimators.filter(a => a !== btn.dataset.name);
      renderAnimatorChips();
    });
  });
}

// ===== FILE HANDLING =====
const dropZone = $('#dropZone');
const fileInput = $('#fileInput');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });
$('#removeFileBtn').addEventListener('click', removeFile);

function handleFile(file) {
  if (!file.type.startsWith('video/')) { notify('Пожалуйста, выберите видеофайл', true); return; }
  if (file.size > 200 * 1024 * 1024) { notify('Файл слишком большой (максимум 200 МБ)', true); return; }
  selectedFile = file;
  $('#fileName').textContent = file.name;
  $('#fileSize').textContent = formatBytes(file.size);
  $('#fileInfo').classList.add('visible');
}

function removeFile() {
  selectedFile = null;
  fileInput.value = '';
  $('#fileInfo').classList.remove('visible');
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / 1048576).toFixed(1) + ' МБ';
}

// ===== UPLOAD SUBMIT =====
$('#uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = $('#clipTitleInput').value.trim();
  const episode = $('#episodeInput').value.trim();
  const arc = $('#arcSelect').value;
  const tags = $('#tagsInput').value.trim();
  const notes = $('#notesInput').value.trim();

  if (!selectedFile) { notify('Выберите видеофайл для загрузки', true); return; }
  if (!title) { notify('Введите название клипа', true); return; }
  if (!selectedAnimators.length) { notify('Выберите хотя бы одного аниматора', true); return; }
  if (!episode) { notify('Введите номер эпизода', true); return; }

  const formData = new FormData();
  formData.append('video', selectedFile);
  formData.append('title', title);
  formData.append('animators', selectedAnimators.join(', '));
  formData.append('episode', episode);
  formData.append('arc', arc);
  formData.append('tags', tags);
  formData.append('notes', notes);

  $('#submitBtn').disabled = true;
  $('#uploadProgress').classList.add('visible');

  try {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        $('#progressBarFill').style.width = pct + '%';
        $('#progressText').textContent = `Загрузка... ${pct}%`;
      }
    });

    await new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
        else { try { reject(new Error(JSON.parse(xhr.responseText).error)); } catch { reject(new Error('Ошибка загрузки')); } }
      };
      xhr.onerror = () => reject(new Error('Ошибка сети'));
      xhr.open('POST', '/api/clips');
      xhr.send(formData);
    });

    $('#uploadForm').reset();
    selectedAnimators = [];
    renderAnimatorChips();
    removeFile();
    closeUploadModal();
    notify(`«${title}» успешно загружен!`);
    await loadClips();

    // Refresh animator profile if we were there
    if (currentPage === 'animator-profile' && currentAnimatorProfile) {
      renderAnimatorProfile(currentAnimatorProfile);
    }

  } catch (err) {
    notify(err.message || 'Ошибка при загрузке клипа', true);
  } finally {
    $('#submitBtn').disabled = false;
    $('#uploadProgress').classList.remove('visible');
    $('#progressBarFill').style.width = '0%';
  }
});

// ===== VIDEO PLAYER =====
function openPlayer(id) {
  const clip = allClips.find(c => c.id === id);
  if (!clip) return;

  $('#playerTitle').textContent = clip.title;
  $('#playerDetails').innerHTML = `
    <span class="clip-meta" style="font-size:0.8rem;">Эп. ${esc(clip.episode)} · ${esc(clip.arc)}</span>
    ${clip.animators.map(a => `<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
    ${clip.tags.map(t => `<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}`;

  // Animator tags in player are clickable
  $('#playerDetails').querySelectorAll('.clip-tag.animator').forEach(tag => {
    tag.addEventListener('click', () => {
      closePlayer();
      navigateTo('animator-profile', tag.dataset.animator);
    });
  });

  if (clip.videoUrl) {
    $('#playerVideo').src = clip.videoUrl;
    $('#playerVideo').style.display = 'block';
  } else {
    $('#playerVideo').removeAttribute('src');
    $('#playerVideo').style.display = 'none';
  }

  $('#playerOverlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closePlayer() {
  $('#playerVideo').pause();
  $('#playerVideo').removeAttribute('src');
  $('#playerOverlay').classList.remove('visible');
  document.body.style.overflow = '';
}

$('#playerCloseBtn').addEventListener('click', closePlayer);
$('#playerOverlay').addEventListener('click', (e) => { if (e.target === $('#playerOverlay')) closePlayer(); });

// ===== NOTIFICATION =====
let notifyTimeout;
function notify(text, isError = false) {
  $('#notificationText').textContent = text;
  $('#notification').classList.toggle('error', isError);
  $('#notification').classList.add('visible');
  clearTimeout(notifyTimeout);
  notifyTimeout = setTimeout(() => $('#notification').classList.remove('visible'), 3500);
}

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeUploadModal(); closePlayer(); }
  if (e.key === '/' && !e.target.closest('input, textarea, select')) {
    e.preventDefault();
    if (currentPage === 'animators') $('#animatorSearchInput').focus();
    else $('#searchInput').focus();
  }
});

// ===== ADMIN SYSTEM =====
$('#adminToggleBtn').addEventListener('click', () => {
  if (isAdmin) {
    // Logout
    isAdmin = false;
    document.body.classList.remove('admin-mode');
    notify('Вы вышли из режима админа');
  } else {
    // Show login modal
    $('#adminLoginModal').classList.add('visible');
    document.body.style.overflow = 'hidden';
    $('#adminPasswordInput').value = '';
    $('#adminLoginError').style.display = 'none';
    setTimeout(() => $('#adminPasswordInput').focus(), 100);
  }
});

$('#closeAdminLoginBtn').addEventListener('click', () => {
  $('#adminLoginModal').classList.remove('visible');
  document.body.style.overflow = '';
});

$('#adminLoginModal').addEventListener('click', (e) => {
  if (e.target === $('#adminLoginModal')) {
    $('#adminLoginModal').classList.remove('visible');
    document.body.style.overflow = '';
  }
});

$('#adminLoginBtn').addEventListener('click', tryAdminLogin);
$('#adminPasswordInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryAdminLogin();
});

function tryAdminLogin() {
  const pwd = $('#adminPasswordInput').value;
  if (pwd === ADMIN_PASSWORD) {
    isAdmin = true;
    document.body.classList.add('admin-mode');
    $('#adminLoginModal').classList.remove('visible');
    document.body.style.overflow = '';
    notify('Режим админа включён — нажмите ✕ на клипе чтобы удалить');
  } else {
    $('#adminLoginError').style.display = 'block';
    $('#adminPasswordInput').value = '';
    $('#adminPasswordInput').focus();
  }
}

// Delete confirmation
function confirmDeleteClip(id) {
  const clip = allClips.find(c => c.id === id);
  if (!clip) return;
  clipToDelete = id;
  $('#deleteConfirmText').textContent = `«${clip.title}» будет удалён навсегда.`;
  $('#deleteConfirmModal').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

$('#closeDeleteConfirmBtn').addEventListener('click', closeDeleteModal);
$('#deleteCancelBtn').addEventListener('click', closeDeleteModal);
$('#deleteConfirmModal').addEventListener('click', (e) => {
  if (e.target === $('#deleteConfirmModal')) closeDeleteModal();
});

function closeDeleteModal() {
  $('#deleteConfirmModal').classList.remove('visible');
  document.body.style.overflow = '';
  clipToDelete = null;
}

$('#deleteConfirmBtn').addEventListener('click', async () => {
  if (!clipToDelete) return;
  const id = clipToDelete;
  closeDeleteModal();

  try {
    const res = await fetch(`/api/clips/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      notify('Клип удалён');
      await loadClips();
      if (currentPage === 'animator-profile' && currentAnimatorProfile) {
        renderAnimatorProfile(currentAnimatorProfile);
      }
    } else {
      notify(data.error || 'Ошибка при удалении', true);
    }
  } catch (err) {
    notify('Ошибка сети при удалении', true);
  }
});

// ===== INIT =====
loadClips();
