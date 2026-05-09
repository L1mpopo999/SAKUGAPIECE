// ===== I18N (RU/EN) =====
let LANG = localStorage.getItem('sp_lang') || 'ru';

const I18N = {
  // Navigation
  nav_browse: { ru: 'Главная', en: 'Main' },
  nav_episodes: { ru: 'Серии', en: 'Episodes' },
  nav_animators: { ru: 'Аниматоры', en: 'Animators' },
  nav_about: { ru: 'О сайте', en: 'About' },
  nav_upload: { ru: '+ Загрузить', en: '+ Upload' },

  // Hero / search
  hero_title_main: { ru: 'ONE PIECE', en: 'ONE PIECE' },
  hero_title_accent: { ru: 'SAKUGA', en: 'SAKUGA' },
  hero_title_tail: { ru: 'ARCHIVE', en: 'ARCHIVE' },
  hero_subtitle: { ru: 'Клипы с сакугой из One Piece в высоком качестве — поиск по аниматорам, аркам и эпизодам', en: 'High-quality sakuga clips from One Piece — search by animator, arc and episode' },
  search_placeholder: { ru: 'Поиск по аниматорам, эпизодам, аркам...', en: 'Search animators, episodes, arcs...' },

  // Filter chips
  filter_all: { ru: 'ВСЕ', en: 'ALL' },
  filter_video: { ru: 'ВИДЕО', en: 'VIDEO' },
  filter_photo: { ru: 'ФОТО', en: 'PHOTO' },
  filter_photo_arts: { ru: 'Фото / Арты', en: 'Photos / Arts' },
  filter_sections: { ru: 'РАЗДЕЛЫ ▾', en: 'CATEGORIES ▾' },
  filter_views: { ru: 'ПРОСМОТРЫ', en: 'VIEWS' },

  // Episodes page
  episodes_title: { ru: 'СЕРИИ', en: 'EPISODES' },
  episodes_subtitle: { ru: 'Все серии с сакуга-моментами — от 890 до последних', en: 'All episodes with sakuga moments — from 890 to latest' },
  episodes_search_placeholder: { ru: 'Найти серию...', en: 'Find episode...' },
  episodes_sort_clips: { ru: 'По клипам', en: 'By clips' },
  episodes_sort_number: { ru: 'По номеру', en: 'By number' },
  episodes_arc_all: { ru: 'Все арки', en: 'All arcs' },
  episodes_director_filter: { ru: 'Режиссёр ▾', en: 'Director ▾' },
  episodes_director_all: { ru: 'Все', en: 'All' },
  episodes_not_found: { ru: 'Серии не найдены', en: 'No episodes found' },
  episodes_add: { ru: 'Добавить серию', en: 'Add episode' },
  episodes_no_clips: { ru: 'Пока нет клипов для этой серии', en: 'No clips in this episode yet' },
  episodes_back: { ru: 'Все серии', en: 'All episodes' },

  // Animators page
  animators_title: { ru: 'АНИМАТОРЫ', en: 'ANIMATORS' },
  animators_title_main: { ru: 'АНИМАТОР', en: 'ANIM' },
  animators_title_accent: { ru: 'Ы', en: 'ATORS' },
  animators_subtitle: { ru: 'Все аниматоры, работавшие над сакуга-моментами One Piece', en: 'All animators who worked on One Piece sakuga moments' },
  animators_search_placeholder: { ru: 'Найти аниматора...', en: 'Find animator...' },
  animators_add: { ru: 'Добавить аниматора', en: 'Add animator' },
  animators_not_found: { ru: 'Аниматоры не найдены', en: 'No animators found' },
  animators_back: { ru: 'Все аниматоры', en: 'All animators' },
  animators_no_clips: { ru: 'Пока нет клипов с этим аниматором', en: 'No clips with this animator yet' },

  // Director (on episode profile)
  director_label: { ru: 'РЕЖИССЁР:', en: 'DIRECTOR:' },
  director_short_label: { ru: 'ED:', en: 'ED:' },

  // Counters / units
  unit_clips_few: { ru: 'клипа', en: 'clips' },
  unit_clips_many: { ru: 'клипов', en: 'clips' },
  unit_clips_one: { ru: 'клип', en: 'clip' },
  unit_animators_few: { ru: 'аниматора', en: 'animators' },
  unit_animators_many: { ru: 'аниматоров', en: 'animators' },
  unit_animators_one: { ru: 'аниматор', en: 'animator' },

  // About page
  about_title_main: { ru: 'О ', en: 'ABOUT ' },
  about_title_accent: { ru: 'САЙТЕ', en: 'THE SITE' },
  about_p1: { ru: '<strong>Sakuga Piece</strong> — это архив сакуга-моментов (моментов с выдающейся анимацией) из аниме One Piece.', en: '<strong>Sakuga Piece</strong> is an archive of sakuga moments (scenes with outstanding animation) from the One Piece anime.' },
  about_p2: { ru: 'Цель проекта — собрать все значимые сакуга-моменты в высоком качестве с привязкой к аниматорам, эпизодам и аркам. В отличие от других ресурсов, здесь все клипы в HD.', en: 'The goal is to collect every notable sakuga moment in high quality with proper attribution to animators, episodes and arcs. Unlike other resources, all clips here are in HD.' },
  about_p3: { ru: 'Сайт не аффилирован с Toei Animation или Эйитиро Одой. Все права на аниме One Piece принадлежат их правообладателям.', en: 'This site is not affiliated with Toei Animation or Eiichiro Oda. All rights to the One Piece anime belong to their respective owners.' },
  about_h_howto: { ru: 'Как пользоваться', en: 'How to use' },
  about_browse: { ru: '<strong>Обзор</strong> — все загруженные клипы. Здесь работает поиск по аниматорам, аркам, эпизодам и тегам, а также фильтры по разделам и сортировка.', en: '<strong>Browse</strong> — all uploaded clips. Search by animator, arc, episode and tag; filters by category and sorting.' },
  about_episodes: { ru: '<strong>Серии</strong> — список всех серий, в которых есть сакуга-моменты. Можно фильтровать по аркам и режиссёрам. Нажмите на карточку, чтобы увидеть все клипы из этой серии.', en: '<strong>Episodes</strong> — all episodes that contain sakuga moments. Filter by arc or director. Click a card to see all clips from that episode.' },
  about_animators: { ru: '<strong>Аниматоры</strong> — список всех аниматоров. Нажмите на карточку, чтобы увидеть все клипы этого аниматора.', en: '<strong>Animators</strong> — list of all animators. Click a card to see every clip by that animator.' },
  about_comments: { ru: '<strong>Комментарии</strong> — у каждого клипа можно оставить комментарий, указав ник.', en: '<strong>Comments</strong> — leave a comment under any clip with a nickname.' },
  about_h_keys: { ru: 'Горячие клавиши', en: 'Keyboard shortcuts' },
  about_keys: { ru: '<kbd>/</kbd> — фокус на поиске &nbsp;&nbsp; <kbd>Esc</kbd> — закрыть окна', en: '<kbd>/</kbd> — focus search &nbsp;&nbsp; <kbd>Esc</kbd> — close dialogs' },
  about_admin_note: { ru: 'Загружать новые клипы может только администратор сайта. Если у вас есть редкая или неучтённая сакуга и вы хотите её добавить — напишите автору в Telegram (ссылка вверху страницы).', en: 'Only site admins can upload new clips. If you have a rare or missing sakuga moment and want to add it — message the author on Telegram (link at the top).' },

  // Pagination
  pagination_prev: { ru: '← Назад', en: '← Prev' },
  pagination_next: { ru: 'Вперёд →', en: 'Next →' },

  // Player / clip page
  back_to_browse: { ru: 'На главную', en: 'Back to browse' },
  timecodes_title: { ru: 'Таймкоды аниматоров', en: 'Animator timecodes' },
  player_frame: { ru: 'Кадр', en: 'Frame' },
  comments_title: { ru: 'Комментарии', en: 'Comments' },
  comment_placeholder: { ru: 'Написать комментарий...', en: 'Write a comment...' },
  comment_nick_placeholder: { ru: 'Ваш ник', en: 'Nickname' },
  comment_send: { ru: 'Отправить', en: 'Send' },
  comment_no_comments: { ru: 'Пока нет комментариев. Будьте первым!', en: 'No comments yet. Be the first!' },
  comment_edit: { ru: 'Изменить', en: 'Edit' },
  comment_delete: { ru: 'Удалить', en: 'Delete' },
  comment_save: { ru: 'Сохранить', en: 'Save' },
  comment_cancel: { ru: 'Отмена', en: 'Cancel' },

  // Footer
  footer_text: { ru: 'SAKUGA PIECE — Архив анимации One Piece — Не аффилирован с Toei Animation или Эйитиро Одой', en: 'SAKUGA PIECE — One Piece Animation Archive — Not affiliated with Toei Animation or Eiichiro Oda' },

  // Tag labels (override TAG_RU when in EN)
  tag_fighting: { ru: 'бой', en: 'fighting' },
  tag_effects: { ru: 'эффекты', en: 'effects' },
  tag_character_acting: { ru: 'эктинг', en: 'character acting' },
  tag_transformation: { ru: 'трансформация', en: 'transformation' },
  tag_gear5: { ru: 'gear 5', en: 'gear 5' },
  tag_haki: { ru: 'хаки', en: 'haki' },

  // Misc
  loading: { ru: 'Загрузка...', en: 'Loading...' },
  hidden_label: { ru: '(скрыта)', en: '(hidden)' },

  // Admin login modal (still RU-only conceptually but the modal itself can be bilingual)
  admin_modal_title: { ru: 'Вход для админа', en: 'Admin login' },
  admin_login_btn: { ru: 'Войти', en: 'Sign in' },
  admin_modal_error: { ru: 'Неверный логин или пароль', en: 'Invalid login or password' },
  login_username_label: { ru: 'Логин', en: 'Username' },
  login_password_label: { ru: 'Пароль', en: 'Password' }
};

function t(key) {
  const entry = I18N[key];
  if (!entry) return key;
  return entry[LANG] || entry.ru || key;
}

// Pluralization that respects current language.
// In RU it picks the right grammatical form; in EN it returns singular for 1, else plural.
function pluralClips(n) {
  if (LANG === 'en') return n === 1 ? t('unit_clips_one') : t('unit_clips_many');
  const m = n % 10, h = n % 100;
  if (m === 1 && h !== 11) return t('unit_clips_one');
  if (m >= 2 && m <= 4 && (h < 12 || h > 14)) return t('unit_clips_few');
  return t('unit_clips_many');
}
function pluralAnimators(n) {
  if (LANG === 'en') return n === 1 ? t('unit_animators_one') : t('unit_animators_many');
  const m = n % 10, h = n % 100;
  if (m === 1 && h !== 11) return t('unit_animators_one');
  if (m >= 2 && m <= 4 && (h < 12 || h > 14)) return t('unit_animators_few');
  return t('unit_animators_many');
}

// Apply translations to all DOM elements with data-i18n / data-i18n-html / data-i18n-placeholder / data-i18n-title
function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  // Update language toggle button label
  const btn = document.getElementById('langToggleBtn');
  if (btn) btn.textContent = LANG === 'ru' ? 'EN' : 'RU';
}

function setLang(lang) {
  if (lang !== 'ru' && lang !== 'en') return;
  LANG = lang;
  localStorage.setItem('sp_lang', lang);
  applyI18n();
  // Re-render dynamic parts that include translated strings.
  // applyFilters() normally resets pagination to page 1. Preserve the user's
  // current page so a language toggle on page 8 doesn't bounce them to page 1.
  if (typeof applyFilters === 'function' && currentPage === 'browse') {
    const savedPage = currentPage_clips;
    applyFilters();
    if (savedPage > 1) {
      currentPage_clips = savedPage;
      renderClipPage_browse();
    }
  }
  if (typeof renderEpisodeGrid === 'function' && currentPage === 'episodes') renderEpisodeGrid();
  if (typeof renderAnimatorGrid === 'function' && currentPage === 'animators') renderAnimatorGrid();
  if (typeof renderEpisodeProfile === 'function' && currentPage === 'episode-profile' && currentEpisodeProfile) renderEpisodeProfile(currentEpisodeProfile);
  if (typeof renderAnimatorProfile === 'function' && currentPage === 'animator-profile' && currentAnimatorProfile) renderAnimatorProfile(currentAnimatorProfile);
  if (typeof renderFilterChips === 'function') renderFilterChips();
  // Standalone /clip/... page is built imperatively, so re-render it too.
  // Preserve playback position and play/pause state across the re-render.
  if (currentClipPage && /^\/clip\/\d+/.test(window.location.pathname)) {
    const oldVideo = document.getElementById('clipPageVideo');
    const savedTime = oldVideo ? oldVideo.currentTime : 0;
    const wasPlaying = oldVideo ? !oldVideo.paused : false;
    renderClipPage(currentClipPage);
    const newVideo = document.getElementById('clipPageVideo');
    if (newVideo && savedTime > 0) {
      // The new <video> has autoplay; we just need to seek to where we were.
      const restore = () => {
        try { newVideo.currentTime = savedTime; } catch {}
        if (!wasPlaying) { try { newVideo.pause(); } catch {} }
      };
      if (newVideo.readyState >= 1) restore();
      else newVideo.addEventListener('loadedmetadata', restore, { once: true });
    } else if (newVideo && !wasPlaying) {
      try { newVideo.pause(); } catch {}
    }
  }
}

// Returns the title to display for a clip based on current language.
// EN mode falls back to the RU title if titleEn is empty, so nothing disappears.
function clipTitle(clip) {
  if (!clip) return '';
  if (LANG === 'en' && clip.titleEn && clip.titleEn.trim()) return clip.titleEn;
  return clip.title || '';
}

// Same idea for the description/notes field — fall back to RU if no EN provided.
function clipNotes(clip) {
  if (!clip) return '';
  if (LANG === 'en' && clip.notesEn && clip.notesEn.trim()) return clip.notesEn;
  return clip.notes || '';
}

// Returns the display label for a filter (tag/arc/section), language-aware.
// Falls back to RU label when English is missing.
function filterLabel(f) {
  if (!f) return '';
  if (LANG === 'en' && f.labelEn && f.labelEn.trim()) return f.labelEn;
  return f.label || f.id || '';
}

// ===== ANIMATORS & FILTERS — loaded from server =====
let ANIMATORS = [];
let FILTERS = [];
let EPISODES_DATA = { hidden: [], renamed: {} };
let HIDDEN_ANIMATORS = [];
let DIRECTORS = [];
let EPISODE_DIRECTORS = {}; // { "1015": "Megumi Ishitani", ... }

async function loadAnimatorsAndFilters() {
  // Cache-bust to make sure we get fresh data after admin edits.
  // Without this, the browser may serve a cached /api/filters response and
  // newly-saved fields (like descriptionEn) won't appear immediately.
  const bust = '?_=' + Date.now();
  try { ANIMATORS = await (await fetch('/api/animators' + bust)).json(); } catch { ANIMATORS = []; }
  try { FILTERS = await (await fetch('/api/filters' + bust)).json(); } catch { FILTERS = []; }
  try { EPISODES_DATA = await (await fetch('/api/episodes' + bust)).json(); } catch { EPISODES_DATA = { hidden: [], renamed: {} }; }
  try { HIDDEN_ANIMATORS = await (await fetch('/api/animators/hidden' + bust)).json(); } catch { HIDDEN_ANIMATORS = []; }
  try { DIRECTORS = await (await fetch('/api/directors' + bust)).json(); } catch { DIRECTORS = []; }
  try { EPISODE_DIRECTORS = await (await fetch('/api/episode-directors' + bust)).json(); } catch { EPISODE_DIRECTORS = {}; }
}

// Helper: normalize director value (legacy string or array) to a clean string array.
function _toDirectorArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
  return String(value).split(',').map(s => s.trim()).filter(Boolean);
}

// Returns the effective director(s) for a clip as an array.
// Priority: clip-level override > episode-level directors > [].
function getClipDirector(clip) {
  if (!clip) return [];
  if (clip.directorOverride) return _toDirectorArray(clip.directorOverride);
  const ep = (clip.episode || '').trim();
  return _toDirectorArray(EPISODE_DIRECTORS[ep]);
}
// Returns directors of an episode as an array.
function getEpisodeDirector(ep) {
  return _toDirectorArray(EPISODE_DIRECTORS[String(ep).trim()]);
}

// ===== STATE =====
let allClips = [];
let currentTypeFilter = 'all'; // all, type:video, type:images
let currentTagFilter = null;   // null or tag id
let currentArcFilter = null;   // null or arc name
let currentSort = 'newest';
let selectedFile = null;
let selectedImages = [];
let selectedThumbnail = null;
let selectedAnimators = [];
let editSelectedAnimators = [];
let currentPage = 'browse';
let currentAnimatorProfile = null;
let currentEpisodeProfile = null;
// Current clip rendered as a standalone /clip/... page. Kept so we can re-render
// when language changes (or other state requires it).
let currentClipPage = null;
let isAdmin = false;
let isOwner = false;
let canBackup = false;
let currentUsername = null;
let clipToDelete = null;
let viewerImages = [];
let viewerIndex = 0;

let adminToken = null;
let commentCounts = {};
// Likes: counts by clipId, plus the set of clipIds the current user has liked.
// Persisted server-side; we just cache it client-side for instant UI feedback.
let likeCounts = {};
let likedByMe = new Set();

// ===== HELPERS =====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const TAG_RU = {fighting:'бой',effects:'эффекты',character_acting:'эктинг',transformation:'трансформация',gear5:'gear 5',haki:'хаки'};
function tagLabel(tag){
  // Use I18N entry if present (so it follows current language), else fall back to RU map, else raw key.
  const key = 'tag_' + tag;
  if (I18N[key]) return t(key);
  return TAG_RU[tag] || tag;
}
function pluralRu(n){const m=n%10,h=n%100;if(m===1&&h!==11)return'';if(m>=2&&m<=4&&(h<12||h>14))return'а';return'ов'}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML}
function getInitials(n){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
function adminHeaders(extra={}){return{'X-Admin-Token':adminToken||'',...extra}}
// Возвращает приоритет совпадения строки с запросом:
// 0 — нет совпадения; 3 — строка начинается с запроса; 2 — слово в строке начинается с запроса; 1 — запрос встречается внутри
function matchScore(str, q){
  if(!q) return 1;
  const s = str.toLowerCase();
  const ql = q.toLowerCase();
  if(s.startsWith(ql)) return 3;
  if(s.split(/\s+/).some(w => w.startsWith(ql))) return 2;
  if(s.includes(ql)) return 1;
  return 0;
}

// ===== PAGE NAVIGATION =====
// Stop all playing media on the page. Called whenever we navigate away,
// so videos in old views (e.g. the clip page) don't keep playing in the background.
// Also fully removes the dynamically-created clip-page div, because its <video>
// has <source> children that survive removeAttribute('src') + load() and would
// auto-play again.
function stopAllMedia() {
  document.querySelectorAll('video, audio').forEach(el => {
    try {
      el.pause();
      el.removeAttribute('src');
      // Also clear any <source> children, otherwise load() would re-arm autoplay
      el.querySelectorAll('source').forEach(s => s.removeAttribute('src'));
      el.load();
    } catch {}
  });
  // Drop the dynamically-created clip page entirely if it exists
  document.querySelectorAll('.page.clip-page').forEach(el => el.remove());
  // Also clear the cached current-clip pointer; otherwise setLang would try
  // to re-render a page that's no longer on screen.
  currentClipPage = null;
}

function navigateTo(page, data) {
  stopAllMedia();
  currentPage = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-link').forEach(l => l.classList.remove('active'));
  const el = $(`#page-${page}`);
  if (el) el.classList.add('active');
  const nav = $(`.nav-link[data-page="${page}"]`);
  if (nav) nav.classList.add('active');
  if (page === 'animator-profile' && data) {
    currentAnimatorProfile = data;
    animatorProfileFilter = 'all';
    $(`.nav-link[data-page="animators"]`).classList.add('active');
    renderAnimatorProfile(data);
  }
  if (page === 'episode-profile' && data) {
    $(`.nav-link[data-page="episodes"]`).classList.add('active');
    currentEpisodeProfile = data;
    renderEpisodeProfile(data);
  }
  if (page === 'animators') renderAnimatorGrid();
  if (page === 'episodes') renderEpisodeGrid();
  // Update URL hash. Special case: if we're on a /clip/... pathname (the standalone
  // clip page) and we navigate elsewhere, we must change the pathname too — otherwise
  // the user stays on /clip/123#animators and reloading would bring back the clip.
  const onClipPath = /^\/clip\/\d+/.test(window.location.pathname);
  if (onClipPath) {
    let target = '/';
    if (page === 'animator-profile' && data) target = '/#animator/' + encodeURIComponent(data);
    else if (page === 'episode-profile' && data) target = '/#episode/' + encodeURIComponent(data);
    else if (page !== 'browse') target = '/#' + page;
    window.history.pushState({page, data}, '', target);
  } else if (page === 'browse') window.history.pushState({page}, '', '#');
  else if (page === 'animator-profile' && data) window.history.pushState({page, data}, '', '#animator/' + encodeURIComponent(data));
  else if (page === 'episode-profile' && data) window.history.pushState({page, data}, '', '#episode/' + encodeURIComponent(data));
  else window.history.pushState({page}, '', '#' + page);
  window.scrollTo(0, 0);
}

// Handle browser back/forward button
window.addEventListener('popstate', () => {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('animator/')) {
    navigateToSilent('animator-profile', decodeURIComponent(hash.slice(9)));
  } else if (hash.startsWith('episode/')) {
    navigateToSilent('episode-profile', decodeURIComponent(hash.slice(8)));
  } else if (hash === 'episodes') {
    navigateToSilent('episodes');
  } else if (hash === 'animators') {
    navigateToSilent('animators');
  } else if (hash === 'about') {
    navigateToSilent('about');
  } else if (hash.startsWith('p=')) {
    // Browse page with pagination state
    const pageNum = parseInt(hash.slice(2));
    navigateToSilent('browse');
    if (pageNum && pageNum > 1) {
      currentPage_clips = pageNum;
      renderClipPage_browse();
    }
  } else {
    navigateToSilent('browse');
  }
});

// Same as navigateTo but without pushState (to avoid infinite loop)
function navigateToSilent(page, data) {
  stopAllMedia();
  currentPage = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-link').forEach(l => l.classList.remove('active'));
  const el = $(`#page-${page}`);
  if (el) el.classList.add('active');
  const nav = $(`.nav-link[data-page="${page}"]`);
  if (nav) nav.classList.add('active');
  if (page === 'animator-profile' && data) {
    currentAnimatorProfile = data;
    animatorProfileFilter = 'all';
    $(`.nav-link[data-page="animators"]`).classList.add('active');
    renderAnimatorProfile(data);
  }
  if (page === 'episode-profile' && data) {
    $(`.nav-link[data-page="episodes"]`).classList.add('active');
    currentEpisodeProfile = data;
    renderEpisodeProfile(data);
  }
  if (page === 'animators') renderAnimatorGrid();
  if (page === 'episodes') renderEpisodeGrid();
  window.scrollTo(0, 0);
}

$$('.nav-link[data-page]').forEach(b => b.addEventListener('click', () => navigateTo(b.dataset.page)));
$('#backToAnimatorsBtn').addEventListener('click', () => navigateTo('animators'));

// ===== LOAD CLIPS =====
async function loadClips() {
  try { allClips = await (await fetch('/api/clips')).json(); } catch { allClips = []; }
  try { commentCounts = await (await fetch('/api/comments/counts')).json(); } catch { commentCounts = {}; }
  try { likeCounts = await (await fetch('/api/likes/counts')).json(); } catch { likeCounts = {}; }
  // Restore "what I've liked" set from localStorage (server tracks per-token authoritatively;
  // local cache makes the heart show as filled on re-visit without an extra API roundtrip)
  try { likedByMe = new Set(JSON.parse(localStorage.getItem('sp_liked') || '[]')); } catch { likedByMe = new Set(); }
  applyFilters();
}

// Toggle a like on the server. Optimistically updates local state and re-renders
// any visible card/page so the heart fills instantly.
async function toggleLike(clipId) {
  const id = String(clipId);
  const userToken = getUserToken();
  // Optimistic update
  const wasLiked = likedByMe.has(id);
  if (wasLiked) {
    likedByMe.delete(id);
    likeCounts[id] = Math.max(0, (likeCounts[id] || 1) - 1);
  } else {
    likedByMe.add(id);
    likeCounts[id] = (likeCounts[id] || 0) + 1;
  }
  // Reflect in DOM right away
  const updateBtn = (btn, liked, count) => {
    btn.classList.toggle('liked', liked);
    const countEl = btn.querySelector('.like-count');
    if (countEl) countEl.textContent = count;
    const labelEl = btn.querySelector('.like-label');
    if (labelEl) {
      labelEl.textContent = LANG === 'en'
        ? (liked ? 'Liked' : 'Like')
        : (liked ? 'Нравится' : 'Лайк');
    }
  };
  document.querySelectorAll(`[data-like-clip="${id}"]`).forEach(btn => updateBtn(btn, !wasLiked, likeCounts[id] || 0));
  try {
    const r = await fetch(`/api/clips/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userToken })
    });
    const d = await r.json();
    // Server-authoritative: sync our state to whatever it returns
    if (d && typeof d.count === 'number') {
      likeCounts[id] = d.count;
      if (d.liked) likedByMe.add(id); else likedByMe.delete(id);
      document.querySelectorAll(`[data-like-clip="${id}"]`).forEach(btn => updateBtn(btn, !!d.liked, d.count));
      try { localStorage.setItem('sp_liked', JSON.stringify([...likedByMe])); } catch {}
    }
  } catch {
    // Roll back optimistic update on failure
    if (wasLiked) { likedByMe.add(id); likeCounts[id] = (likeCounts[id] || 0) + 1; }
    else { likedByMe.delete(id); likeCounts[id] = Math.max(0, (likeCounts[id] || 1) - 1); }
    notify(LANG === 'en' ? 'Failed to like' : 'Не удалось поставить лайк', true);
  }
}

// ===== CLIP CARD =====
function renderClipCard(clip, i) {
  const hasVideo = !!clip.videoUrl;
  const hasImages = clip.images && clip.images.length > 0;
  const hasThumbnail = !!clip.thumbnailUrl;

  const thumbContent = hasThumbnail
    ? `<img src="${clip.thumbnailUrl}" alt="" loading="lazy">`
    : hasImages
      ? `<img src="${clip.images[0].url}" alt="" loading="lazy">`
      : `<div class="clip-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>`;

  const badge = hasVideo ? (clip.quality || '1080p') : (hasImages ? (LANG==='en'?'PHOTO':'ФОТО') : '');
  const imgCount = hasImages && clip.images.length > 1 ? `<span class="clip-img-count">${clip.images.length} ${LANG==='en'?'photos':'фото'}</span>` : '';

  const shouldOpenNewTab = hasVideo || (hasImages && clip.images.length > 4);
  const cardTag = shouldOpenNewTab
    ? `<a class="clip-card" href="/clip/${clip.id}" data-id="${clip.id}" style="animation-delay:${i*0.04}s">`
    : hasImages
      ? `<div class="clip-card clip-card-lightbox" data-id="${clip.id}" data-images='${JSON.stringify(clip.images.map(img=>img.url))}' style="animation-delay:${i*0.04}s;cursor:pointer">`
      : `<a class="clip-card" href="/clip/${clip.id}" data-id="${clip.id}" style="animation-delay:${i*0.04}s">`;
  const cardClose = (hasImages && !shouldOpenNewTab) ? '</div>' : '</a>';

  return `${cardTag}
    <div class="clip-thumb">
      <button class="admin-delete-btn" data-delete-id="${clip.id}" title="Удалить">&times;</button>
      <button class="admin-edit-btn" data-edit-id="${clip.id}" title="Редактировать">✎</button>
      ${thumbContent}
      ${clip.duration ? `<span class="clip-duration">${clip.duration}</span>` : ''}
      ${badge ? `<span class="clip-hd-badge">${badge}</span>` : ''}
      ${likeCounts[clip.id] ? `<span class="clip-like-badge"><span class="clip-like-badge-heart">♥</span> ${likeCounts[clip.id]}</span>` : ''}
      ${imgCount}
      ${hasVideo
        ? `<div class="clip-play-overlay"><div class="play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg></div></div>`
        : `<div class="clip-hover-dim"></div>`}
    </div>
    <div class="clip-info">
      <div class="clip-title">${esc(clipTitle(clip))}</div>
      <div class="clip-title-bar"></div>
      <div class="clip-meta"><span>${LANG==='en'?'Ep.':'Эп.'} ${esc(clip.episode)}</span><span class="clip-meta-divider">·</span><span>${esc(clip.arc)}</span>${clip.views ? `<span class="clip-meta-divider">·</span><span class="clip-views"><svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>${clip.views}</span>` : ''}${commentCounts[clip.id] ? `<span class="clip-meta-divider">·</span><span class="clip-views"><svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>${commentCounts[clip.id]}</span>` : ''}</div>
      <div class="clip-info-separator"></div>
      <div class="clip-tags" data-clip-id="${clip.id}">
        ${clip.animators.map(a => `<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
        ${clip.tags.slice(0,2).map(tg => `<span class="clip-tag category">${esc(tagLabel(tg))}</span>`).join('')}
        ${clip.episode ? `<span class="clip-tag category">${esc(clip.episode)}</span>` : ''}
      </div>
      <div class="clip-info-tail"></div>
    </div>
  ${cardClose}`;
}

function attachClipEvents(container) {
  // Add "..." buttons to overflowing tag containers
  container.querySelectorAll('.clip-tags').forEach(tagsEl => {
    if (tagsEl.scrollHeight > tagsEl.clientHeight + 2) {
      const moreBtn = document.createElement('span');
      moreBtn.className = 'clip-tag clip-tags-more';
      moreBtn.textContent = '...';
      tagsEl.appendChild(moreBtn);
    }
  });

  container.querySelectorAll('.clip-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.clip-tags-more')) {
        e.preventDefault();
        e.stopPropagation();
        const tagsContainer = e.target.closest('.clip-tags');
        tagsContainer.classList.toggle('expanded');
        const moreBtn = tagsContainer.querySelector('.clip-tags-more');
        if (tagsContainer.classList.contains('expanded')) {
          moreBtn.textContent = '▲';
        } else {
          moreBtn.textContent = '...';
        }
        return;
      }
      if (e.target.closest('.admin-delete-btn')) { e.preventDefault(); e.stopPropagation(); confirmDeleteClip(parseInt(e.target.closest('.admin-delete-btn').dataset.deleteId)); return; }
      if (e.target.closest('.admin-edit-btn')) { e.preventDefault(); e.stopPropagation(); openEditModal(parseInt(e.target.closest('.admin-edit-btn').dataset.editId)); return; }
      if (e.target.closest('.clip-tag.animator')) {
        e.preventDefault(); e.stopPropagation();
        navigateTo('animator-profile', e.target.closest('.clip-tag.animator').dataset.animator);
        return;
      }
      if (e.target.closest('.clip-tag.category')) {
        e.preventDefault(); e.stopPropagation();
        const tagText = e.target.closest('.clip-tag.category').textContent.trim();
        // Try to find matching filter
        const filter = FILTERS.find(f => f.label.toLowerCase() === tagText.toLowerCase() || (f.labelEn && f.labelEn.toLowerCase() === tagText.toLowerCase()) || f.id.toLowerCase() === tagText.toLowerCase());
        if (filter) {
          if (filter.type === 'arc') { currentArcFilter = filter.id; currentTagFilter = null; }
          else { currentTagFilter = filter.id; }
          currentTypeFilter = 'all';
          renderFilterChips();
          applyFilters();
        } else {
          // Could be episode number — search for it
          $('#searchInput').value = tagText;
          applyFilters();
        }
        return;
      }
      // Lightbox for small photo posts
      if (card.classList.contains('clip-card-lightbox')) {
        e.preventDefault();
        e.stopPropagation();
        const images = JSON.parse(card.dataset.images || '[]');
        if (images.length) {
          fetch(`/api/clips/${card.dataset.id}/view`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userToken:getUserToken()})}).catch(()=>{});
          openClipPageImageViewer(images, 0);
        }
        return;
      }
    });
  });
}

const CLIPS_PER_PAGE = 32;
let currentClipList = [];
let currentPage_clips = 1;

function renderClips(clips) {
  currentClipList = clips;
  currentPage_clips = 1;
  // If URL had a #p=N from a previous state, clear it (filters changed → start from page 1)
  if (window.location.hash.startsWith('#p=')) {
    try { window.history.replaceState({ page: 'browse' }, '', '#'); } catch {}
  }
  renderClipPage_browse();
}

function renderClipPage_browse() {
  const grid = $('#clipGrid');
  const total = currentClipList.length;
  const totalPages = Math.ceil(total / CLIPS_PER_PAGE);
  const page = Math.min(currentPage_clips, totalPages || 1);
  currentPage_clips = page;
  
  $('#resultsCount').textContent = `${total} ${pluralClips(total)}`;
  
  if (!total) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted);font-size:1rem">${LANG==='en'?'No clips found':'Клипы не найдены'}</p></div>`;
    // Remove any existing pagination
    document.querySelectorAll('.pagination').forEach(p => p.remove());
    return;
  }
  
  const start = (page - 1) * CLIPS_PER_PAGE;
  const batch = currentClipList.slice(start, start + CLIPS_PER_PAGE);
  grid.innerHTML = batch.map((c, i) => renderClipCard(c, i)).join('');
  attachClipEvents(grid);
  
  // Render pagination
  const paginationHtml = renderPagination(page, totalPages);
  
  // Remove old pagination
  document.querySelectorAll('.pagination').forEach(p => p.remove());
  
  // Add pagination above and below grid
  const gridContainer = grid.closest('.grid-container');
  if (gridContainer) {
    gridContainer.insertAdjacentHTML('afterbegin', paginationHtml);
    gridContainer.insertAdjacentHTML('beforeend', paginationHtml);
  }
  
  // Attach pagination events
  document.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage_clips = parseInt(btn.dataset.page);
      // Save current page to URL (replaceState — keeps single history entry for browse)
      try {
        const newHash = currentPage_clips > 1 ? `#p=${currentPage_clips}` : '#';
        if (window.location.hash !== newHash && !(currentPage_clips === 1 && window.location.hash === '')) {
          window.history.replaceState({ page: 'browse', clipsPage: currentPage_clips }, '', newHash);
        }
      } catch {}
      renderClipPage_browse();
      window.scrollTo(0, 0);
    });
  });
}

function renderPagination(current, total) {
  if (total <= 1) return '';
  let btns = [];
  
  btns.push(`<button class="pagination-btn${current<=1?' disabled':''}" data-page="${current-1}">${t("pagination_prev")}</button>`);
  
  // Always show first page
  btns.push(`<button class="pagination-btn${current===1?' active':''}" data-page="1">1</button>`);
  
  if (current > 4) btns.push(`<span class="pagination-dots">...</span>`);
  
  // Pages around current
  for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
    btns.push(`<button class="pagination-btn${current===i?' active':''}" data-page="${i}">${i}</button>`);
  }
  
  if (current < total - 3) btns.push(`<span class="pagination-dots">...</span>`);
  
  // Always show last page
  if (total > 1) btns.push(`<button class="pagination-btn${current===total?' active':''}" data-page="${total}">${total}</button>`);
  
  btns.push(`<button class="pagination-btn${current>=total?' disabled':''}" data-page="${current+1}">${t("pagination_next")}</button>`);
  
  return `<div class="pagination">${btns.join('')}</div>`;
}

// ===== FILTERS =====
function applyFilters() {
  const q = ($('#searchInput')?.value||'').toLowerCase().trim();
  let clips = allClips;
  
  // Type filter
  if (currentTypeFilter === 'type:video') {
    clips = clips.filter(c => c.videoUrl);
  } else if (currentTypeFilter === 'type:images') {
    clips = clips.filter(c => !c.videoUrl && c.images && c.images.length > 0);
  }
  
  // Tag filter
  if (currentTagFilter) {
    clips = clips.filter(c => c.tags.includes(currentTagFilter));
  }
  
  // Arc filter
  if (currentArcFilter) {
    clips = clips.filter(c => c.arc.toLowerCase() === currentArcFilter.toLowerCase());
  }
  
  if (q) clips = clips.filter(c => c.title.toLowerCase().includes(q) || (c.titleEn && c.titleEn.toLowerCase().includes(q)) || c.animators.some(a=>a.toLowerCase().includes(q)) || c.tags.some(t=>t.toLowerCase().includes(q)) || c.arc.toLowerCase().includes(q) || c.episode.includes(q));
  
  // Sort
  if (currentSort === 'views') {
    clips = [...clips].sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (currentSort === 'likes') {
    // When sorting by likes, hide clips with zero likes — keeps the page focused
    // on what people actually liked. Once everything has zero likes the user
    // will just see "no results", which is correct behavior.
    clips = clips.filter(c => (likeCounts[c.id] || 0) > 0)
                 .sort((a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0));
  }
  
  // Show filter description
  const descEl = $('#filterDescription');
  if (descEl) {
    const filter = FILTERS.find(f => f.id === currentTagFilter);
    // Pick the right description for current language; fall back to RU if EN missing.
    const localizedDesc = filter
      ? ((LANG === 'en' && filter.descriptionEn && filter.descriptionEn.trim())
          ? filter.descriptionEn
          : (filter.description || ''))
      : '';
    if (filter && localizedDesc) {
      const text = esc(localizedDesc).replace(/\n/g, '<br>');
      // Show the section's localized name as a big left-aligned title, with
      // the description on the right. Looks like a proper section header.
      const sectionName = esc(filterLabel(filter));
      descEl.innerHTML = `<div class="filter-desc-card">
        <div class="filter-desc-name">${sectionName}</div>
        <div class="filter-desc-text">${text}</div>
        ${isAdmin ? `<button class="filter-desc-edit" id="editFilterDescBtn" title="Редактировать">${LANG === 'en' ? 'Edit' : 'Изменить'}</button>` : ''}
      </div>`;
      descEl.style.display = '';
      const editBtn = descEl.querySelector('#editFilterDescBtn');
      if (editBtn) editBtn.addEventListener('click', () => editFilterDescription(currentTagFilter));
    } else if (isAdmin && currentTagFilter) {
      descEl.innerHTML = `<button class="filter-desc-add" id="addFilterDescBtn">+ ${LANG === 'en' ? 'Add description' : 'Добавить описание'}</button>`;
      descEl.style.display = '';
      descEl.querySelector('#addFilterDescBtn').addEventListener('click', () => editFilterDescription(currentTagFilter));
    } else {
      descEl.innerHTML = '';
      descEl.style.display = 'none';
    }
  }
  
  renderClips(clips);
}

async function editFilterDescription(filterId) {
  const filter = FILTERS.find(f => f.id === filterId);
  const currentRu = filter?.description || '';
  const currentEn = filter?.descriptionEn || '';

  // Show a real modal with two textareas instead of stacked prompt() dialogs.
  // Lets admin write multi-line descriptions and see both languages side by side.
  let modal = document.getElementById('filterDescModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'filterDescModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:560px">
        <button class="modal-close" id="filterDescClose">&times;</button>
        <h2 class="modal-title">Описание раздела</h2>
        <p style="color:var(--text-secondary);font-size:.85rem;margin:-0.4rem 0 1rem;line-height:1.4">
          Заполните оба поля — на RU и EN. Если EN-поле пустое, англоязычные пользователи увидят русский текст.
        </p>
        <div class="form-group">
          <label class="form-label">Описание (RU)</label>
          <textarea class="form-textarea" id="filterDescRu" rows="3" placeholder="Например: Все сцены с раскадровкой Кацуми Ишизуки"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Description (EN)</label>
          <textarea class="form-textarea" id="filterDescEn" rows="3" placeholder="e.g. All scenes storyboarded by Katsumi Ishizuka"></textarea>
        </div>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
          <button class="btn-cancel" id="filterDescCancel">Отмена</button>
          <button class="btn-submit" id="filterDescSave">Сохранить</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const ruInput = modal.querySelector('#filterDescRu');
  const enInput = modal.querySelector('#filterDescEn');
  ruInput.value = currentRu;
  enInput.value = currentEn;
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
  setTimeout(() => ruInput.focus(), 50);

  const close = () => { modal.classList.remove('visible'); document.body.style.overflow = ''; };
  modal.querySelector('#filterDescClose').onclick = close;
  modal.querySelector('#filterDescCancel').onclick = close;
  // Don't close on overlay click — admin might be in the middle of typing and
  // a misclick outside would lose their work. Esc and the X button still close.
  modal.onclick = null;
  // Close on Esc
  const escHandler = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);
  modal.querySelector('#filterDescSave').onclick = async () => {
    try {
      const res = await fetch(`/api/filters/${filterId}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
        body: JSON.stringify({ description: ruInput.value.trim(), descriptionEn: enInput.value.trim() })
      });
      const data = await res.json();
      console.log('[filter-desc] save response:', data);
      if (data.success) {
        // Patch local FILTERS cache directly so the next render uses the new data
        // even if the API fetch is cached or slow.
        const cached = FILTERS.find(f => f.id === filterId);
        if (cached && data.filter) {
          cached.description = data.filter.description || '';
          cached.descriptionEn = data.filter.descriptionEn || '';
        }
        await loadAnimatorsAndFilters();
        applyFilters();
        notify('Описание обновлено');
        close();
      }
      else notify(data.error, true);
    } catch (e) { console.error('[filter-desc] save failed:', e); notify('Ошибка сети', true); }
  };
}
// Filter chips are rendered dynamically in renderFilterChips()

// ===== SEARCH =====
$('#searchInput').addEventListener('input', () => { applyFilters(); showSuggestions(); });
$('#searchInput').addEventListener('focus', showSuggestions);
document.addEventListener('click', e => { if(!e.target.closest('.search-wrapper'))$('#searchSuggestions').classList.remove('visible'); });

function showSuggestions() {
  const q=$('#searchInput').value.toLowerCase().trim(), sug=$('#searchSuggestions');
  if(!q){sug.classList.remove('visible');return}
  const am=new Map,tm=new Map;
  allClips.forEach(c=>{c.animators.forEach(a=>{const key=a.toLowerCase();if(key.includes(q))am.set(key,(am.get(key)||0)+1)});c.tags.forEach(t=>{if(t.toLowerCase().includes(q))tm.set(t,(tm.get(t)||0)+1)})});
  ANIMATORS.forEach(a=>{const key=a.toLowerCase();if(key.includes(q)&&!am.has(key))am.set(key,0)});
  const items=[];am.forEach((c,key)=>{const display=ANIMATORS.find(a=>a.toLowerCase()===key)||key;items.push({type:'animator',name:display,count:c,score:matchScore(display,q)})});tm.forEach((c,n)=>items.push({type:'tag',name:tagLabel(n),raw:n,count:c,score:matchScore(tagLabel(n),q)}));
  // Сортировка: сначала точные совпадения (с начала), потом по количеству клипов
  items.sort((a,b)=>b.score-a.score||b.count-a.count);
  if(!items.length){sug.classList.remove('visible');return}
  sug.innerHTML=items.slice(0,8).map(it=>`<div class="suggestion-item" data-value="${esc(it.raw||it.name)}" data-type="${it.type}"><span class="suggestion-type ${it.type}">${it.type==='animator'?(LANG==='en'?'animator':'аниматор'):(LANG==='en'?'tag':'тег')}</span><span class="suggestion-name">${esc(it.name)}</span><span class="suggestion-count">${it.count} ${pluralClips(it.count)}</span></div>`).join('');
  sug.querySelectorAll('.suggestion-item').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.type==='animator'){sug.classList.remove('visible');$('#searchInput').value='';navigateTo('animator-profile',el.dataset.value)}else{$('#searchInput').value=el.dataset.value;sug.classList.remove('visible');applyFilters()}}));
  sug.classList.add('visible');
}

// ===== ANIMATORS PAGE =====
function renderAnimatorGrid() {
  const q=($('#animatorSearchInput')?.value||'').toLowerCase().trim(), grid=$('#animatorGrid');
  const counts=new Map;
  allClips.forEach(c=>c.animators.forEach(a=>{ 
    const key = a.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }));
  let list=ANIMATORS.map(n=>({name:n,count:counts.get(n.toLowerCase())||0,hidden:HIDDEN_ANIMATORS.includes(n)}));
  
  // Hide hidden animators for non-admins
  if (!isAdmin) list = list.filter(a => !a.hidden);
  
  if(q){
    list = list.map(a => ({...a, _score: matchScore(a.name, q)})).filter(a => a._score > 0);
    // Приоритет: точность совпадения, потом количество клипов, потом алфавит
    list.sort((a,b) => b._score - a._score || b.count - a.count || a.name.localeCompare(b.name));
  } else {
    list.sort((a,b) => b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name));
  }

  let adminAddHtml = '';
  if (isAdmin) {
    adminAddHtml = `<div class="animator-card animator-add-card" id="addAnimatorCard" style="border-style:dashed;border-color:var(--gold);justify-content:center;gap:.5rem;cursor:pointer">
      <span style="color:var(--gold);font-size:1.5rem">+</span>
      <span style="color:var(--gold);font-family:'Space Mono',monospace;font-size:.75rem">Добавить аниматора</span>
    </div>`;
  }

  if(!list.length && !isAdmin){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">${t('animators_not_found')}</p></div>`;return}

  grid.innerHTML = adminAddHtml + list.map((a,i)=>`<div class="animator-card animator-card-big${a.hidden?' episode-hidden':''}" data-name="${esc(a.name)}" style="animation-delay:${i*0.025}s">
    <div class="animator-card-info"><div class="animator-card-name">${esc(a.name)}${a.hidden?` <span style="font-size:.6rem;color:var(--text-muted)">${t('hidden_label')}</span>`:''}</div><div class="animator-card-count"><span class="animator-card-count-num">${a.count}</span> ${pluralClips(a.count)}</div></div>
    ${isAdmin ? `<button class="animator-card-edit" data-edit-name="${esc(a.name)}" title="Переименовать" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:.9rem;margin-right:.2rem">✎</button><button class="anim-hide-btn" data-hide-name="${esc(a.name)}" title="${a.hidden?'Показать':'Скрыть'}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.2rem;margin-right:.2rem">${a.hidden?'👁':'×'}</button><button class="animator-card-delete" data-del-name="${esc(a.name)}" title="Удалить навсегда" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:.8rem;margin-right:.3rem">🗑</button>` : ''}
    <svg class="animator-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
  </div>`).join('');

  grid.querySelectorAll('.animator-card[data-name]').forEach(c=>c.addEventListener('click', e => {
    if (e.target.closest('.animator-card-delete') || e.target.closest('.animator-card-edit') || e.target.closest('.anim-hide-btn')) return;
    navigateTo('animator-profile',c.dataset.name);
  }));

  // Admin: add animator
  const addCard = grid.querySelector('#addAnimatorCard');
  if (addCard) {
    addCard.addEventListener('click', () => {
      const name = prompt('Имя нового аниматора:');
      if (!name || !name.trim()) return;
      addAnimator(name.trim());
    });
  }

  // Admin: hide/unhide animator
  grid.querySelectorAll('.anim-hide-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const name = btn.dataset.hideName;
      const hidden = HIDDEN_ANIMATORS.includes(name);
      const endpoint = hidden ? '/api/animators/unhide' : '/api/animators/hide';
      try {
        const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({name}) });
        const data = await res.json();
        if (data.success) { HIDDEN_ANIMATORS = data.hidden; renderAnimatorGrid(); notify(hidden ? `${name} показан` : `${name} скрыт`); }
        else notify(data.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });

  // Admin: delete animator permanently
  grid.querySelectorAll('.animator-card-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const name = btn.dataset.delName;
      // Show how many clips reference this animator so admin doesn't delete by accident
      const clipCount = allClips.filter(c => c.animators.some(a => a.toLowerCase() === name.toLowerCase())).length;
      const msg = clipCount > 0
        ? `Удалить аниматора «${name}» из списка?\n\nОн упомянут в ${clipCount} ${pluralClips(clipCount)}. Его имя в этих клипах останется, но из общего списка он пропадёт. Это можно поправить вручную.`
        : `Удалить аниматора «${name}»?\nКлипов с ним нет, удаление безопасно.`;
      if (!confirm(msg)) return;
      await fetch('/api/animators', { method:'DELETE', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({name}) });
      await loadAnimatorsAndFilters();
      renderAnimatorGrid();
      notify(`«${name}» удалён`);
    });
  });

  // Admin: rename animator
  grid.querySelectorAll('.animator-card-edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const oldName = btn.dataset.editName;
      const newName = prompt(`Новое имя для «${oldName}»:`, oldName);
      if (!newName || !newName.trim() || newName.trim() === oldName) return;
      const res = await fetch('/api/animators/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
        body: JSON.stringify({ oldName, newName: newName.trim() })
      });
      const data = await res.json();
      if (data.success) { await loadAnimatorsAndFilters(); await loadClips(); renderAnimatorGrid(); notify(`«${oldName}» → «${newName.trim()}»`); }
      else notify(data.error, true);
    });
  });
}

async function addAnimator(name, force) {
  const res = await fetch('/api/animators', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
    body: JSON.stringify({ name, force: !!force })
  });
  const data = await res.json();
  if (data.success) {
    await loadAnimatorsAndFilters();
    renderAnimatorGrid();
    notify(`«${name}» добавлен`);
    return;
  }
  // Special case: server detected a visually-similar existing animator (e.g. mixed
  // Cyrillic/Latin lookalikes). Ask the admin if it's really a different person.
  if (data.error === 'duplicate_lookalike') {
    const msg = `Похоже, что «${name}» — это тот же аниматор что и существующий «${data.lookalike}» (возможно скрытые буквы из разных алфавитов).\n\nПродолжить и создать всё равно как отдельного?`;
    if (confirm(msg)) {
      // Retry with force=true
      return addAnimator(name, true);
    }
    return;
  }
  notify(data.error || 'Ошибка', true);
}
$('#animatorSearchInput')?.addEventListener('input', renderAnimatorGrid);

// ===== ANIMATOR PROFILE =====
let animatorProfileFilter = 'all';

function renderAnimatorProfile(name) {
  $('#animatorProfileName').textContent=name;
  const allAnimatorClips=allClips.filter(c=>c.animators.some(a=>a.toLowerCase()===name.toLowerCase()));
  const arcs=[...new Set(allAnimatorClips.map(c=>c.arc))];
  const videoCount = allAnimatorClips.filter(c => c.videoUrl).length;
  const photoCount = allAnimatorClips.filter(c => !c.videoUrl).length;
  let stats=`${allAnimatorClips.length} ${pluralClips(allAnimatorClips.length)}`;
  if(arcs.length)stats+=` · ${arcs.join(', ')}`;
  $('#animatorProfileStats').textContent=stats;

  // Apply filter
  let clips = allAnimatorClips;
  if (animatorProfileFilter === 'video') clips = clips.filter(c => c.videoUrl);
  else if (animatorProfileFilter === 'photo') clips = clips.filter(c => !c.videoUrl);

  // Update filter buttons
  const filterBar = $('#animatorProfileFilters');
  filterBar.querySelectorAll('.filter-chip').forEach(ch => {
    ch.classList.toggle('active', ch.dataset.animatorFilter === animatorProfileFilter);
  });

  const grid=$('#animatorClipGrid');
  if(!clips.length){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">${t('animators_no_clips')}</p></div>`}
  else{grid.innerHTML=clips.map((c,i)=>renderClipCard(c,i)).join('');attachClipEvents(grid)}
}

// Animator profile filter clicks
document.querySelectorAll('[data-animator-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    animatorProfileFilter = btn.dataset.animatorFilter;
    if (currentAnimatorProfile) renderAnimatorProfile(currentAnimatorProfile);
  });
});

// ===== EPISODES PAGE =====
let episodeSortMode = 'clips';
let episodeArcFilter = 'all';
let episodeDirectorFilter = 'all'; // 'all' | имя режиссёра

function getEpisodeArc(num) {
  if (num >= 890 && num <= 1088) return 'Wano';
  if (num >= 1089 && num <= 1155) return 'Egghead';
  if (num >= 1156) return 'Elbaf';
  return 'Unknown';
}

function getEpisodeList() {
  // Default range 890-1155, plus any extras from clips
  const episodeSet = new Set();
  for (let i = 890; i <= 1155; i++) episodeSet.add(String(i));
  allClips.forEach(c => { if (c.episode) episodeSet.add(c.episode.trim()); });
  return [...episodeSet];
}

function renderEpisodeGrid() {
  const q = ($('#episodeSearchInput')?.value || '').trim();
  const grid = $('#episodeGrid');

  // Count clips per episode
  const counts = new Map();
  allClips.forEach(c => {
    const ep = c.episode.trim();
    counts.set(ep, (counts.get(ep) || 0) + 1);
  });

  let list = getEpisodeList().map(ep => ({
    episode: ep,
    num: parseInt(ep) || 0,
    count: counts.get(ep) || 0,
    arc: getEpisodeArc(parseInt(ep) || 0),
    director: getEpisodeDirector(ep)
  }));

  // Filter by search
  if (q) list = list.filter(e => e.episode.includes(q));

  // Filter by arc
  if (episodeArcFilter !== 'all') list = list.filter(e => e.arc === episodeArcFilter);

  // Filter by director — episode passes if it has the selected director among its directors
  if (episodeDirectorFilter !== 'all') {
    list = list.filter(e => (e.director || []).some(d => d.toLowerCase() === episodeDirectorFilter.toLowerCase()));
  }

  // Sort
  if (episodeSortMode === 'clips') {
    list.sort((a, b) => b.count !== a.count ? b.count - a.count : b.num - a.num);
  } else {
    list.sort((a, b) => b.num - a.num);
  }

  // Hide hidden episodes for non-admins
  if (!isAdmin) list = list.filter(e => !EPISODES_DATA.hidden.includes(e.episode));

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">${t('episodes_not_found')}</p></div>`;
    return;
  }

  let adminAddHtml = '';
  if (isAdmin) {
    adminAddHtml = `<div class="animator-card animator-add-card" id="addEpisodeCard" style="border-style:dashed;border-color:var(--gold);justify-content:center;gap:.5rem;cursor:pointer">
      <span style="color:var(--gold);font-size:1.5rem">+</span>
      <span style="color:var(--gold);font-family:'Space Mono',monospace;font-size:.75rem">Добавить серию</span>
    </div>`;
  }

  const isHidden = (ep) => EPISODES_DATA.hidden.includes(ep);

  grid.innerHTML = adminAddHtml + list.map((e, i) => {
    const hiddenLabel = isHidden(e.episode) ? ` <span style="font-size:.6rem;color:var(--text-muted)">${t('hidden_label')}</span>` : '';
    // If episode has director(s) — show "ED: Name1 / Name2" as the main line, arc/clips below.
    // If not — just arc and clip count.
    const dirArr = e.director || [];
    const dirText = dirArr.join(' / ');
    const mainLine = dirArr.length
      ? `ED: ${esc(dirText)}${hiddenLabel}`
      : `${e.arc} · ${e.count} ${pluralClips(e.count)}${hiddenLabel}`;
    const subLine = dirArr.length
      ? `${e.arc} · ${e.count} ${pluralClips(e.count)}`
      : '';
    return `<div class="animator-card episode-card${isHidden(e.episode) ? ' episode-hidden' : ''}" data-episode="${esc(e.episode)}" style="animation-delay:${i * 0.02}s">
      <div class="animator-avatar">${esc(e.episode)}</div>
      <div class="animator-card-info">
        <div class="animator-card-name">${mainLine}</div>
        ${subLine ? `<div class="animator-card-count">${subLine}</div>` : ''}
      </div>
      ${isAdmin ? `<button class="animator-card-edit" data-edit-ep="${esc(e.episode)}" title="Переименовать" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:.9rem;margin-right:.2rem">✎</button><button class="animator-card-delete ep-hide-btn" data-del-ep="${esc(e.episode)}" title="${isHidden(e.episode) ? 'Показать' : 'Скрыть'}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.2rem;margin-right:.3rem">${isHidden(e.episode) ? '👁' : '×'}</button>` : ''}
      <svg class="animator-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`;
  }).join('');

  grid.querySelectorAll('.episode-card[data-episode]').forEach(c => c.addEventListener('click', (ev) => {
    if (ev.target.closest('.animator-card-delete') || ev.target.closest('.animator-card-edit')) return;
    navigateTo('episode-profile', c.dataset.episode);
  }));

  // Admin: rename episode
  grid.querySelectorAll('[data-edit-ep]').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      const oldEp = btn.dataset.editEp;
      const newEp = prompt(`Новый номер для серии «${oldEp}»:`, oldEp);
      if (!newEp || newEp.trim() === oldEp) return;
      try {
        const res = await fetch('/api/episodes/rename', { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({oldEpisode:oldEp, newEpisode:newEp.trim()}) });
        const data = await res.json();
        if (data.success) { await loadAnimatorsAndFilters(); await loadClips(); renderEpisodeGrid(); notify(`Серия «${oldEp}» → «${newEp.trim()}»`); }
        else notify(data.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });

  // Admin: hide/unhide episode
  grid.querySelectorAll('.ep-hide-btn').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      const ep = btn.dataset.delEp;
      const hidden = EPISODES_DATA.hidden.includes(ep);
      const endpoint = hidden ? '/api/episodes/unhide' : '/api/episodes/hide';
      try {
        const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({episode:ep}) });
        const data = await res.json();
        if (data.success) { EPISODES_DATA = data.episodes; renderEpisodeGrid(); notify(hidden ? `Серия ${ep} показана` : `Серия ${ep} скрыта`); }
        else notify(data.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });

  const addCard = grid.querySelector('#addEpisodeCard');
  if (addCard) {
    addCard.addEventListener('click', () => {
      const ep = prompt('Номер серии:');
      if (!ep || !ep.trim()) return;
      navigateTo('episode-profile', ep.trim());
      notify(`Серия ${ep.trim()} добавлена`);
    });
  }
}

$('#episodeSearchInput')?.addEventListener('input', renderEpisodeGrid);

// Episode sort & arc filter
document.querySelectorAll('[data-episode-sort]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-episode-sort]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    episodeSortMode = btn.dataset.episodeSort;
    renderEpisodeGrid();
  });
});
document.querySelectorAll('[data-episode-arc]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-episode-arc]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    episodeArcFilter = btn.dataset.episodeArc;
    renderEpisodeGrid();
    // Director counts depend on selected arc — refresh the dropdown so users
    // see the right per-arc counts the next time they open it.
    refreshEpisodeDirectorDropdown();
  });
});

// Director dropdown filter for episodes page
// State for the director-dropdown search box. Kept outside so it survives re-renders.
let episodeDirectorSearch = '';

function refreshEpisodeDirectorDropdown() {
  const dd = $('#episodeDirectorDropdown');
  const toggle = $('#episodeDirectorToggle');
  if (!dd || !toggle) return;

  // Build counts.
  // Counts respect the currently selected arc: when an arc is selected,
  // a director's count = number of THAT-arc episodes they directed.
  // This way "Elbaf + Nanami Michibata" shows how many Elbaf episodes Nanami directed.
  const arcFilter = episodeArcFilter; // 'all' or arc name
  const counts = new Map();
  let totalAssigned = 0;
  for (const ep of Object.keys(EPISODE_DIRECTORS)) {
    const arr = _toDirectorArray(EPISODE_DIRECTORS[ep]);
    if (!arr.length) continue;
    if (arcFilter !== 'all') {
      const epArc = getEpisodeArc(parseInt(ep) || 0);
      if (epArc !== arcFilter) continue;
    }
    totalAssigned++;
    for (const d of arr) {
      const key = d.toLowerCase();
      const existing = counts.get(key);
      if (existing) existing.count++;
      else counts.set(key, { name: d, count: 1 });
    }
  }
  const allDirectors = [...counts.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Apply text search (case-insensitive substring)
  const q = (episodeDirectorSearch || '').trim().toLowerCase();
  const filtered = q ? allDirectors.filter(d => d.name.toLowerCase().includes(q)) : allDirectors;

  const allLabel = t('episodes_director_all');
  // We render: search input + "All" chip + filtered director chips.
  // Search input only shown if there are enough directors to make searching useful.
  const showSearch = allDirectors.length > 6;
  const searchHtml = showSearch
    ? `<div class="director-dropdown-search">
         <input type="text" id="episodeDirectorSearchInput" placeholder="${LANG === 'en' ? 'Search director...' : 'Поиск режиссёра...'}" value="${esc(episodeDirectorSearch)}" autocomplete="off">
       </div>`
    : '';

  const allChip = `<button class="filter-chip director-chip${episodeDirectorFilter === 'all' ? ' active' : ''}" data-episode-director="all">${esc(allLabel)}<span class="director-chip-count">${totalAssigned}</span></button>`;
  const directorChips = filtered.map(d =>
    `<button class="filter-chip director-chip${episodeDirectorFilter === d.name ? ' active' : ''}" data-episode-director="${esc(d.name)}">${esc(d.name)}<span class="director-chip-count">${d.count}</span></button>`
  ).join('');
  const emptyHint = (q && !filtered.length)
    ? `<span class="director-dropdown-empty">${LANG === 'en' ? 'Nothing found' : 'Ничего не найдено'}</span>`
    : '';

  dd.innerHTML = `${searchHtml}<div class="director-dropdown-chips">${allChip}${directorChips}${emptyHint}</div>`;

  // Update toggle button label
  if (episodeDirectorFilter !== 'all') {
    toggle.textContent = episodeDirectorFilter + ' ✕';
    toggle.classList.add('active');
  } else {
    toggle.textContent = t('episodes_director_filter');
    toggle.classList.remove('active');
  }

  // Wire up chip clicks
  dd.querySelectorAll('[data-episode-director]').forEach(b => {
    b.addEventListener('click', () => {
      episodeDirectorFilter = b.dataset.episodeDirector;
      episodeDirectorSearch = '';
      dd.classList.remove('visible');
      renderEpisodeGrid();
      refreshEpisodeDirectorDropdown();
    });
  });

  // Wire up the search input. We don't re-render on every keystroke from outside
  // so we manage focus carefully here.
  const searchInput = dd.querySelector('#episodeDirectorSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      episodeDirectorSearch = searchInput.value;
      // Re-render only the chips area (keep input focused with its caret)
      const caret = searchInput.selectionStart;
      refreshEpisodeDirectorDropdown();
      const newInput = $('#episodeDirectorSearchInput');
      if (newInput) {
        newInput.focus();
        try { newInput.setSelectionRange(caret, caret); } catch {}
      }
    });
    searchInput.addEventListener('click', e => e.stopPropagation()); // don't close dropdown
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        episodeDirectorSearch = '';
        refreshEpisodeDirectorDropdown();
      }
    });
  }
}

$('#episodeDirectorToggle')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const dd = $('#episodeDirectorDropdown');
  // If a filter is active, click on the active toggle resets it
  if (episodeDirectorFilter !== 'all' && !dd.classList.contains('visible')) {
    episodeDirectorFilter = 'all';
    renderEpisodeGrid();
    refreshEpisodeDirectorDropdown();
    return;
  }
  refreshEpisodeDirectorDropdown();
  dd.classList.toggle('visible');
});

// Close director dropdown on outside click
document.addEventListener('click', (e) => {
  const dd = $('#episodeDirectorDropdown');
  if (dd && dd.classList.contains('visible') && !e.target.closest('#episodeDirectorToggle') && !e.target.closest('#episodeDirectorDropdown')) {
    dd.classList.remove('visible');
  }
});

// ===== EPISODE PROFILE =====
// Returns adjacent episode numbers (prev/next) sorted as integers.
// Hidden episodes are skipped for non-admins.
function getAdjacentEpisodes(currentEp) {
  const all = getEpisodeList()
    .filter(ep => isAdmin || !EPISODES_DATA.hidden.includes(ep))
    .map(ep => ({ ep, n: parseInt(ep) || 0 }))
    .filter(x => x.n > 0)
    .sort((a, b) => a.n - b.n);
  const cur = parseInt(currentEp) || 0;
  const idx = all.findIndex(x => x.n === cur);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1].ep : null,
    next: idx < all.length - 1 ? all[idx + 1].ep : null
  };
}

function renderEpisodeProfile(episode) {
  $('#episodeProfileName').textContent = `${LANG === 'en' ? 'EPISODE' : 'СЕРИЯ'} ${episode}`;
  const clips = allClips.filter(c => c.episode.trim() === episode);
  const arc = getEpisodeArc(parseInt(episode) || 0);
  const animators = [...new Set(clips.flatMap(c => c.animators))];
  let stats = `${arc} · ${clips.length} ${pluralClips(clips.length)}`;
  if (animators.length) stats += ` · ${animators.length} ${pluralAnimators(animators.length)}`;
  $('#episodeProfileStats').textContent = stats;

  // Render prev/next arrows
  const { prev, next } = getAdjacentEpisodes(episode);
  const navEl = $('#episodeProfileNav');
  if (navEl) {
    navEl.innerHTML = `
      ${prev ? `<button class="episode-nav-btn" data-go="${esc(prev)}" title="${LANG==='en'?'Previous episode':'Предыдущая серия'}: ${esc(prev)}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg><span>${esc(prev)}</span></button>` : `<span class="episode-nav-stub"></span>`}
      ${next ? `<button class="episode-nav-btn episode-nav-next" data-go="${esc(next)}" title="${LANG==='en'?'Next episode':'Следующая серия'}: ${esc(next)}"><span>${esc(next)}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>` : `<span class="episode-nav-stub"></span>`}
    `;
    navEl.querySelectorAll('[data-go]').forEach(btn => {
      btn.addEventListener('click', () => navigateTo('episode-profile', btn.dataset.go));
    });
  }

  // Render director block
  renderEpisodeDirectorBlock(episode);

  // Sort: images/photos first, then videos; within each group sort by clipOrder
  clips.sort((a, b) => {
    const aIsPhoto = !a.videoUrl;
    const bIsPhoto = !b.videoUrl;
    if (aIsPhoto !== bIsPhoto) return aIsPhoto ? -1 : 1;
    return (a.clipOrder || 0) - (b.clipOrder || 0);
  });

  const grid = $('#episodeClipGrid');
  if (!clips.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">${t('episodes_no_clips')}</p></div>`;
  } else {
    grid.innerHTML = clips.map((c, i) => renderClipCard(c, i)).join('');
    attachClipEvents(grid);
  }
}

// Renders the director block on the episode profile page.
// Episodes can have multiple directors (e.g. "Nanami Michibata" + "Kouhei Kureta").
// Each director is shown as a chip with × to remove; admins can add more via an autocomplete input.
function renderEpisodeDirectorBlock(episode) {
  const block = $('#episodeDirectorBlock');
  if (!block) return;
  const dirs = getEpisodeDirector(episode); // always an array

  let html = '';
  if (dirs.length) {
    html += `<span class="episode-director-label">ED:</span>`;
    for (const name of dirs) {
      html += `<span class="episode-director-chip">
        <span class="episode-director-name">${esc(name)}</span>
        ${isAdmin ? `<button class="episode-director-chip-remove" data-remove-director="${esc(name)}" title="Убрать">×</button>` : ''}
      </span>`;
    }
  } else if (isAdmin) {
    html += `<span class="episode-director-label">ED:</span>`;
  }

  if (isAdmin) {
    html += `<div class="episode-director-add-wrap">
      <button class="episode-director-edit" data-action="open-add-director">${dirs.length ? '+ Добавить режиссёра' : '+ Указать режиссёра'}</button>
      <div class="episode-director-add-form" id="episodeDirectorAddForm" style="display:none">
        <input type="text" class="form-input" id="episodeDirectorAddInput" placeholder="Имя режиссёра..." autocomplete="off">
        <div class="animator-dropdown" id="episodeDirectorAddDropdown"></div>
      </div>
    </div>`;
  }

  block.innerHTML = html;

  // Remove chip handlers
  block.querySelectorAll('[data-remove-director]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const name = btn.dataset.removeDirector;
      const next = dirs.filter(d => d.toLowerCase() !== name.toLowerCase());
      await setEpisodeDirectors(episode, next);
    });
  });

  // Open the add-director input
  block.querySelector('[data-action="open-add-director"]')?.addEventListener('click', () => {
    const form = block.querySelector('#episodeDirectorAddForm');
    const input = block.querySelector('#episodeDirectorAddInput');
    if (!form || !input) return;
    form.style.display = 'block';
    input.value = '';
    input.focus();
  });

  // Wire up autocomplete on the add input (admin only)
  const input = block.querySelector('#episodeDirectorAddInput');
  const dropdown = block.querySelector('#episodeDirectorAddDropdown');
  if (input && dropdown) {
    const renderSuggestions = () => {
      const q = input.value.trim().toLowerCase();
      const already = new Set(dirs.map(d => d.toLowerCase()));
      // Available = existing directors that aren't already on this episode
      const available = (DIRECTORS || []).filter(d => !already.has(d.toLowerCase()));
      const matches = q
        ? available.map(d => ({ name: d, score: matchScore(d, q) })).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).map(x => x.name)
        : available.slice().sort((a, b) => a.localeCompare(b));
      let items = matches.slice(0, 8).map(name => `<div class="animator-dropdown-item" data-pick="${esc(name)}">${esc(name)}</div>`);
      if (q && !available.some(d => d.toLowerCase() === q)) {
        items.push(`<div class="animator-dropdown-item" data-pick="${esc(input.value.trim())}">+ Добавить: «${esc(input.value.trim())}»</div>`);
      }
      if (!items.length) {
        dropdown.classList.remove('visible');
        return;
      }
      dropdown.innerHTML = items.join('');
      dropdown.classList.add('visible');
      dropdown.querySelectorAll('[data-pick]').forEach(el => el.addEventListener('click', async () => {
        const picked = el.dataset.pick.trim();
        if (!picked) return;
        if (dirs.some(d => d.toLowerCase() === picked.toLowerCase())) {
          dropdown.classList.remove('visible');
          return;
        }
        await setEpisodeDirectors(episode, [...dirs, picked]);
      }));
    };
    input.addEventListener('input', renderSuggestions);
    input.addEventListener('focus', renderSuggestions);
    input.addEventListener('keydown', async e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = input.value.trim();
        if (!v) return;
        if (dirs.some(d => d.toLowerCase() === v.toLowerCase())) return;
        await setEpisodeDirectors(episode, [...dirs, v]);
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('visible');
        block.querySelector('#episodeDirectorAddForm').style.display = 'none';
      }
    });
  }
}

// Save the full director array for an episode (replaces previous list).
async function setEpisodeDirectors(episode, directors) {
  try {
    const res = await fetch(`/api/episode-directors/${encodeURIComponent(episode)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ directors })
    });
    const data = await res.json();
    if (!data.success) { notify(data.error || 'Не удалось сохранить', true); return; }
    // Refresh in-memory data so other UI parts (filter dropdown, episode grid) update too
    EPISODE_DIRECTORS = await (await fetch('/api/episode-directors')).json();
    DIRECTORS = await (await fetch('/api/directors')).json();
    renderEpisodeDirectorBlock(episode);
    if (!directors.length) notify(`Режиссёры серии ${episode} убраны`);
    else notify(`Серия ${episode}: ${directors.join(' / ')}`);
  } catch { notify('Ошибка сети', true); }
}

// Backwards-compatible single-director helper (still used elsewhere — converts to array).
async function setEpisodeDirector(episode, director) {
  const arr = director ? [String(director).trim()].filter(Boolean) : [];
  return setEpisodeDirectors(episode, arr);
}

$('#backToEpisodesBtn').addEventListener('click', () => navigateTo('episodes'));

// ===== UPLOAD MODAL =====
function openUploadModal(presetAnimator) {
  if(!isAdmin){notify('Войдите как админ чтобы загружать клипы',true);return}
  $('#uploadModal').classList.add('visible');document.body.style.overflow='hidden';
  selectedAnimators=[];selectedImages=[];renderAnimatorChips();renderImagePreviews();
  if(presetAnimator){selectedAnimators.push(presetAnimator);renderAnimatorChips()}
}
function closeUploadModal(){$('#uploadModal').classList.remove('visible');document.body.style.overflow=''}
$('#openUploadBtn').addEventListener('click',()=>openUploadModal());
$('#uploadForAnimatorBtn').addEventListener('click',()=>{if(!isAdmin){notify('Войдите как админ',true);return}openUploadModal(currentAnimatorProfile)});
$('#closeUploadBtn').addEventListener('click',closeUploadModal);

// ===== ANIMATOR SELECTOR =====
const animInput=$('#animatorInput'), animDropdown=$('#animatorDropdown');
animInput.addEventListener('input',()=>{
  const q=animInput.value.toLowerCase().trim();
  if(!q){animDropdown.classList.remove('visible');return}
  const matches=ANIMATORS.map(a=>({name:a, score:matchScore(a,q)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).map(x=>x.name);
  if(!matches.length) animDropdown.innerHTML=`<div class="animator-dropdown-item" data-name="${esc(animInput.value.trim())}">Добавить: «${esc(animInput.value.trim())}»</div>`;
  else animDropdown.innerHTML=matches.slice(0,8).map(a=>{const sel=selectedAnimators.includes(a);return`<div class="animator-dropdown-item${sel?' selected':''}" data-name="${esc(a)}">${esc(a)}${sel?' ✓':''}</div>`}).join('');
  animDropdown.querySelectorAll('.animator-dropdown-item:not(.selected)').forEach(el=>el.addEventListener('click',()=>{if(!selectedAnimators.includes(el.dataset.name))selectedAnimators.push(el.dataset.name);renderAnimatorChips();animInput.value='';animDropdown.classList.remove('visible')}));
  animDropdown.classList.add('visible');
});
animInput.addEventListener('focus',()=>{if(animInput.value.trim())animInput.dispatchEvent(new Event('input'))});
document.addEventListener('click',e=>{if(!e.target.closest('.animator-select-wrapper'))animDropdown.classList.remove('visible')});

function renderAnimatorChips() {
  const c=$('#animatorChips');
  c.innerHTML=selectedAnimators.map(a=>`<span class="animator-chip">${esc(a)}<button class="animator-chip-remove" data-name="${esc(a)}">&times;</button></span>`).join('');
  c.querySelectorAll('.animator-chip-remove').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();selectedAnimators=selectedAnimators.filter(a=>a!==b.dataset.name);renderAnimatorChips()}));
}

// === Animator selector for the edit-clip modal (mirrors the upload-form selector) ===
function renderEditAnimatorChips() {
  const c = $('#editAnimatorChips');
  if (!c) return;
  c.innerHTML = editSelectedAnimators.map(a => `<span class="animator-chip">${esc(a)}<button class="animator-chip-remove" data-name="${esc(a)}">&times;</button></span>`).join('');
  c.querySelectorAll('.animator-chip-remove').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    editSelectedAnimators = editSelectedAnimators.filter(a => a !== b.dataset.name);
    renderEditAnimatorChips();
  }));
}

const editAnimInput = $('#editAnimatorInput'), editAnimDropdown = $('#editAnimatorDropdown');
if (editAnimInput && editAnimDropdown) {
  editAnimInput.addEventListener('input', () => {
    const q = editAnimInput.value.toLowerCase().trim();
    if (!q) { editAnimDropdown.classList.remove('visible'); return; }
    const matches = ANIMATORS.map(a => ({ name: a, score: matchScore(a, q) })).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).map(x => x.name);
    if (!matches.length) {
      editAnimDropdown.innerHTML = `<div class="animator-dropdown-item" data-name="${esc(editAnimInput.value.trim())}">Добавить: «${esc(editAnimInput.value.trim())}»</div>`;
    } else {
      editAnimDropdown.innerHTML = matches.slice(0, 8).map(a => {
        const sel = editSelectedAnimators.includes(a);
        return `<div class="animator-dropdown-item${sel ? ' selected' : ''}" data-name="${esc(a)}">${esc(a)}${sel ? ' ✓' : ''}</div>`;
      }).join('');
    }
    editAnimDropdown.querySelectorAll('.animator-dropdown-item:not(.selected)').forEach(el => el.addEventListener('click', () => {
      if (!editSelectedAnimators.includes(el.dataset.name)) editSelectedAnimators.push(el.dataset.name);
      renderEditAnimatorChips();
      editAnimInput.value = '';
      editAnimDropdown.classList.remove('visible');
      editAnimInput.focus();
    }));
    editAnimDropdown.classList.add('visible');
  });
  editAnimInput.addEventListener('focus', () => { if (editAnimInput.value.trim()) editAnimInput.dispatchEvent(new Event('input')); });
}
// Close dropdown when clicking outside its wrapper. Same logic as the upload-form one,
// but scoped to the edit modal so the two don't fight.
document.addEventListener('click', e => {
  const dd = $('#editAnimatorDropdown');
  if (!dd) return;
  if (!e.target.closest('#editAnimatorDropdown') && !e.target.closest('#editAnimatorInput') && !e.target.closest('#editAnimatorChips')) {
    dd.classList.remove('visible');
  }
});

// ===== TAG SELECTOR =====
let selectedTags = [];
const tagInput=$('#tagsInput'), tagDropdown=$('#tagDropdown');

tagInput.addEventListener('input',()=>{
  const q=tagInput.value.toLowerCase().trim();
  const available=FILTERS.filter(f=>!selectedTags.includes(f.id));
  const matches=q ? available.filter(f=>f.id.toLowerCase().includes(q)||f.label.toLowerCase().includes(q)) : available;
  if(!matches.length){tagDropdown.classList.remove('visible');return}
  tagDropdown.innerHTML=matches.slice(0,10).map(f=>`<div class="animator-dropdown-item" data-id="${esc(f.id)}" data-label="${esc(f.label)}">${esc(f.label)} <span style="opacity:.5;font-size:.75em">(${esc(f.id)})</span></div>`).join('');
  tagDropdown.querySelectorAll('.animator-dropdown-item').forEach(el=>el.addEventListener('click',()=>{
    if(!selectedTags.includes(el.dataset.id))selectedTags.push(el.dataset.id);
    renderTagChips();tagInput.value='';tagDropdown.classList.remove('visible');
  }));
  tagDropdown.classList.add('visible');
});
tagInput.addEventListener('focus',()=>{
  const available=FILTERS.filter(f=>!selectedTags.includes(f.id));
  if(available.length){
    tagDropdown.innerHTML=available.slice(0,10).map(f=>`<div class="animator-dropdown-item" data-id="${esc(f.id)}" data-label="${esc(f.label)}">${esc(f.label)} <span style="opacity:.5;font-size:.75em">(${esc(f.id)})</span></div>`).join('');
    tagDropdown.querySelectorAll('.animator-dropdown-item').forEach(el=>el.addEventListener('click',()=>{
      if(!selectedTags.includes(el.dataset.id))selectedTags.push(el.dataset.id);
      renderTagChips();tagInput.value='';tagDropdown.classList.remove('visible');
    }));
    tagDropdown.classList.add('visible');
  }
});
document.addEventListener('click',e=>{if(!e.target.closest('#tagSelectWrapper'))tagDropdown.classList.remove('visible')});

function renderTagChips(){
  const c=$('#tagChips');
  c.innerHTML=selectedTags.map(t=>{
    const f=FILTERS.find(f=>f.id===t);
    const label=f?f.label:t;
    return`<span class="animator-chip tag-chip">${esc(label)}<button class="animator-chip-remove" data-tag="${esc(t)}">&times;</button></span>`;
  }).join('');
  c.querySelectorAll('.animator-chip-remove').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();selectedTags=selectedTags.filter(t=>t!==b.dataset.tag);renderTagChips()}));
}

// ===== FILE HANDLING — VIDEO =====
const dropZone=$('#dropZone'), fileInput=$('#fileInput');
dropZone.addEventListener('click',()=>fileInput.click());
dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('dragover')});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop',e=>{e.preventDefault();dropZone.classList.remove('dragover');if(e.dataTransfer.files.length)handleVideoFile(e.dataTransfer.files[0])});
fileInput.addEventListener('change',()=>{if(fileInput.files.length)handleVideoFile(fileInput.files[0])});
$('#removeFileBtn').addEventListener('click',removeVideoFile);

function handleVideoFile(f) {
  if(!f.type.startsWith('video/')){notify('Выберите видеофайл',true);return}
  if(f.size>200*1024*1024){notify('Видео слишком большое (макс 200 МБ)',true);return}
  selectedFile=f;$('#fileName').textContent=f.name;$('#fileSize').textContent=formatBytes(f.size);$('#fileInfo').classList.add('visible');
  // Show video preview
  const preview=$('#uploadPreviewPlayer');
  preview.src=URL.createObjectURL(f);
  $('#uploadVideoPreview').style.display='block';
}
function removeVideoFile(){
  const preview=$('#uploadPreviewPlayer');
  if(preview.src){preview.pause();URL.revokeObjectURL(preview.src);preview.removeAttribute('src')}
  $('#uploadVideoPreview').style.display='none';
  selectedFile=null;fileInput.value='';$('#fileInfo').classList.remove('visible');
}

// === Upload source tabs: file vs URL ===
// State for the URL-based path. When the admin successfully fetches a remote
// video, we get back a server-side filename which we'll send as `preloadedVideo`
// instead of attaching a multipart File.
let preloadedVideoFilename = null;

document.querySelectorAll('.upload-source-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const which = tab.dataset.sourceTab;
    document.querySelectorAll('.upload-source-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.upload-source-pane').forEach(p => {
      p.style.display = (p.dataset.sourcePane === which) ? '' : 'none';
    });
    // Reset the other path's state when switching tabs
    if (which === 'url') {
      removeVideoFile();
    } else {
      preloadedVideoFilename = null;
      $('#urlFetchStatus').textContent = '';
      $('#urlFetchStatus').classList.remove('error', 'success');
      $('#videoUrlInput').value = '';
    }
  });
});

$('#fetchVideoUrlBtn')?.addEventListener('click', async () => {
  const url = $('#videoUrlInput').value.trim();
  const status = $('#urlFetchStatus');
  if (!url) { status.textContent = 'Введите URL'; status.className = 'url-fetch-status error'; return; }
  status.textContent = 'Скачиваем... это может занять до минуты';
  status.className = 'url-fetch-status';
  $('#fetchVideoUrlBtn').disabled = true;
  try {
    const r = await fetch('/api/clips/from-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ url })
    });
    const d = await r.json();
    if (d.success) {
      preloadedVideoFilename = d.filename;
      const sizeMb = (d.size / 1024 / 1024).toFixed(1);
      status.textContent = `✓ Файл скачан (${sizeMb} МБ). Заполните остальные поля и нажмите "Загрузить".`;
      status.className = 'url-fetch-status success';
    } else {
      status.textContent = '✕ ' + (d.error || 'Не удалось скачать');
      status.className = 'url-fetch-status error';
    }
  } catch (err) {
    status.textContent = '✕ Ошибка сети';
    status.className = 'url-fetch-status error';
  } finally {
    $('#fetchVideoUrlBtn').disabled = false;
  }
});

// ===== FILE HANDLING — IMAGES =====
const imageDropZone=$('#imageDropZone'), imageInput=$('#imageInput');
imageDropZone.addEventListener('click',()=>imageInput.click());
imageDropZone.addEventListener('dragover',e=>{e.preventDefault();imageDropZone.classList.add('dragover')});
imageDropZone.addEventListener('dragleave',()=>imageDropZone.classList.remove('dragover'));
imageDropZone.addEventListener('drop',e=>{e.preventDefault();imageDropZone.classList.remove('dragover');handleImageFiles(e.dataTransfer.files)});
imageInput.addEventListener('change',()=>{handleImageFiles(imageInput.files)});

function handleImageFiles(files) {
  for(const f of files){
    if(!f.type.startsWith('image/')){notify('Файл '+f.name+' — не изображение',true);continue}
    if(selectedImages.length>=20){notify('Максимум 20 фото',true);break}
    selectedImages.push(f);
  }
  renderImagePreviews();
}

function renderImagePreviews() {
  const c=$('#imagePreviews');
  c.innerHTML=selectedImages.map((f,i)=>{
    const url=URL.createObjectURL(f);
    return`<div class="image-preview-item"><img src="${url}" alt=""><button class="image-preview-remove" data-idx="${i}">&times;</button></div>`;
  }).join('');
  c.querySelectorAll('.image-preview-remove').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();selectedImages.splice(parseInt(b.dataset.idx),1);renderImagePreviews()}));
}

// ===== THUMBNAIL HANDLING =====
const thumbnailDropZone=$('#thumbnailDropZone'), thumbnailInput=$('#thumbnailInput');
if(thumbnailDropZone){
  thumbnailDropZone.addEventListener('click',()=>thumbnailInput.click());
  thumbnailDropZone.addEventListener('dragover',e=>{e.preventDefault();thumbnailDropZone.classList.add('dragover')});
  thumbnailDropZone.addEventListener('dragleave',()=>thumbnailDropZone.classList.remove('dragover'));
  thumbnailDropZone.addEventListener('drop',e=>{e.preventDefault();thumbnailDropZone.classList.remove('dragover');if(e.dataTransfer.files.length)handleThumbnail(e.dataTransfer.files[0])});
  thumbnailInput.addEventListener('change',()=>{if(thumbnailInput.files.length)handleThumbnail(thumbnailInput.files[0])});
  $('#thumbnailRemoveBtn').addEventListener('click',removeThumbnail);
}

function handleThumbnail(f){
  if(!f.type.startsWith('image/')){notify('Выберите изображение',true);return}
  selectedThumbnail=f;
  const url=URL.createObjectURL(f);
  $('#thumbnailPreviewImg').src=url;
  $('#thumbnailPreview').style.display='inline-block';
  $('#thumbnailDropZone').style.display='none';
}

function removeThumbnail(){
  if(selectedThumbnail){const img=$('#thumbnailPreviewImg');if(img.src)URL.revokeObjectURL(img.src);img.src=''}
  selectedThumbnail=null;
  thumbnailInput.value='';
  $('#thumbnailPreview').style.display='none';
  $('#thumbnailDropZone').style.display='';
}

function formatBytes(b){if(b<1024)return b+' Б';if(b<1048576)return(b/1024).toFixed(1)+' КБ';return(b/1048576).toFixed(1)+' МБ'}

// ===== UPLOAD SUBMIT =====
$('#uploadForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const title=$('#clipTitleInput').value.trim(), titleEn=$('#clipTitleEnInput')?.value.trim()||'', episode=$('#episodeInput').value.trim(), arc=$('#arcSelect').value, tags=selectedTags.join(','), notes=$('#notesInput').value.trim(), notesEn=$('#notesEnInput')?.value.trim()||'';
  if(!selectedFile&&!selectedImages.length&&!preloadedVideoFilename){notify('Загрузите видео или хотя бы одно фото',true);return}
  if(!title){notify('Введите название',true);return}
  if(!selectedAnimators.length){notify('Выберите аниматора',true);return}
  if(!episode){notify('Введите номер эпизода',true);return}

  const fd=new FormData();
  if(selectedFile)fd.append('video',selectedFile);
  if(preloadedVideoFilename)fd.append('preloadedVideo', preloadedVideoFilename);
  if(selectedThumbnail)fd.append('thumbnail',selectedThumbnail);
  selectedImages.forEach(f=>fd.append('images',f));
  fd.append('title',title);fd.append('titleEn',titleEn);fd.append('animators',selectedAnimators.join(', '));fd.append('episode',episode);fd.append('arc',arc);fd.append('tags',tags);fd.append('notes',notes);fd.append('notesEn',notesEn);
  fd.append('timecodes', $('#timecodesInput').value.trim());
  fd.append('clipOrder', $('#clipOrderInput').value.trim() || '0');

  $('#submitBtn').disabled=true;$('#uploadProgress').classList.add('visible');

  try{
    const xhr=new XMLHttpRequest();
    xhr.upload.addEventListener('progress',e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);$('#progressBarFill').style.width=p+'%';$('#progressText').textContent=`Загрузка... ${p}%`}});
    await new Promise((ok,no)=>{
      xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300)ok(JSON.parse(xhr.responseText));else{try{no(new Error(JSON.parse(xhr.responseText).error))}catch{no(new Error('Ошибка'))}}};
      xhr.onerror=()=>no(new Error('Ошибка сети'));
      xhr.open('POST','/api/clips');xhr.setRequestHeader('X-Admin-Token',adminToken);xhr.send(fd);
    });
    $('#uploadForm').reset();selectedAnimators=[];selectedTags=[];selectedImages=[];selectedFile=null;selectedThumbnail=null;preloadedVideoFilename=null;renderAnimatorChips();renderTagChips();renderImagePreviews();$('#fileInfo').classList.remove('visible');removeThumbnail();
    $('#urlFetchStatus') && ($('#urlFetchStatus').textContent='', $('#urlFetchStatus').className='url-fetch-status');
    const p=$('#uploadPreviewPlayer');if(p.src){p.pause();URL.revokeObjectURL(p.src);p.removeAttribute('src')}$('#uploadVideoPreview').style.display='none';
    closeUploadModal();notify(`«${title}» загружен!`);await loadAnimatorsAndFilters();await loadClips();
    if(currentPage==='animator-profile'&&currentAnimatorProfile)renderAnimatorProfile(currentAnimatorProfile);
  }catch(err){notify(err.message||'Ошибка загрузки',true)}
  finally{$('#submitBtn').disabled=false;$('#uploadProgress').classList.remove('visible');$('#progressBarFill').style.width='0%'}
});

// ===== TIMECODE HELPERS =====
function parseTimecodes(str) {
  if (!str) return [];
  return str.split('\n').map(line => {
    line = line.trim();
    if (!line) return null;

    // Try to extract start timecode from beginning of line
    // Supports: 0:00, 0:00.0, 0:00:00, 00:00, etc.
    const timeMatch = line.match(/^(\d+):(\d{2})(?:[:.](\d+))?/);
    if (!timeMatch) return null;

    const mins = parseInt(timeMatch[1]);
    const secs = parseInt(timeMatch[2]);
    // The fractional part can be 1-3 digits, interpret as decimal fraction of a second.
    // e.g. "0:06.4" → 6.4 seconds; "0:06.42" → 6.42 seconds; "0:06.421" → 6.421 seconds.
    const fracStr = timeMatch[3] || '';
    const fracSeconds = fracStr ? parseInt(fracStr) / Math.pow(10, fracStr.length) : 0;
    const totalSeconds = mins * 60 + secs + fracSeconds;

    // Extract the name — everything after the timecode and separators
    // Remove the start timecode, optional end timecode, and separators
    let rest = line.slice(timeMatch[0].length).trim();
    // Remove optional end timecode like "- 0:25.9" or "- 0:25.9:"
    rest = rest.replace(/^[-–—]\s*\d+:\d{2}(?:[:.]?\d*)?:?\s*/, '');
    // Remove leading separators: - — – :
    rest = rest.replace(/^[-–—:]\s*/, '');
    // Remove leading timecode-like patterns (e.g. "0:05.6:")
    rest = rest.replace(/^\d+:\d{2}(?:[:.]?\d*)?:?\s*/, '');

    if (!rest) return null;

    const label = timeMatch[3]
      ? `${timeMatch[1]}:${timeMatch[2].padStart(2,'0')}.${timeMatch[3]}`
      : `${timeMatch[1]}:${timeMatch[2].padStart(2,'0')}`;

    return { time: totalSeconds, name: rest.trim(), label };
  }).filter(Boolean);
}

let currentTimecodes = [];
let timecodeInterval = null;

// ===== VIDEO PLAYER =====
function openPlayer(id) {
  const clip=allClips.find(c=>c.id===id);if(!clip)return;
  // Record view
  fetch(`/api/clips/${id}/view`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userToken:getUserToken()})}).then(r=>r.json()).then(d=>{if(d.views)clip.views=d.views}).catch(()=>{});
  $('#playerTitle').textContent=clipTitle(clip);
  $('#playerCurrentAnimator').textContent='';
  $('#playerDetails').innerHTML=`<span class="clip-meta" style="font-size:.75rem">${LANG==='en'?'Ep.':'Эп.'} ${esc(clip.episode)} · ${esc(clip.arc)}</span>${clip.animators.map(a=>`<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}${clip.tags.map(tg=>`<span class="clip-tag category">${esc(tagLabel(tg))}</span>`).join('')}`;
  $('#playerDetails').querySelectorAll('.clip-tag.animator').forEach(t=>t.addEventListener('click',()=>{closePlayer();navigateTo('animator-profile',t.dataset.animator)}));

  // Notes
  const notesEl = $('#playerNotes');
  if (clipNotes(clip).trim()) {
    notesEl.innerHTML = `<div class="player-notes-label">${LANG==='en'?'Notes':'Заметки'}</div><div class="player-notes-text">${esc(clipNotes(clip)).replace(/\n/g, '<br>')}</div>`;
    notesEl.style.display = '';
  } else {
    notesEl.innerHTML = '';
    notesEl.style.display = 'none';
  }

  // Attached images
  const imagesEl = $('#playerImages');
  if (clip.images && clip.images.length) {
    imagesEl.innerHTML = `<div class="player-notes-label">${LANG==='en'?'Photos':'Фотографии'}</div><div class="player-images-grid">${clip.images.map((img, idx) => `<img class="player-image-thumb" src="${img.url}" data-idx="${idx}" alt="">`).join('')}</div>`;
    imagesEl.querySelectorAll('.player-image-thumb').forEach(img => {
      img.addEventListener('click', () => {
        openClipPageImageViewer(clip.images.map(i => i.url), parseInt(img.dataset.idx));
      });
    });
    imagesEl.style.display = '';
  } else {
    imagesEl.innerHTML = '';
    imagesEl.style.display = 'none';
  }

  currentTimecodes = parseTimecodes(clip.timecodes);

  // Render timecode list
  const tcList = $('#timecodeList');
  if (currentTimecodes.length) {
    tcList.innerHTML = currentTimecodes.map((tc, i) =>
      `<div class="timecode-item" data-idx="${i}" data-time="${tc.time}"><span class="timecode-time">${tc.label}</span><span class="timecode-name">${esc(tc.name)}</span></div>`
    ).join('');
    tcList.querySelectorAll('.timecode-item').forEach(el => {
      el.addEventListener('click', () => {
        $('#playerVideo').currentTime = parseFloat(el.dataset.time);
        $('#playerVideo').play();
      });
    });
    tcList.style.display = '';
  } else {
    tcList.innerHTML = '';
    tcList.style.display = 'none';
  }

  if(clip.videoUrl){
    const video = $('#playerVideo');
    video.src=clip.videoUrl;
    video.style.display='block';

    // Render timecode markers on timeline after metadata loads
    video.onloadedmetadata = () => {
      const bar = $('#timecodeBar');
      if (currentTimecodes.length && video.duration) {
        bar.innerHTML = currentTimecodes.map(tc => {
          const pct = (tc.time / video.duration * 100).toFixed(2);
          return `<div class="timecode-marker" style="left:${pct}%" data-time="${tc.time}"><div class="timecode-marker-tooltip">${tc.label} — ${esc(tc.name)}</div></div>`;
        }).join('');
        bar.querySelectorAll('.timecode-marker').forEach(m => {
          m.addEventListener('click', e => {
            e.stopPropagation();
            video.currentTime = parseFloat(m.dataset.time);
            video.play();
          });
        });
        bar.style.display = '';
      } else {
        bar.innerHTML = '';
        bar.style.display = 'none';
      }
    };

    // Update current animator indicator
    if (timecodeInterval) clearInterval(timecodeInterval);
    if (currentTimecodes.length) {
      timecodeInterval = setInterval(() => {
        const t = video.currentTime;
        let current = null;
        for (let i = currentTimecodes.length - 1; i >= 0; i--) {
          if (t >= currentTimecodes[i].time) { current = currentTimecodes[i]; break; }
        }
        $('#playerCurrentAnimator').textContent = current ? `▶ ${current.name}` : '';
        // Highlight active timecode
        tcList.querySelectorAll('.timecode-item').forEach((el, idx) => {
          el.classList.toggle('active', current && currentTimecodes.indexOf(current) === idx);
        });
      }, 300);
    }
  } else {
    $('#playerVideo').removeAttribute('src');$('#playerVideo').style.display='none';
    $('#timecodeBar').innerHTML='';$('#timecodeBar').style.display='none';
  }

  $('#playerOverlay').classList.add('visible');document.body.style.overflow='hidden';
  // Load comments
  loadClipComments(clip.id);
}
function closePlayer(){if(timecodeInterval){clearInterval(timecodeInterval);timecodeInterval=null}$('#playerVideo').pause();$('#playerVideo').removeAttribute('src');$('#playerOverlay').classList.remove('visible');document.body.style.overflow=''}
$('#playerCloseBtn').addEventListener('click',closePlayer);

// ===== PLAYER FRAME-BY-FRAME =====
(function(){
  const video=$('#playerVideo'), info=$('#playerFrameInfo'), fpsSelect=$('#playerFpsSelect');
  let fps=24;
  fpsSelect.addEventListener('change',()=>{fps=parseInt(fpsSelect.value)});
  function fmt(t){const m=Math.floor(t/60),s=Math.floor(t%60),ms=Math.floor((t%1)*1000);return`${m}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}`}
  function updateInfo(){info.textContent=`Кадр: ${fmt(video.currentTime)}`}
  $('#playerFramePrev').addEventListener('click',()=>{video.pause();video.currentTime=Math.max(0,video.currentTime-1/fps);updateInfo()});
  $('#playerFrameNext').addEventListener('click',()=>{video.pause();video.currentTime=video.currentTime+1/fps;updateInfo()});
  video.addEventListener('timeupdate',updateInfo);
  video.addEventListener('seeked',updateInfo);
})();

// ===== COMMENTS =====
let currentCommentClipId = null;

async function loadClipComments(clipId) {
  currentCommentClipId = clipId;
  const list = $('#commentsList');
  list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">' + t('loading') + '</span>';
  // Restore nickname
  const savedNick = localStorage.getItem('sp_comment_nick');
  if (savedNick) $('#commentNick').value = savedNick;
  try {
    const hdrs = {'X-User-Token':getUserToken()};
    if (adminToken) hdrs['X-Admin-Token'] = adminToken;
    const res = await fetch(`/api/clips/${clipId}/comments`, {headers:hdrs});
    const comments = await res.json();
    renderComments(comments, clipId);
  } catch {
    list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">Ошибка загрузки</span>';
  }
}

function renderComments(comments, clipId) {
  const list = $('#commentsList');
  if (!comments.length) {
    list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">' + t('comment_no_comments') + '</span>';
    return;
  }
  list.innerHTML = comments.map(c => {
    const date = new Date(c.createdAt);
    const timeStr = date.toLocaleDateString('ru-RU', {day:'numeric',month:'short'}) + ' ' + date.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'});
    const edited = c.editedAt ? ' <span style="font-size:.6rem;color:var(--text-muted)">(ред.)</span>' : '';
    return `<div class="comment-item${c.isOwn ? ' comment-own' : ''}">
      <div class="comment-header">
        <span class="comment-nickname">${esc(c.nickname)}</span>
        <span class="comment-time">${timeStr}${edited}</span>
        ${c.isOwn ? `<button class="comment-edit-btn" data-clip-id="${clipId}" data-comment-id="${c.id}" data-text="${esc(c.text)}" title="Редактировать">✎</button>` : ''}
        ${c.isOwn || isAdmin ? `<button class="comment-delete" data-clip-id="${clipId}" data-comment-id="${c.id}" title="Удалить">×</button>` : ''}
        ${isAdmin && c.userToken && !c.isOwn ? `<button class="comment-ban-btn" data-user-token="${esc(c.userToken)}" data-nickname="${esc(c.nickname)}" title="Забанить пользователя">🚫</button>` : ''}
      </div>
      <div class="comment-body">${esc(c.text).replace(/\n/g, '<br>')}</div>
    </div>`;
  }).join('');

  list.querySelectorAll('.comment-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Удалить комментарий?')) return;
      try {
        const headers = {};
        if (isAdmin) headers['X-Admin-Token'] = adminToken;
        headers['X-User-Token'] = getUserToken();
        const res = await fetch(`/api/clips/${btn.dataset.clipId}/comments/${btn.dataset.commentId}`, {
          method: 'DELETE', headers
        });
        const d = await res.json();
        if (d.success) loadClipComments(parseInt(btn.dataset.clipId));
        else notify(d.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });

  list.querySelectorAll('.comment-edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newText = prompt('Редактировать комментарий:', btn.dataset.text);
      if (newText === null || !newText.trim()) return;
      try {
        const res = await fetch(`/api/clips/${btn.dataset.clipId}/comments/${btn.dataset.commentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-User-Token': getUserToken() },
          body: JSON.stringify({ text: newText.trim() })
        });
        const d = await res.json();
        if (d.success) loadClipComments(parseInt(btn.dataset.clipId));
        else notify(d.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });

  // Ban user (admin only)
  list.querySelectorAll('.comment-ban-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const nick = btn.dataset.nickname;
      if (!confirm(`Забанить пользователя «${nick}»? Он больше не сможет комментировать.`)) return;
      try {
        const res = await fetch('/api/comments/ban', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
          body: JSON.stringify({ userToken: btn.dataset.userToken })
        });
        const d = await res.json();
        if (d.success) notify(`${nick} забанен`);
        else notify(d.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });
}

// Generate/load persistent user token for nickname ownership
function getUserToken() {
  let token = localStorage.getItem('sp_user_token');
  if (!token) {
    token = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('');
    localStorage.setItem('sp_user_token', token);
  }
  return token;
}

$('#commentSubmitBtn').addEventListener('click', async () => {
  const nick = $('#commentNick').value.trim();
  const text = $('#commentText').value.trim();
  if (!nick) { notify('Укажите ник', true); return; }
  if (!text) { notify('Напишите комментарий', true); return; }
  if (!currentCommentClipId) return;
  localStorage.setItem('sp_comment_nick', nick);
  try {
    const res = await fetch(`/api/clips/${currentCommentClipId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nick, text, userToken: getUserToken() })
    });
    const d = await res.json();
    if (d.success) {
      $('#commentText').value = '';
      loadClipComments(currentCommentClipId);
    } else notify(d.error, true);
  } catch { notify('Ошибка сети', true); }
});

$('#commentText').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#commentSubmitBtn').click(); }
});

// ===== IMAGE VIEWER =====
function openImageViewer(clip) {
  viewerImages=clip.images.map(img=>img.url);viewerIndex=0;
  updateImageViewer();
  $('#imageViewerTitle').textContent=clipTitle(clip);
  $('#imageViewerDetails').innerHTML=`<span class="clip-meta" style="font-size:.75rem">${LANG==='en'?'Ep.':'Эп.'} ${esc(clip.episode)} · ${esc(clip.arc)}</span>${clip.animators.map(a=>`<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}`;
  $('#imageViewerDetails').querySelectorAll('.clip-tag.animator').forEach(t=>t.addEventListener('click',()=>{closeImageViewer();navigateTo('animator-profile',t.dataset.animator)}));
  $('#imageViewerOverlay').classList.add('visible');document.body.style.overflow='hidden';
}
function updateImageViewer() {
  $('#imageViewerImg').src=viewerImages[viewerIndex];
  $('#imageViewerCounter').textContent=viewerImages.length>1?`${viewerIndex+1} / ${viewerImages.length}`:'';
  $('#imgPrevBtn').style.visibility=viewerIndex>0?'visible':'hidden';
  $('#imgNextBtn').style.visibility=viewerIndex<viewerImages.length-1?'visible':'hidden';
}
function closeImageViewer(){$('#imageViewerOverlay').classList.remove('visible');document.body.style.overflow=''}
$('#imageViewerCloseBtn').addEventListener('click',closeImageViewer);
$('#imageViewerOverlay').addEventListener('click',e=>{if(e.target===$('#imageViewerOverlay'))closeImageViewer()});
$('#imgPrevBtn').addEventListener('click',e=>{e.stopPropagation();if(viewerIndex>0){viewerIndex--;updateImageViewer()}});
$('#imgNextBtn').addEventListener('click',e=>{e.stopPropagation();if(viewerIndex<viewerImages.length-1){viewerIndex++;updateImageViewer()}});

// ===== ADMIN =====
// Restore admin session from token
(async()=>{
  const savedToken = localStorage.getItem('sp_admin_token');
  if(savedToken){
    try{
      const r=await fetch('/api/verify',{headers:{'X-Admin-Token':savedToken}});
      const d=await r.json();
      if(d.valid){
        adminToken=savedToken;
        isAdmin=true;
        isOwner = d.role === 'owner';
        canBackup = isOwner || !!d.canBackup;
        currentUsername = d.username || null;
        document.body.classList.add('admin-mode');
        if (isOwner) document.body.classList.add('owner-mode');
        if (canBackup) document.body.classList.add('can-backup');
      }
      else{localStorage.removeItem('sp_admin_token');}
    }catch{localStorage.removeItem('sp_admin_token');}
  }
})();

$('#adminToggleBtn').addEventListener('click',async()=>{
  if(isAdmin){
    try{await fetch('/api/logout',{method:'POST',headers:{'X-Admin-Token':adminToken}})}catch{}
    isAdmin=false;isOwner=false;canBackup=false;currentUsername=null;adminToken=null;
    document.body.classList.remove('admin-mode','owner-mode','can-backup');
    localStorage.removeItem('sp_admin_token');
    notify('Вышли из режима админа');renderFilterChips();
    if(currentPage==='animators')renderAnimatorGrid();
  }
  else{$('#adminLoginModal').classList.add('visible');document.body.style.overflow='hidden';$('#adminPasswordInput').value='';$('#adminLoginError').style.display='none';setTimeout(()=>($('#adminUsernameInput')||$('#adminPasswordInput')).focus(),100)}
});
$('#passwordToggleBtn').addEventListener('click', () => {
  const inp = $('#adminPasswordInput');
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  $('#eyeOpen').style.display = isHidden ? 'none' : 'block';
  $('#eyeClosed').style.display = isHidden ? 'block' : 'none';
});

$('#closeAdminLoginBtn').addEventListener('click',()=>{$('#adminLoginModal').classList.remove('visible');document.body.style.overflow=''});
$('#adminLoginBtn').addEventListener('click',tryLogin);
$('#adminPasswordInput').addEventListener('keydown',e=>{if(e.key==='Enter')tryLogin()});
$('#adminUsernameInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')$('#adminPasswordInput').focus()});

// ===== USER MANAGEMENT (owner only) =====
async function openUsersModal() {
  if (!isOwner) { notify('Только владелец', true); return; }
  $('#usersModal').classList.add('visible');
  document.body.style.overflow = 'hidden';
  await refreshUsersList();
  await refreshAuditLog();
}

function closeUsersModal() {
  $('#usersModal').classList.remove('visible');
  document.body.style.overflow = '';
}

async function refreshUsersList() {
  try {
    const r = await fetch('/api/users', { headers: { 'X-Admin-Token': adminToken } });
    if (!r.ok) throw new Error();
    const users = await r.json();
    const list = $('#usersList');
    // Owner row first
    const ownerRow = `<div class="user-row">
      <div class="user-row-name">${esc(currentUsername)} <span style="color:var(--text-muted);font-size:.7rem">(вы)</span></div>
      <div class="user-row-role owner">Владелец</div>
    </div>`;
    const rows = users.map(u => `<div class="user-row">
      <div class="user-row-name">${esc(u.username)}</div>
      <div class="user-row-role">Админ</div>
      <div class="user-row-actions">
        <button class="user-row-btn ${u.canBackup ? 'can-backup-on' : ''}" data-action="toggle-backup" data-user="${esc(u.username)}" data-current="${u.canBackup ? '1' : '0'}" title="${u.canBackup ? 'Может скачивать бэкап. Нажмите чтобы запретить.' : 'Не может скачивать бэкап. Нажмите чтобы разрешить.'}">${u.canBackup ? '✓ Бэкап' : '+ Бэкап'}</button>
        <button class="user-row-btn" data-action="reset-pwd" data-user="${esc(u.username)}">Сменить пароль</button>
        <button class="user-row-btn danger" data-action="delete" data-user="${esc(u.username)}">Удалить</button>
      </div>
    </div>`).join('');
    list.innerHTML = ownerRow + (users.length ? rows : '<p style="color:var(--text-muted);font-size:.8rem;text-align:center;padding:1rem">Других админов нет</p>');
    // Wire buttons
    list.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.dataset.user;
        if (!confirm(`Удалить админа «${username}»? Действие необратимо.`)) return;
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
            method: 'DELETE',
            headers: { 'X-Admin-Token': adminToken }
          });
          const d = await res.json();
          if (d.success) { notify(`Админ «${username}» удалён`); refreshUsersList(); refreshAuditLog(); }
          else notify(d.error || 'Ошибка', true);
        } catch { notify('Ошибка сети', true); }
      });
    });
    list.querySelectorAll('[data-action="reset-pwd"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.dataset.user;
        const pwd = prompt(`Новый пароль для «${username}» (мин 6 символов):`);
        if (!pwd) return;
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(username)}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
            body: JSON.stringify({ password: pwd })
          });
          const d = await res.json();
          if (d.success) { notify(`Пароль изменён. Передайте его «${username}»`); refreshAuditLog(); }
          else notify(d.error || 'Ошибка', true);
        } catch { notify('Ошибка сети', true); }
      });
    });
    // Toggle backup permission
    list.querySelectorAll('[data-action="toggle-backup"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.dataset.user;
        const currentlyAllowed = btn.dataset.current === '1';
        const newValue = !currentlyAllowed;
        const confirmMsg = newValue
          ? `Разрешить «${username}» скачивать полный бэкап сайта?\n\nВ бэкапе все клипы, комментарии, ники пользователей и другие данные. Передавайте право только тем, кому действительно доверяете.`
          : `Забрать у «${username}» право скачивать бэкап?`;
        if (!confirm(confirmMsg)) return;
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(username)}/can-backup`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
            body: JSON.stringify({ canBackup: newValue })
          });
          const d = await res.json();
          if (d.success) {
            notify(newValue ? `«${username}» теперь может скачивать бэкап` : `Право бэкапа у «${username}» отозвано`);
            refreshUsersList();
            refreshAuditLog();
          } else notify(d.error || 'Ошибка', true);
        } catch { notify('Ошибка сети', true); }
      });
    });
  } catch {
    $('#usersList').innerHTML = '<p style="color:var(--accent)">Не удалось загрузить список</p>';
  }
}

async function refreshAuditLog() {
  try {
    const r = await fetch('/api/audit-log', { headers: { 'X-Admin-Token': adminToken } });
    if (!r.ok) throw new Error();
    const log = await r.json();
    const el = $('#auditLogList');
    if (!log.length) { el.innerHTML = '<p style="color:var(--text-muted);font-size:.7rem">Записей нет</p>'; return; }
    el.innerHTML = log.slice(0, 50).map(e => {
      const t = new Date(e.at);
      const time = t.toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      const target = e.target ? ` → ${esc(String(e.target))}` : '';
      return `<div class="audit-entry"><span class="audit-user">${esc(e.user)}</span> <span class="audit-action">${esc(e.action)}</span>${target} <span class="audit-time">${time}</span></div>`;
    }).join('');
  } catch {
    $('#auditLogList').innerHTML = '<p style="color:var(--accent);font-size:.7rem">Не удалось загрузить</p>';
  }
}

$('#usersBtn')?.addEventListener('click', openUsersModal);
$('#closeUsersBtn')?.addEventListener('click', closeUsersModal);

$('#createUserBtn')?.addEventListener('click', async () => {
  const username = $('#newUserUsername').value.trim();
  const password = $('#newUserPassword').value;
  if (!username || !password) { notify('Заполните оба поля', true); return; }
  if (password.length < 6) { notify('Пароль минимум 6 символов', true); return; }
  try {
    const r = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ username, password })
    });
    const d = await r.json();
    if (d.success) {
      notify(`Админ «${username}» создан. Передайте логин и пароль.`);
      $('#newUserUsername').value = '';
      $('#newUserPassword').value = '';
      refreshUsersList();
      refreshAuditLog();
    } else {
      notify(d.error || 'Ошибка', true);
    }
  } catch { notify('Ошибка сети', true); }
});

// Backup button — downloads a zip with all data
$('#backupBtn')?.addEventListener('click', async () => {
  if (!isAdmin || !adminToken) { notify('Войдите как админ', true); return; }
  const btn = $('#backupBtn');
  const originalText = btn.textContent;
  btn.disabled = true;

  // Helper: format bytes as human-readable
  const fmt = (n) => n >= 1048576 ? (n/1048576).toFixed(1) + ' МБ' : (n/1024).toFixed(0) + ' КБ';

  try {
    const response = await fetch('/api/backup', { headers: { 'X-Admin-Token': adminToken } });
    if (!response.ok) throw new Error('HTTP ' + response.status);

    // Read estimated size from server header (raw bytes before zip compression)
    const estimated = parseInt(response.headers.get('X-Backup-Estimated-Size') || '0');
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      // Update button text. If we know estimated size, show percent + MB. Otherwise just MB.
      if (estimated > 0) {
        // Cap at 99% until fully done — zip compression can make actual size differ slightly
        const pct = Math.min(99, Math.floor(received / estimated * 100));
        btn.textContent = `⏳ ${pct}% · ${fmt(received)}`;
      } else {
        btn.textContent = `⏳ ${fmt(received)}`;
      }
    }

    btn.textContent = '⏳ Сохраняю...';
    const blob = new Blob(chunks, { type: 'application/zip' });
    const d = new Date();
    const dateStr = d.toISOString().slice(0,10);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sakugapiece-backup-${dateStr}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    notify(`Бэкап скачан · ${fmt(received)}`);
  } catch (e) {
    notify('Не удалось скачать бэкап: ' + e.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

async function tryLogin(){
  const username = ($('#adminUsernameInput')?.value || '').trim();
  const pwd = $('#adminPasswordInput').value;
  if (!username || !pwd) {
    $('#adminLoginError').textContent = 'Заполните оба поля';
    $('#adminLoginError').style.display = 'block';
    return;
  }
  try{
    const r = await fetch('/api/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, password: pwd })
    });
    const d = await r.json();
    if (d.success && d.token) {
      adminToken = d.token;
      isAdmin = true;
      isOwner = d.role === 'owner';
      canBackup = isOwner || !!d.canBackup;
      currentUsername = d.username || username;
      document.body.classList.add('admin-mode');
      if (isOwner) document.body.classList.add('owner-mode');
      if (canBackup) document.body.classList.add('can-backup');
      localStorage.setItem('sp_admin_token', d.token);
      $('#adminLoginModal').classList.remove('visible');
      document.body.style.overflow='';
      notify('Вы вошли как ' + currentUsername);
      renderFilterChips();
      if (currentPage === 'animators') renderAnimatorGrid();
    } else {
      $('#adminLoginError').textContent = d.error || 'Неверный логин или пароль';
      $('#adminLoginError').style.display = 'block';
      $('#adminPasswordInput').value = '';
      $('#adminPasswordInput').focus();
    }
  } catch {
    $('#adminLoginError').textContent = 'Ошибка сети';
    $('#adminLoginError').style.display='block';
  }
}

// ===== EDIT CLIP =====
let editingClipId = null;

let editSelectedTags = [];

function openEditModal(id) {
  const clip = allClips.find(c => c.id === id);
  if (!clip) return;
  editingClipId = id;
  $('#editTitleInput').value = clip.title;
  if ($('#editTitleEnInput')) $('#editTitleEnInput').value = clip.titleEn || '';
  $('#editAnimatorInput').value = '';
  editSelectedAnimators = [...(clip.animators || [])];
  renderEditAnimatorChips();
  $('#editEpisodeInput').value = clip.episode;
  $('#editArcSelect').value = clip.arc;
  editSelectedTags = [...clip.tags];
  renderEditTagChips();
  $('#editTagsInput').value = '';
  $('#editNotesInput').value = clip.notes || '';
  $('#editNotesEnInput').value = clip.notesEn || '';
  $('#editTimecodesInput').value = clip.timecodes || '';
  $('#editClipOrderInput').value = clip.clipOrder || 0;
  $('#editDirectorOverrideInput').value = clip.directorOverride || '';
  // Big video preview at the top of the modal (read-only — only for watching while editing)
  const cv = $('#editClipVideo'), cvWrap = $('#editVideoPreviewWrap');
  if (clip.videoUrl) {
    cv.src = clip.videoUrl;
    cvWrap.style.display = '';
  } else {
    cv.removeAttribute('src');
    cvWrap.style.display = 'none';
  }
  // Photos preview (if the clip has images)
  const pp = $('#editPhotosPreview'), ppWrap = $('#editPhotosPreviewWrap');
  if (clip.images && clip.images.length) {
    pp.innerHTML = clip.images.map(img => `<img src="${esc(img.url)}" alt="">`).join('');
    ppWrap.style.display = '';
  } else {
    pp.innerHTML = '';
    ppWrap.style.display = 'none';
  }
  // Video preview
  const vp = $('#editVideoPreview');
  if (clip.videoUrl) { vp.src = clip.videoUrl; vp.style.display = 'block'; }
  else { vp.removeAttribute('src'); vp.style.display = 'none'; }
  // Thumbnail preview
  const tp = $('#editThumbnailPreview');
  const rb = $('#editThumbnailRemoveBtn');
  if (clip.thumbnailUrl) { tp.src = clip.thumbnailUrl; tp.style.display = 'block'; rb.style.display = ''; }
  else { tp.src = ''; tp.style.display = 'none'; rb.style.display = 'none'; }
  $('#editModal').classList.add('visible');
  document.body.style.overflow = 'hidden';
  renderEditImagesGrid();
}

function closeEditModal() {
  $('#editModal').classList.remove('visible');
  document.body.style.overflow = '';
  editingClipId = null;
  // Stop video playback so it doesn't keep playing in the background
  const cv = $('#editClipVideo');
  if (cv) { try { cv.pause(); } catch {} cv.removeAttribute('src'); cv.load(); }
}

$('#closeEditBtn').addEventListener('click', closeEditModal);
$('#editCancelBtn').addEventListener('click', closeEditModal);

// ===== EDIT TAG AUTOCOMPLETE =====
const editTagInput=$('#editTagsInput'), editTagDropdown=$('#editTagDropdown');

editTagInput.addEventListener('input',()=>{
  const q=editTagInput.value.toLowerCase().trim();
  const available=FILTERS.filter(f=>!editSelectedTags.includes(f.id));
  const matches=q ? available.filter(f=>f.id.toLowerCase().includes(q)||f.label.toLowerCase().includes(q)) : available;
  if(!matches.length){editTagDropdown.classList.remove('visible');return}
  editTagDropdown.innerHTML=matches.slice(0,10).map(f=>`<div class="animator-dropdown-item" data-id="${esc(f.id)}" data-label="${esc(f.label)}">${esc(f.label)} <span style="opacity:.5;font-size:.75em">(${esc(f.id)})</span></div>`).join('');
  editTagDropdown.querySelectorAll('.animator-dropdown-item').forEach(el=>el.addEventListener('click',()=>{
    if(!editSelectedTags.includes(el.dataset.id))editSelectedTags.push(el.dataset.id);
    renderEditTagChips();editTagInput.value='';editTagDropdown.classList.remove('visible');
  }));
  editTagDropdown.classList.add('visible');
});
editTagInput.addEventListener('focus',()=>{
  const available=FILTERS.filter(f=>!editSelectedTags.includes(f.id));
  if(available.length){
    editTagDropdown.innerHTML=available.slice(0,10).map(f=>`<div class="animator-dropdown-item" data-id="${esc(f.id)}" data-label="${esc(f.label)}">${esc(f.label)} <span style="opacity:.5;font-size:.75em">(${esc(f.id)})</span></div>`).join('');
    editTagDropdown.querySelectorAll('.animator-dropdown-item').forEach(el=>el.addEventListener('click',()=>{
      if(!editSelectedTags.includes(el.dataset.id))editSelectedTags.push(el.dataset.id);
      renderEditTagChips();editTagInput.value='';editTagDropdown.classList.remove('visible');
    }));
    editTagDropdown.classList.add('visible');
  }
});
document.addEventListener('click',e=>{if(!e.target.closest('#editTagSelectWrapper'))editTagDropdown.classList.remove('visible')});

function renderEditTagChips(){
  const c=$('#editTagChips');
  c.innerHTML=editSelectedTags.map(t=>{
    const f=FILTERS.find(f=>f.id===t);
    const label=f?f.label:t;
    return`<span class="animator-chip tag-chip">${esc(label)}<button class="animator-chip-remove" data-tag="${esc(t)}">&times;</button></span>`;
  }).join('');
  c.querySelectorAll('.animator-chip-remove').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();editSelectedTags=editSelectedTags.filter(t=>t!==b.dataset.tag);renderEditTagChips()}));
}

// ===== EDIT VIDEO =====
$('#editVideoBtn').addEventListener('click', () => $('#editVideoInput').click());
$('#editVideoInput').addEventListener('change', async () => {
  const f = $('#editVideoInput').files[0];
  if (!f || !editingClipId) return;
  if (!f.type.startsWith('video/')) { notify('Выберите видеофайл', true); return; }
  if (f.size > 200*1024*1024) { notify('Видео слишком большое (макс 200 МБ)', true); return; }
  const fd = new FormData();
  fd.append('video', f);
  try {
    notify('Загрузка видео...');
    const res = await fetch(`/api/clips/${editingClipId}/video`, {
      method: 'POST',
      headers: { 'X-Admin-Token': adminToken },
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      $('#editVideoPreview').src = data.videoUrl;
      $('#editVideoPreview').style.display = 'block';
      notify('Видео обновлено');
      await loadClips();
    } else notify(data.error, true);
  } catch { notify('Ошибка сети', true); }
  $('#editVideoInput').value = '';
});

// Edit thumbnail
$('#editThumbnailBtn').addEventListener('click', () => $('#editThumbnailInput').click());
$('#editThumbnailInput').addEventListener('change', async () => {
  const f = $('#editThumbnailInput').files[0];
  if (!f || !editingClipId) return;
  const fd = new FormData();
  fd.append('thumbnail', f);
  try {
    const res = await fetch(`/api/clips/${editingClipId}/thumbnail`, {
      method: 'POST',
      headers: { 'X-Admin-Token': adminToken },
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      $('#editThumbnailPreview').src = data.thumbnailUrl;
      $('#editThumbnailPreview').style.display = 'block';
      $('#editThumbnailRemoveBtn').style.display = '';
      notify('Обложка обновлена');
      await loadClips();
    } else notify(data.error, true);
  } catch { notify('Ошибка сети', true); }
  $('#editThumbnailInput').value = '';
});

// Edit images
$('#editImagesBtn').addEventListener('click', () => $('#editImagesInput').click());
$('#editImagesInput').addEventListener('change', async () => {
  const files = $('#editImagesInput').files;
  if (!files.length || !editingClipId) return;
  const fd = new FormData();
  for (const f of files) fd.append('images', f);
  try {
    notify('Загрузка фото...');
    const res = await fetch(`/api/clips/${editingClipId}/images`, {
      method: 'POST',
      headers: { 'X-Admin-Token': adminToken },
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      await loadClips();
      renderEditImagesGrid();
      notify(`Добавлено ${files.length} фото`);
    } else notify(data.error, true);
  } catch { notify('Ошибка сети', true); }
  $('#editImagesInput').value = '';
});

function renderEditImagesGrid() {
  const clip = allClips.find(c => c.id === editingClipId);
  const grid = $('#editImagesGrid');
  if (!clip || !clip.images || !clip.images.length) { grid.innerHTML = '<span style="font-size:.75rem;color:var(--text-muted)">Нет фото</span>'; return; }
  grid.innerHTML = clip.images.map(img => `<div class="edit-image-item">
    <img src="${img.url}" alt="">
    <button class="edit-image-remove" data-filename="${esc(img.filename)}" title="Удалить">&times;</button>
  </div>`).join('');
  grid.querySelectorAll('.edit-image-remove').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`/api/clips/${editingClipId}/images/${btn.dataset.filename}`, {
          method: 'DELETE',
          headers: { 'X-Admin-Token': adminToken }
        });
        const data = await res.json();
        if (data.success) { await loadClips(); renderEditImagesGrid(); notify('Фото удалено'); }
        else notify(data.error, true);
      } catch { notify('Ошибка сети', true); }
    });
  });
}

$('#editSaveBtn').addEventListener('click', async () => {
  if (!editingClipId) return;
  // If user typed something in the input but didn't pick a suggestion or press add — accept it as a final animator
  const pendingTyped = ($('#editAnimatorInput')?.value || '').trim();
  if (pendingTyped && !editSelectedAnimators.includes(pendingTyped)) {
    editSelectedAnimators.push(pendingTyped);
    $('#editAnimatorInput').value = '';
    renderEditAnimatorChips();
  }
  const body = {
    title: $('#editTitleInput').value.trim(),
    titleEn: $('#editTitleEnInput')?.value.trim() || '',
    animators: editSelectedAnimators.join(', '),
    episode: $('#editEpisodeInput').value.trim(),
    arc: $('#editArcSelect').value,
    tags: editSelectedTags.join(','),
    notes: $('#editNotesInput').value.trim(),
    notesEn: $('#editNotesEnInput')?.value.trim() || '',
    timecodes: $('#editTimecodesInput').value.trim(),
    clipOrder: $('#editClipOrderInput').value.trim() || '0',
    directorOverride: $('#editDirectorOverrideInput').value.trim()
  };
  if (!body.title || !body.animators || !body.episode) {
    notify('Заполните название, аниматора и эпизод', true);
    return;
  }
  try {
    const res = await fetch(`/api/clips/${editingClipId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      notify('Клип обновлён');
      const editedId = editingClipId;
      const updatedClip = data.clip;
      closeEditModal();

      // Save scroll position so we don't jump after re-render
      const savedScroll = window.scrollY;

      // Update the clip locally instead of re-fetching everything (avoids resetting pagination)
      if (updatedClip) {
        const idx = allClips.findIndex(c => c.id === editedId);
        if (idx !== -1) allClips[idx] = updatedClip;
      } else {
        // Fallback: refetch in case server didn't return updated clip
        try { allClips = await (await fetch('/api/clips')).json(); } catch {}
      }

      // Director list may have grown if a new override was set
      try { DIRECTORS = await (await fetch('/api/directors')).json(); } catch {}
      try { EPISODE_DIRECTORS = await (await fetch('/api/episode-directors')).json(); } catch {}

      // Re-render only the current page, without touching pagination state
      if (currentPage === 'animator-profile' && currentAnimatorProfile) renderAnimatorProfile(currentAnimatorProfile);
      else if (currentPage === 'episode-profile' && currentEpisodeProfile) renderEpisodeProfile(currentEpisodeProfile);
      else if (currentPage === 'browse') {
        // Re-apply current filter set, but preserve current page number
        const savedPage = currentPage_clips;
        applyFilters();
        currentPage_clips = savedPage;
        renderClipPage_browse();
      }

      // Restore scroll position
      window.scrollTo(0, savedScroll);
    } else {
      notify(data.error || 'Ошибка', true);
    }
  } catch { notify('Ошибка сети', true); }
});

function confirmDeleteClip(id){
  const clip=allClips.find(c=>c.id===id);if(!clip)return;clipToDelete=id;
  $('#deleteConfirmText').textContent=`«${clip.title}» будет удалён навсегда.`;$('#deleteConfirmModal').classList.add('visible');document.body.style.overflow='hidden';
}
function closeDeleteModal(){$('#deleteConfirmModal').classList.remove('visible');document.body.style.overflow='';clipToDelete=null}
$('#closeDeleteConfirmBtn').addEventListener('click',closeDeleteModal);
$('#deleteCancelBtn').addEventListener('click',closeDeleteModal);
$('#deleteConfirmModal').addEventListener('click',e=>{if(e.target===$('#deleteConfirmModal'))closeDeleteModal()});

$('#deleteConfirmBtn').addEventListener('click',async()=>{
  if(!clipToDelete)return;const id=clipToDelete;closeDeleteModal();
  try{const r=await fetch(`/api/clips/${id}`,{method:'DELETE',headers:{'X-Admin-Token':adminToken}});const d=await r.json();
    if(d.success){notify('Клип удалён');await loadClips();if(currentPage==='animator-profile'&&currentAnimatorProfile)renderAnimatorProfile(currentAnimatorProfile)}
    else notify(d.error||'Ошибка',true)}
  catch{notify('Ошибка сети',true)}
});

// ===== NOTIFICATION =====
let nt;function notify(t,err){$('#notificationText').textContent=t;$('#notification').classList.toggle('error',!!err);$('#notification').classList.add('visible');clearTimeout(nt);nt=setTimeout(()=>$('#notification').classList.remove('visible'),3500)}

// ===== KEYBOARD =====
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeUploadModal();closePlayer();closeImageViewer();closeDeleteModal();closeEditModal();$('#adminLoginModal').classList.remove('visible');closeUsersModal();document.body.style.overflow=''}
  if(e.key==='/'&&!e.target.closest('input,textarea,select')){
    e.preventDefault();
    // Find the search input on the current active page
    const activePage = document.querySelector('.page.active');
    const search = activePage?.querySelector('input.search-input') || $('#searchInput');
    search?.focus();
  }
  if($('#imageViewerOverlay').classList.contains('visible')){if(e.key==='ArrowLeft'&&viewerIndex>0){viewerIndex--;updateImageViewer()}if(e.key==='ArrowRight'&&viewerIndex<viewerImages.length-1){viewerIndex++;updateImageViewer()}}
  if($('#playerOverlay').classList.contains('visible')&&!e.target.closest('input,textarea,select')){
    if(e.key==='ArrowLeft'){e.preventDefault();$('#playerFramePrev').click()}
    if(e.key==='ArrowRight'){e.preventDefault();$('#playerFrameNext').click()}
  }
});

// Swipe support for image viewer
let touchStartX=0;
$('#imageViewerOverlay').addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX},{passive:true});
$('#imageViewerOverlay').addEventListener('touchend',e=>{const diff=e.changedTouches[0].clientX-touchStartX;if(Math.abs(diff)>50){if(diff<0&&viewerIndex<viewerImages.length-1){viewerIndex++;updateImageViewer()}if(diff>0&&viewerIndex>0){viewerIndex--;updateImageViewer()}}},{passive:true});

// ===== INIT =====
async function init() {
  // Read pagination from URL BEFORE anything mutates it (loadClips → applyFilters → renderClips can reset hash)
  const initialHash = window.location.hash.slice(1);
  let pendingClipsPage = 1;
  if (initialHash.startsWith('p=')) {
    const n = parseInt(initialHash.slice(2));
    if (n && n > 1) pendingClipsPage = n;
  }

  // Activate the right page immediately based on URL — before any data loads.
  // This prevents the browse-page flash when opening /clip/... directly.
  const isClipUrl = /^\/clip\/\d+$/.test(window.location.pathname);
  if (!isClipUrl) {
    // For non-clip URLs, activate browse (or whichever page hash points to) so user sees something while data loads
    let targetPageId = 'page-browse';
    if (initialHash.startsWith('animator/')) targetPageId = 'page-animator-profile';
    else if (initialHash.startsWith('episode/')) targetPageId = 'page-episode-profile';
    else if (initialHash === 'episodes') targetPageId = 'page-episodes';
    else if (initialHash === 'animators') targetPageId = 'page-animators';
    else if (initialHash === 'about') targetPageId = 'page-about';
    const target = document.getElementById(targetPageId);
    if (target) target.classList.add('active');
  }

  await loadAnimatorsAndFilters();
  renderFilterChips();
  await loadClips();

  // Check if we're on a clip page
  const clipMatch = window.location.pathname.match(/^\/clip\/(\d+)$/);
  if (clipMatch) {
    const clipId = parseInt(clipMatch[1]);
    const clip = allClips.find(c => c.id === clipId);
    if (clip) {
      renderClipPage(clip);
      return;
    }
    // Clip not found — fall through to homepage
    document.getElementById('page-browse')?.classList.add('active');
  }

  // Check if navigating to animator via query param
  const params = new URLSearchParams(window.location.search);
  if (params.get('animator')) {
    navigateTo('animator-profile', params.get('animator'));
    return;
  }

  // Hash-based routing
  if (initialHash.startsWith('animator/')) {
    navigateTo('animator-profile', decodeURIComponent(initialHash.slice(9)));
  } else if (initialHash.startsWith('episode/')) {
    navigateTo('episode-profile', decodeURIComponent(initialHash.slice(8)));
  } else if (initialHash === 'episodes') {
    navigateTo('episodes');
  } else if (initialHash === 'animators') {
    navigateTo('animators');
  } else if (initialHash === 'about') {
    navigateTo('about');
  } else if (pendingClipsPage > 1) {
    // Restore pagination state on browse page (e.g. user pressed Back from a clip)
    currentPage_clips = pendingClipsPage;
    // Restore the hash since loadClips() → applyFilters() → renderClips() may have cleared it
    try { window.history.replaceState({ page: 'browse', clipsPage: pendingClipsPage }, '', '#p=' + pendingClipsPage); } catch {}
    renderClipPage_browse();
  }
}

function renderFilterChips() {
  const container = document.querySelector('.filters');
  if (!container) return;

  const tagFilters = FILTERS.filter(f => f.type === 'tag');
  const arcFilters = FILTERS.filter(f => f.type === 'arc');

  container.innerHTML = `
    <button class="filter-chip type-chip${currentTypeFilter==='all'?' active':''}" data-type="all">${LANG==='en'?'All':'Все'}</button>
    <button class="filter-chip type-chip${currentTypeFilter==='type:video'?' active':''}" data-type="type:video">${LANG==='en'?'Video':'Видео'}</button>
    <button class="filter-chip type-chip${currentTypeFilter==='type:images'?' active':''}" data-type="type:images">${LANG==='en'?'Photo':'Фото'}</button>
    <span class="filter-separator"></span>
    <button class="filter-chip filter-tags-toggle${currentTagFilter?' active':''}" id="filterTagsToggle">${currentTagFilter ? (filterLabel(tagFilters.find(f=>f.id===currentTagFilter))||currentTagFilter)+' ✕' : (LANG==='en'?'Categories ▾':'Разделы ▾')}</button>
    <span class="filter-separator"></span>
    ${arcFilters.map(f => `<button class="filter-chip arc-chip${currentArcFilter===f.id?' active':''}" data-arc="${esc(f.id)}">${esc(filterLabel(f))}</button>`).join('')}
    <span class="filter-separator"></span>
    <button class="filter-chip sort-chip${currentSort==='views'?' active':''}" data-sort="views">👁 ${LANG==='en'?'Views':'Просмотры'}</button>
    <button class="filter-chip sort-chip${currentSort==='likes'?' active':''}" data-sort="likes">❤ ${LANG==='en'?'Likes':'Лайки'}</button>
    ${isAdmin ? `<button class="filter-chip admin-manage-filters-btn" style="border-color:var(--gold);color:var(--gold)">+ Управление</button>` : ''}
    <span class="results-count" id="resultsCount"></span>
    <div class="filter-tags-dropdown" id="filterTagsDropdown">
      ${tagFilters.map(f => `<button class="filter-chip tag-filter-chip${currentTagFilter===f.id?' active':''}" data-tag="${esc(f.id)}">${esc(filterLabel(f))}</button>`).join('')}
    </div>
  `;

  // Type filter clicks (Все/Видео/Фото)
  container.querySelectorAll('.type-chip').forEach(ch => {
    ch.addEventListener('click', () => {
      currentTypeFilter = ch.dataset.type;
      renderFilterChips();
      applyFilters();
    });
  });

  // Arc filter clicks (toggle)
  container.querySelectorAll('.arc-chip').forEach(ch => {
    ch.addEventListener('click', () => {
      currentArcFilter = currentArcFilter === ch.dataset.arc ? null : ch.dataset.arc;
      renderFilterChips();
      applyFilters();
    });
  });

  // Sort toggle
  container.querySelectorAll('.sort-chip[data-sort]').forEach(ch => {
    ch.addEventListener('click', () => {
      currentSort = currentSort === ch.dataset.sort ? 'newest' : ch.dataset.sort;
      renderFilterChips();
      applyFilters();
    });
  });

  const manageBtn = container.querySelector('.admin-manage-filters-btn');
  if (manageBtn) manageBtn.addEventListener('click', openFilterManager);

  // Tags dropdown
  const toggleBtn = container.querySelector('#filterTagsToggle');
  const dropdown = container.querySelector('#filterTagsDropdown');
  if (toggleBtn && dropdown) {
    toggleBtn.addEventListener('click', () => {
      if (currentTagFilter) {
        // Clear tag filter
        currentTagFilter = null;
        renderFilterChips();
        applyFilters();
      } else {
        dropdown.classList.toggle('visible');
      }
    });

    dropdown.querySelectorAll('.tag-filter-chip').forEach(ch => {
      ch.addEventListener('click', () => {
        currentTagFilter = currentTagFilter === ch.dataset.tag ? null : ch.dataset.tag;
        dropdown.classList.remove('visible');
        renderFilterChips();
        applyFilters();
      });
    });
  }

  document.addEventListener('click', (e) => {
    const dd = document.querySelector('#filterTagsDropdown');
    if (dd && !e.target.closest('#filterTagsToggle') && !e.target.closest('#filterTagsDropdown')) {
      dd.classList.remove('visible');
    }
  }, { once: false });
}

// ===== FILTER MANAGER =====
function openFilterManager() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay visible';
  overlay.innerHTML = `
    <div class="modal" style="max-width:680px">
      <button class="modal-close" id="closeFilterMgr">&times;</button>
      <h2 class="modal-title">Управление вкладками</h2>
      <p style="font-size:.75rem;color:var(--text-muted);margin-bottom:.8rem">Кликните на «EN: …» рядом с фильтром, чтобы задать английский перевод (например, «бои» → «fighting»). Это нужно для пользователей, переключивших сайт на английский.</p>
      <div id="filterMgrList"></div>
      <h3 style="font-family:'Space Mono',monospace;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;margin-top:1.2rem;margin-bottom:.6rem;color:var(--text-secondary)">Добавить вкладку</h3>
      <div class="form-row" style="display:flex;gap:.5rem;margin-bottom:.5rem">
        <input class="form-input" id="newFilterId" placeholder="ID (латиницей)" style="flex:1">
        <input class="form-input" id="newFilterLabel" placeholder="Название (RU)" style="flex:1">
        <select class="form-select" id="newFilterType" style="flex:.7"><option value="tag">Тег</option><option value="arc">Арка</option></select>
      </div>
      <input class="form-input" id="newFilterLabelEn" placeholder="Название (EN, опционально — например, fighting)" style="width:100%;margin-bottom:.6rem">
      <button class="btn-submit" id="addFilterBtn">Добавить вкладку</button>
    </div>
  `;
  document.body.appendChild(overlay);

  function renderList() {
    const list = overlay.querySelector('#filterMgrList');
    list.innerHTML = FILTERS.map(f => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.55rem .6rem;border-bottom:1px solid var(--border)">
        <div style="flex:1;min-width:0">
          <div><strong>${esc(f.label)}</strong> <span style="color:var(--text-muted);font-size:.7rem">(${f.id}, ${f.type})</span></div>
          <button class="filter-mgr-edit-en" data-id="${esc(f.id)}" data-current="${esc(f.labelEn || '')}" style="background:none;border:1px dashed var(--border);color:${f.labelEn ? 'var(--gold)' : 'var(--text-muted)'};font-family:'Space Mono',monospace;font-size:.7rem;padding:.2rem .5rem;border-radius:var(--radius);cursor:pointer;margin-top:.3rem">
            EN: ${f.labelEn ? esc(f.labelEn) : '— задать перевод —'}
          </button>
        </div>
        <button class="filter-mgr-del" data-id="${esc(f.id)}" title="Удалить" style="background:var(--accent);border:none;color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:.85rem;flex-shrink:0">×</button>
      </div>
    `).join('');

    // Delete handlers
    list.querySelectorAll('.filter-mgr-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(`Удалить фильтр «${btn.dataset.id}»?`)) return;
        await fetch('/api/filters', { method:'DELETE', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({id:btn.dataset.id}) });
        await loadAnimatorsAndFilters(); renderList(); renderFilterChips();
      });
    });

    // Edit EN-label handlers
    list.querySelectorAll('.filter-mgr-edit-en').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const current = btn.dataset.current || '';
        const newVal = prompt(`Английское название для «${id}»\n(например, fighting / character acting / transformation):`, current);
        if (newVal === null) return; // cancelled
        try {
          const res = await fetch(`/api/filters/${encodeURIComponent(id)}/label-en`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
            body: JSON.stringify({ labelEn: newVal.trim() })
          });
          const data = await res.json();
          if (data.success) {
            await loadAnimatorsAndFilters();
            renderList();
            renderFilterChips();
            notify(newVal.trim() ? `EN-перевод сохранён` : 'EN-перевод убран');
          } else notify(data.error || 'Ошибка', true);
        } catch { notify('Ошибка сети', true); }
      });
    });
  }
  renderList();

  overlay.querySelector('#addFilterBtn').addEventListener('click', async () => {
    const id = overlay.querySelector('#newFilterId').value.trim();
    const label = overlay.querySelector('#newFilterLabel').value.trim();
    const labelEn = overlay.querySelector('#newFilterLabelEn').value.trim();
    const type = overlay.querySelector('#newFilterType').value;
    if (!id || !label) { notify('Заполните ID и название', true); return; }
    const res = await fetch('/api/filters', { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({id,label,labelEn,type}) });
    const data = await res.json();
    if (data.success) {
      await loadAnimatorsAndFilters(); renderList(); renderFilterChips();
      overlay.querySelector('#newFilterId').value='';
      overlay.querySelector('#newFilterLabel').value='';
      overlay.querySelector('#newFilterLabelEn').value='';
      notify('Вкладка добавлена');
    } else notify(data.error, true);
  });

  overlay.querySelector('#closeFilterMgr').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function renderClipPage(clip) {
  // Track current clip-page so setLang() can re-render after language switch.
  currentClipPage = clip;
  // Hide all pages and header nav
  $$('.page').forEach(p => p.classList.remove('active'));

  // Drop any existing clip-page (e.g. from a previous render or language switch)
  // so we don't end up with two of them in the DOM, both potentially with playing video.
  document.querySelectorAll('.page.clip-page').forEach(el => el.remove());

  // Create clip page
  const page = document.createElement('div');
  page.className = 'page active clip-page';
  page.innerHTML = `
    <div class="clip-page-container">
      <a href="/" class="back-btn clip-page-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        ${t('back_to_browse')}
      </a>

      ${clip.videoUrl ? `
        <div class="clip-page-video">
          <video controls autoplay class="clip-page-player" id="clipPageVideo">
            <source src="${clip.videoUrl}">
          </video>
          <div class="timecode-bar" id="clipPageTimecodeBar"></div>
          <div class="frame-controls">
            <button class="frame-btn" id="framePrevBtn" title="Предыдущий кадр (←)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="5" width="3" height="14"/><polygon points="20 5 10 12 20 19"/></svg>
            </button>
            <span class="frame-info" id="frameInfo">Кадр: 0:00.000</span>
            <button class="frame-btn" id="frameNextBtn" title="Следующий кадр (→)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="17" y="5" width="3" height="14"/><polygon points="4 5 14 12 4 19"/></svg>
            </button>
            <select class="frame-fps-select" id="frameFpsSelect" title="Частота кадров">
              <option value="24">24 fps</option>
              <option value="23.976">23.976 fps</option>
              <option value="30">30 fps</option>
              <option value="25">25 fps</option>
              <option value="12">12 fps (2s)</option>
              <option value="8">8 fps (3s)</option>
            </select>
          </div>
        </div>
      ` : ''}

      ${clip.images && clip.images.length ? `
        <div class="clip-page-gallery">
          ${clip.images.map((img, i) => `
            <div class="clip-page-gallery-item">
              <img src="${img.url}" alt="" loading="lazy">
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="clip-page-info">
        <h1 class="clip-page-title">${esc(clipTitle(clip))}</h1>
        <div class="clip-page-current-animator" id="clipPageCurrentAnimator"></div>
        <div class="clip-page-meta">
          <span>${LANG === 'en' ? 'Episode' : 'Эпизод'} ${esc(clip.episode)}</span>
          <span class="clip-meta-divider">·</span>
          <span>${esc(clip.arc)}</span>
          ${clip.quality ? `<span class="clip-meta-divider">·</span><span>${clip.quality}</span>` : ''}
          ${clip.views ? `<span class="clip-meta-divider">·</span><span>👁 ${clip.views}</span>` : ''}
        </div>

        <!-- Like is the primary action — bigger, separated from secondary actions -->
        <div class="clip-page-like-row">
          <button class="clip-like-btn ${likedByMe.has(String(clip.id)) ? 'liked' : ''}" data-like-clip="${clip.id}" title="${LANG === 'en' ? 'Like this clip' : 'Поставить лайк'}">
            <span class="like-heart">♥</span>
            <span class="like-count">${likeCounts[clip.id] || 0}</span>
            <span class="like-label">${LANG === 'en' ? (likedByMe.has(String(clip.id)) ? 'Liked' : 'Like') : (likedByMe.has(String(clip.id)) ? 'Нравится' : 'Лайк')}</span>
          </button>
        </div>

        <!-- Secondary actions: share / download -->
        <div class="clip-page-actions">
          <button class="clip-action-btn" data-action="share-copy" title="${LANG === 'en' ? 'Copy link' : 'Скопировать ссылку'}">
            🔗 <span>${LANG === 'en' ? 'Copy link' : 'Ссылка'}</span>
          </button>
          <button class="clip-action-btn" data-action="share-tg" title="${LANG === 'en' ? 'Share on Telegram' : 'В Telegram'}">
            ✈ <span>Telegram</span>
          </button>
          <button class="clip-action-btn" data-action="share-twitter" title="X / Twitter">
            𝕏 <span>X</span>
          </button>
          ${clip.videoUrl ? `<a class="clip-action-btn" href="${esc(clip.videoUrl)}" download title="${LANG === 'en' ? 'Download video' : 'Скачать видео'}">
            ⬇ <span>${LANG === 'en' ? 'Download' : 'Скачать'}</span>
          </a>` : ''}
        </div>

        <div class="clip-page-tags">
          ${clip.animators.map(a => `<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
          ${clip.tags.map(tg => `<span class="clip-tag category">${esc(tagLabel(tg))}</span>`).join('')}
        </div>

        ${clipNotes(clip) ? `<div class="clip-page-notes">${esc(clipNotes(clip)).replace(/\n/g, '<br>')}</div>` : ''}

        <div class="clip-page-timecodes" id="clipPageTimecodes"></div>
      </div>
    </div>
  `;

  document.querySelector('.header').after(page);

  // Wire up actions: like / share / download.
  // The download button is a plain <a download>, so we don't need JS for it.
  page.querySelector('[data-like-clip]')?.addEventListener('click', () => toggleLike(clip.id));
  page.querySelector('[data-action="share-copy"]')?.addEventListener('click', async () => {
    const url = window.location.origin + '/clip/' + clip.id;
    try {
      await navigator.clipboard.writeText(url);
      notify(LANG === 'en' ? 'Link copied' : 'Ссылка скопирована');
    } catch {
      // Fallback for old browsers / non-https
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); notify(LANG === 'en' ? 'Link copied' : 'Ссылка скопирована'); }
      catch { notify(LANG === 'en' ? 'Copy failed' : 'Не удалось скопировать', true); }
      document.body.removeChild(ta);
    }
  });
  page.querySelector('[data-action="share-tg"]')?.addEventListener('click', () => {
    const url = window.location.origin + '/clip/' + clip.id;
    const text = clipTitle(clip);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
  page.querySelector('[data-action="share-twitter"]')?.addEventListener('click', () => {
    const url = window.location.origin + '/clip/' + clip.id;
    const text = clipTitle(clip);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
  // Setup timecodes
  const timecodes = parseTimecodes(clip.timecodes);
  if (timecodes.length) {
    const tcContainer = page.querySelector('#clipPageTimecodes');
    tcContainer.innerHTML = `
      <h3 class="clip-page-section-title">${t('timecodes_title')}</h3>
      ${timecodes.map((tc, i) => `
        <div class="timecode-item" data-time="${tc.time}">
          <span class="timecode-time">${tc.label}</span>
          <span class="timecode-name">${esc(tc.name)}</span>
        </div>
      `).join('')}
    `;

    tcContainer.querySelectorAll('.timecode-item').forEach(el => {
      el.addEventListener('click', () => {
        const video = page.querySelector('#clipPageVideo');
        if (video) { video.currentTime = parseFloat(el.dataset.time); video.play(); }
      });
    });

    // Video timecode markers and tracking
    const video = page.querySelector('#clipPageVideo');
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        const bar = page.querySelector('#clipPageTimecodeBar');
        if (bar && video.duration) {
          bar.innerHTML = timecodes.map(tc => {
            const pct = (tc.time / video.duration * 100).toFixed(2);
            return `<div class="timecode-marker" style="left:${pct}%" data-time="${tc.time}"><div class="timecode-marker-tooltip">${tc.label} — ${esc(tc.name)}</div></div>`;
          }).join('');
          bar.querySelectorAll('.timecode-marker').forEach(m => {
            m.addEventListener('click', () => { video.currentTime = parseFloat(m.dataset.time); video.play(); });
          });
        }
      });

      // Track current animator
      setInterval(() => {
        const t = video.currentTime;
        let current = null;
        for (let i = timecodes.length - 1; i >= 0; i--) {
          if (t >= timecodes[i].time) { current = timecodes[i]; break; }
        }
        page.querySelector('#clipPageCurrentAnimator').textContent = current ? `▶ ${current.name}` : '';
        tcContainer.querySelectorAll('.timecode-item').forEach((el, idx) => {
          el.classList.toggle('active', current && timecodes.indexOf(current) === idx);
        });
      }, 300);
    }
  }

  // Animator tag clicks
  page.querySelectorAll('.clip-tag.animator').forEach(tag => {
    tag.addEventListener('click', () => {
      window.location.href = '/?animator=' + encodeURIComponent(tag.dataset.animator);
    });
  });

  // Frame-by-frame controls
  const frameVideo = page.querySelector('#clipPageVideo');
  const frameInfo = page.querySelector('#frameInfo');
  const fpsSelect = page.querySelector('#frameFpsSelect');

  if (frameVideo && frameInfo) {
    let fps = 24;

    if (fpsSelect) {
      fpsSelect.addEventListener('change', () => { fps = parseFloat(fpsSelect.value); });
    }

    function formatFrameTime(t) {
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      const ms = Math.floor((t % 1) * 1000);
      return `${m}:${s.toString().padStart(2,'0')}.${ms.toString().padStart(3,'0')}`;
    }

    function updateFrameInfo() {
      const t = frameVideo.currentTime;
      const frameNum = Math.round(t * fps);
      frameInfo.textContent = `${LANG==='en'?'Frame':'Кадр'} ${frameNum} · ${formatFrameTime(t)}`;
    }

    function stepFrame(direction) {
      frameVideo.pause();
      frameVideo.currentTime = Math.max(0, frameVideo.currentTime + (direction / fps));
      updateFrameInfo();
    }

    const prevBtn = page.querySelector('#framePrevBtn');
    const nextBtn = page.querySelector('#frameNextBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => stepFrame(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => stepFrame(1));

    frameVideo.addEventListener('timeupdate', updateFrameInfo);
    frameVideo.addEventListener('seeked', updateFrameInfo);

    // Keyboard: arrow keys for frame stepping when video is paused
    document.addEventListener('keydown', function frameKeyHandler(e) {
      if (!document.body.contains(frameVideo)) {
        document.removeEventListener('keydown', frameKeyHandler);
        return;
      }
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === ',' || (e.key === 'ArrowLeft' && frameVideo.paused)) { e.preventDefault(); stepFrame(-1); }
      if (e.key === '.' || (e.key === 'ArrowRight' && frameVideo.paused)) { e.preventDefault(); stepFrame(1); }
    });
  }

  // Photo click to enlarge
  const galleryItems = page.querySelectorAll('.clip-page-gallery-item img');
  galleryItems.forEach((img, idx) => {
    img.addEventListener('click', () => {
      openClipPageImageViewer(clip.images.map(i => i.url), idx);
    });
  });

  // Record view
  fetch(`/api/clips/${clip.id}/view`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userToken:getUserToken()})}).catch(()=>{});

  // Add comments section. Tucked close to the clip-info above (the container's
  // bottom padding is reduced via CSS so they don't drift apart).
  const commentsHtml = `<div class="clip-page-comments" style="max-width:960px;margin:0 auto;padding:0 1rem 3rem">
    <div class="player-notes-label">${esc(t('comments_title'))}</div>
    <div class="comments-list" id="clipPageCommentsList"></div>
    <div class="comment-form">
      <input class="comment-nick" id="clipPageCommentNick" type="text" placeholder="${esc(t('comment_nick_placeholder'))}" maxlength="30" autocomplete="off">
      <textarea class="comment-text" id="clipPageCommentText" placeholder="${esc(t('comment_placeholder'))}" maxlength="1000"></textarea>
      <button class="comment-submit" id="clipPageCommentBtn">${esc(t('comment_send'))}</button>
    </div>
  </div>`;
  page.insertAdjacentHTML('beforeend', commentsHtml);

  // Load comments
  loadClipPageComments(clip.id);
  
  $('#clipPageCommentBtn').addEventListener('click', async () => {
    const nick = $('#clipPageCommentNick').value.trim();
    const text = $('#clipPageCommentText').value.trim();
    if (!nick) { notify('Укажите ник', true); return; }
    if (!text) { notify('Напишите комментарий', true); return; }
    localStorage.setItem('sp_comment_nick', nick);
    try {
      const res = await fetch(`/api/clips/${clip.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nick, text, userToken: getUserToken() })
      });
      const d = await res.json();
      if (d.success) { $('#clipPageCommentText').value = ''; loadClipPageComments(clip.id); }
      else notify(d.error, true);
    } catch { notify('Ошибка сети', true); }
  });
  
  $('#clipPageCommentText').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#clipPageCommentBtn').click(); }
  });

  // Restore nick
  const savedNick = localStorage.getItem('sp_comment_nick');
  if (savedNick && $('#clipPageCommentNick')) $('#clipPageCommentNick').value = savedNick;
}

async function loadClipPageComments(clipId) {
  const list = $('#clipPageCommentsList');
  if (!list) return;
  const hdrs = {'X-User-Token':getUserToken()};
  if (adminToken) hdrs['X-Admin-Token'] = adminToken;
  try {
    const res = await fetch(`/api/clips/${clipId}/comments`, {headers:hdrs});
    const comments = await res.json();
    renderClipPageComments(comments, clipId);
  } catch { list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">Ошибка загрузки</span>'; }
}

function renderClipPageComments(comments, clipId) {
  const list = $('#clipPageCommentsList');
  if (!comments.length) { list.innerHTML = `<span style="color:var(--text-muted);font-size:.8rem">${esc(t('comment_no_comments'))}</span>`; return; }
  const dateLocale = LANG === 'en' ? 'en-US' : 'ru-RU';
  const editedTag = LANG === 'en' ? '(edited)' : '(ред.)';
  list.innerHTML = comments.map(c => {
    const date = new Date(c.createdAt);
    const timeStr = date.toLocaleDateString(dateLocale,{day:'numeric',month:'short'}) + ' ' + date.toLocaleTimeString(dateLocale,{hour:'2-digit',minute:'2-digit'});
    const edited = c.editedAt ? ` <span style="font-size:.6rem;color:var(--text-muted)">${esc(editedTag)}</span>` : '';
    return `<div class="comment-item${c.isOwn ? ' comment-own' : ''}">
      <div class="comment-header">
        <span class="comment-nickname">${esc(c.nickname)}</span>
        <span class="comment-time">${timeStr}${edited}</span>
        ${c.isOwn ? `<button class="comment-edit-btn" data-clip-id="${clipId}" data-comment-id="${c.id}" data-text="${esc(c.text)}">✎</button>` : ''}
        ${c.isOwn || isAdmin ? `<button class="comment-delete" data-clip-id="${clipId}" data-comment-id="${c.id}">×</button>` : ''}
        ${isAdmin && c.userToken && !c.isOwn ? `<button class="comment-ban-btn" data-user-token="${esc(c.userToken)}" data-nickname="${esc(c.nickname)}">🚫</button>` : ''}
      </div>
      <div class="comment-body">${esc(c.text).replace(/\n/g,'<br>')}</div>
    </div>`;
  }).join('');
  list.querySelectorAll('.comment-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm(LANG === 'en' ? 'Delete this comment?' : 'Удалить комментарий?')) return;
      const headers = {}; if (isAdmin) headers['X-Admin-Token'] = adminToken; headers['X-User-Token'] = getUserToken();
      try { const r = await fetch(`/api/clips/${btn.dataset.clipId}/comments/${btn.dataset.commentId}`,{method:'DELETE',headers}); const d = await r.json(); if(d.success) loadClipPageComments(parseInt(btn.dataset.clipId)); else notify(d.error,true); } catch { notify('Ошибка сети',true); }
    });
  });
  list.querySelectorAll('.comment-edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newText = prompt(LANG === 'en' ? 'Edit your comment:' : 'Редактировать:', btn.dataset.text); if(!newText||!newText.trim()) return;
      try { const r = await fetch(`/api/clips/${btn.dataset.clipId}/comments/${btn.dataset.commentId}`,{method:'PUT',headers:{'Content-Type':'application/json','X-User-Token':getUserToken()},body:JSON.stringify({text:newText.trim()})}); const d = await r.json(); if(d.success) loadClipPageComments(parseInt(btn.dataset.clipId)); else notify(d.error,true); } catch { notify('Ошибка сети',true); }
    });
  });
}

// ===== CLIP PAGE IMAGE VIEWER =====
function openClipPageImageViewer(images, startIdx) {
  let currentIdx = startIdx;

  const overlay = document.createElement('div');
  overlay.className = 'clip-page-lightbox';
  overlay.innerHTML = `
    <button class="clip-page-lightbox-close">&times;</button>
    <button class="clip-page-lightbox-nav prev">‹</button>
    <img class="clip-page-lightbox-img" src="${images[currentIdx]}">
    <button class="clip-page-lightbox-nav next">›</button>
    <div class="clip-page-lightbox-counter">${currentIdx + 1} / ${images.length}</div>
  `;

  const imgEl = overlay.querySelector('.clip-page-lightbox-img');
  const counter = overlay.querySelector('.clip-page-lightbox-counter');
  const prevBtn = overlay.querySelector('.prev');
  const nextBtn = overlay.querySelector('.next');

  function update() {
    imgEl.src = images[currentIdx];
    counter.textContent = `${currentIdx + 1} / ${images.length}`;
    prevBtn.style.visibility = currentIdx > 0 ? 'visible' : 'hidden';
    nextBtn.style.visibility = currentIdx < images.length - 1 ? 'visible' : 'hidden';
  }

  prevBtn.addEventListener('click', e => { e.stopPropagation(); if (currentIdx > 0) { currentIdx--; update(); } });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); if (currentIdx < images.length - 1) { currentIdx++; update(); } });
  overlay.querySelector('.clip-page-lightbox-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  // Keyboard
  function onKey(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); }
    if (e.key === 'ArrowLeft' && currentIdx > 0) { currentIdx--; update(); }
    if (e.key === 'ArrowRight' && currentIdx < images.length - 1) { currentIdx++; update(); }
  }
  document.addEventListener('keydown', onKey);

  // Swipe
  let tx = 0;
  overlay.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - tx;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentIdx < images.length - 1) { currentIdx++; update(); }
      if (diff > 0 && currentIdx > 0) { currentIdx--; update(); }
    }
  }, { passive: true });

  update();
  document.body.appendChild(overlay);
}

// Apply translations once DOM is parsed; init() will run after data load
applyI18n();

// Language toggle button
document.getElementById('langToggleBtn')?.addEventListener('click', () => {
  setLang(LANG === 'ru' ? 'en' : 'ru');
});

// Random clip button — opens a random clip's page
document.getElementById('randomClipBtn')?.addEventListener('click', async () => {
  try {
    const r = await fetch('/api/clips/random');
    if (!r.ok) throw new Error();
    const d = await r.json();
    if (d.id) window.location.href = '/clip/' + d.id;
  } catch {
    notify(LANG === 'en' ? 'No clips yet' : 'Клипов нет', true);
  }
});

// Theme toggle: light/dark. Persisted in localStorage. Default = dark.
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'light' ? '☀' : '🌙';
}
const savedTheme = localStorage.getItem('sp_theme') || 'dark';
applyTheme(savedTheme);
document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem('sp_theme', next);
  applyTheme(next);
});

init();
