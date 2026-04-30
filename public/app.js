// ===== ANIMATORS & FILTERS — loaded from server =====
let ANIMATORS = [];
let FILTERS = [];
let EPISODES_DATA = { hidden: [], renamed: {} };
let HIDDEN_ANIMATORS = [];
let DIRECTORS = [];
let EPISODE_DIRECTORS = {}; // { "1015": "Megumi Ishitani", ... }

async function loadAnimatorsAndFilters() {
  try { ANIMATORS = await (await fetch('/api/animators')).json(); } catch { ANIMATORS = []; }
  try { FILTERS = await (await fetch('/api/filters')).json(); } catch { FILTERS = []; }
  try { EPISODES_DATA = await (await fetch('/api/episodes')).json(); } catch { EPISODES_DATA = { hidden: [], renamed: {} }; }
  try { HIDDEN_ANIMATORS = await (await fetch('/api/animators/hidden')).json(); } catch { HIDDEN_ANIMATORS = []; }
  try { DIRECTORS = await (await fetch('/api/directors')).json(); } catch { DIRECTORS = []; }
  try { EPISODE_DIRECTORS = await (await fetch('/api/episode-directors')).json(); } catch { EPISODE_DIRECTORS = {}; }
}

// Returns the effective director for a clip: override > episode director > null
function getClipDirector(clip) {
  if (!clip) return null;
  if (clip.directorOverride) return clip.directorOverride;
  const ep = (clip.episode || '').trim();
  return EPISODE_DIRECTORS[ep] || null;
}
// Director for an episode (from the episode-directors map only)
function getEpisodeDirector(ep) {
  return EPISODE_DIRECTORS[String(ep).trim()] || null;
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
let currentPage = 'browse';
let currentAnimatorProfile = null;
let isAdmin = false;
let clipToDelete = null;
let viewerImages = [];
let viewerIndex = 0;

let adminToken = null;
let commentCounts = {};

// ===== HELPERS =====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const TAG_RU = {fighting:'бой',effects:'эффекты',character_acting:'эктинг',transformation:'трансформация',gear5:'gear 5',haki:'хаки'};
function tagLabel(t){return TAG_RU[t]||t}
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
function navigateTo(page, data) {
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
    renderEpisodeProfile(data);
  }
  if (page === 'animators') renderAnimatorGrid();
  if (page === 'episodes') renderEpisodeGrid();
  // Update URL hash
  if (page === 'browse') window.history.pushState({page}, '', '#');
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
  } else {
    navigateToSilent('browse');
  }
});

// Same as navigateTo but without pushState (to avoid infinite loop)
function navigateToSilent(page, data) {
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
  applyFilters();
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

  const badge = hasVideo ? (clip.quality || '1080p') : (hasImages ? 'ФОТО' : '');
  const imgCount = hasImages && clip.images.length > 1 ? `<span class="clip-img-count">${clip.images.length} фото</span>` : '';

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
      ${imgCount}
      ${hasVideo
        ? `<div class="clip-play-overlay"><div class="play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg></div></div>`
        : `<div class="clip-hover-dim"></div>`}
    </div>
    <div class="clip-info">
      <div class="clip-title">${esc(clip.title)}</div>
      <div class="clip-meta"><span>Эп. ${esc(clip.episode)}</span><span class="clip-meta-divider">·</span><span>${esc(clip.arc)}</span>${clip.views ? `<span class="clip-meta-divider">·</span><span class="clip-views">👁 ${clip.views}</span>` : ''}${commentCounts[clip.id] ? `<span class="clip-meta-divider">·</span><span class="clip-views">💬 ${commentCounts[clip.id]}</span>` : ''}</div>
      <div class="clip-tags" data-clip-id="${clip.id}">
        ${clip.animators.map(a => `<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
        ${clip.tags.slice(0,2).map(t => `<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}
        ${clip.episode ? `<span class="clip-tag category">${esc(clip.episode)}</span>` : ''}
      </div>
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
        const filter = FILTERS.find(f => f.label.toLowerCase() === tagText.toLowerCase() || f.id.toLowerCase() === tagText.toLowerCase());
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
  renderClipPage_browse();
}

function renderClipPage_browse() {
  const grid = $('#clipGrid');
  const total = currentClipList.length;
  const totalPages = Math.ceil(total / CLIPS_PER_PAGE);
  const page = Math.min(currentPage_clips, totalPages || 1);
  currentPage_clips = page;
  
  $('#resultsCount').textContent = `${total} клип${pluralRu(total)}`;
  
  if (!total) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted);font-size:1rem">Клипы не найдены</p></div>`;
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
      renderClipPage_browse();
      window.scrollTo(0, 0);
    });
  });
}

function renderPagination(current, total) {
  if (total <= 1) return '';
  let btns = [];
  
  btns.push(`<button class="pagination-btn${current<=1?' disabled':''}" data-page="${current-1}">← Назад</button>`);
  
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
  
  btns.push(`<button class="pagination-btn${current>=total?' disabled':''}" data-page="${current+1}">Вперёд →</button>`);
  
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
  
  if (q) clips = clips.filter(c => c.title.toLowerCase().includes(q) || c.animators.some(a=>a.toLowerCase().includes(q)) || c.tags.some(t=>t.toLowerCase().includes(q)) || c.arc.toLowerCase().includes(q) || c.episode.includes(q));
  
  // Sort
  if (currentSort === 'views') {
    clips = [...clips].sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  
  // Show filter description
  const descEl = $('#filterDescription');
  if (descEl) {
    const filter = FILTERS.find(f => f.id === currentTagFilter);
    if (filter && filter.description) {
      descEl.innerHTML = `<div class="filter-desc-text">${esc(filter.description)}</div>${isAdmin ? `<button class="filter-desc-edit" id="editFilterDescBtn">✎</button>` : ''}`;
      descEl.style.display = '';
      const editBtn = descEl.querySelector('#editFilterDescBtn');
      if (editBtn) editBtn.addEventListener('click', () => editFilterDescription(currentTagFilter));
    } else if (isAdmin && currentTagFilter) {
      descEl.innerHTML = `<button class="filter-desc-add" id="addFilterDescBtn">+ Добавить описание</button>`;
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
  const current = filter?.description || '';
  const desc = prompt('Описание для тега:', current);
  if (desc === null) return;
  try {
    const res = await fetch(`/api/filters/${filterId}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ description: desc.trim() })
    });
    const data = await res.json();
    if (data.success) { await loadAnimatorsAndFilters(); applyFilters(); notify('Описание обновлено'); }
    else notify(data.error, true);
  } catch { notify('Ошибка сети', true); }
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
  sug.innerHTML=items.slice(0,8).map(it=>`<div class="suggestion-item" data-value="${esc(it.raw||it.name)}" data-type="${it.type}"><span class="suggestion-type ${it.type}">${it.type==='animator'?'аниматор':'тег'}</span><span class="suggestion-name">${esc(it.name)}</span><span class="suggestion-count">${it.count} клип${pluralRu(it.count)}</span></div>`).join('');
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

  if(!list.length && !isAdmin){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">Аниматор не найден</p></div>`;return}

  grid.innerHTML = adminAddHtml + list.map((a,i)=>`<div class="animator-card${a.hidden?' episode-hidden':''}" data-name="${esc(a.name)}" style="animation-delay:${i*0.025}s">
    <div class="animator-avatar">${getInitials(a.name)}</div>
    <div class="animator-card-info"><div class="animator-card-name">${esc(a.name)}${a.hidden?' <span style="font-size:.6rem;color:var(--text-muted)">(скрыт)</span>':''}</div><div class="animator-card-count">${a.count} клип${pluralRu(a.count)}</div></div>
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
      if (!confirm(`Удалить аниматора «${name}» навсегда?`)) return;
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

async function addAnimator(name) {
  const res = await fetch('/api/animators', { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({name}) });
  const data = await res.json();
  if (data.success) { await loadAnimatorsAndFilters(); renderAnimatorGrid(); notify(`«${name}» добавлен`); }
  else notify(data.error, true);
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
  let stats=`${allAnimatorClips.length} клип${pluralRu(allAnimatorClips.length)}`;
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
  if(!clips.length){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">Нет клипов в этой категории</p></div>`}
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

  // Filter by director
  if (episodeDirectorFilter !== 'all') {
    list = list.filter(e => e.director && e.director.toLowerCase() === episodeDirectorFilter.toLowerCase());
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
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">Серии не найдены</p></div>`;
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
    const hiddenLabel = isHidden(e.episode) ? ' <span style="font-size:.6rem;color:var(--text-muted)">(скрыта)</span>' : '';
    // Если есть режиссёр — выводим "ED: Имя" как заголовок и арку/клипы как подзаголовок.
    // Если нет — выводим только арку и количество клипов.
    const mainLine = e.director
      ? `ED: ${esc(e.director)}${hiddenLabel}`
      : `${e.arc} · ${e.count} клип${pluralRu(e.count)}${hiddenLabel}`;
    const subLine = e.director
      ? `${e.arc} · ${e.count} клип${pluralRu(e.count)}`
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
  });
});

// Director dropdown filter for episodes page
function refreshEpisodeDirectorDropdown() {
  const dd = $('#episodeDirectorDropdown');
  const toggle = $('#episodeDirectorToggle');
  if (!dd || !toggle) return;
  // Build list: "Все" + only directors that have at least one assigned episode
  const usedDirectors = [...new Set(Object.values(EPISODE_DIRECTORS).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const items = [{ key:'all', label:'Все' }, ...usedDirectors.map(d => ({ key:d, label:d }))];
  dd.innerHTML = items.map(it => `<button class="filter-chip${episodeDirectorFilter === it.key ? ' active' : ''}" data-episode-director="${esc(it.key)}">${esc(it.label)}</button>`).join('');
  // Update toggle button state
  if (episodeDirectorFilter !== 'all') {
    toggle.textContent = episodeDirectorFilter + ' ✕';
    toggle.classList.add('active');
  } else {
    toggle.textContent = 'Режиссёр ▾';
    toggle.classList.remove('active');
  }
  // Wire up clicks
  dd.querySelectorAll('[data-episode-director]').forEach(b => {
    b.addEventListener('click', () => {
      episodeDirectorFilter = b.dataset.episodeDirector;
      dd.classList.remove('visible');
      renderEpisodeGrid();
      refreshEpisodeDirectorDropdown();
    });
  });
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
function renderEpisodeProfile(episode) {
  $('#episodeProfileName').textContent = `Серия ${episode}`;
  const clips = allClips.filter(c => c.episode.trim() === episode);
  const arc = getEpisodeArc(parseInt(episode) || 0);
  const animators = [...new Set(clips.flatMap(c => c.animators))];
  let stats = `${arc} · ${clips.length} клип${pluralRu(clips.length)}`;
  if (animators.length) stats += ` · ${animators.length} аниматор${pluralRu(animators.length)}`;
  $('#episodeProfileStats').textContent = stats;

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
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">Пока нет клипов для этой серии</p></div>`;
  } else {
    grid.innerHTML = clips.map((c, i) => renderClipCard(c, i)).join('');
    attachClipEvents(grid);
  }
}

// Renders the director block on the episode profile page
function renderEpisodeDirectorBlock(episode) {
  const block = $('#episodeDirectorBlock');
  if (!block) return;
  const dir = getEpisodeDirector(episode);
  if (dir) {
    block.innerHTML = `
      <span class="episode-director-label">ED:</span>
      <span class="episode-director-name">${esc(dir)}</span>
      ${isAdmin ? `
        <button class="episode-director-edit" data-action="edit-director">Изменить</button>
        <button class="episode-director-clear" data-action="clear-director" title="Убрать режиссёра">×</button>
      ` : ''}
    `;
  } else if (isAdmin) {
    block.innerHTML = `<button class="episode-director-edit" data-action="edit-director">+ Указать режиссёра</button>`;
  } else {
    block.innerHTML = '';
  }

  // Wire up admin actions
  block.querySelector('[data-action="edit-director"]')?.addEventListener('click', async () => {
    const current = getEpisodeDirector(episode) || '';
    const name = prompt(`Режиссёр серии ${episode}:`, current);
    if (name === null) return; // cancelled
    const trimmed = name.trim();
    await setEpisodeDirector(episode, trimmed);
  });
  block.querySelector('[data-action="clear-director"]')?.addEventListener('click', async () => {
    if (!confirm(`Убрать режиссёра серии ${episode}?`)) return;
    await setEpisodeDirector(episode, '');
  });
}

async function setEpisodeDirector(episode, director) {
  try {
    const res = await fetch(`/api/episode-directors/${encodeURIComponent(episode)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ director })
    });
    const data = await res.json();
    if (!data.success) { notify(data.error || 'Не удалось сохранить', true); return; }
    // Refresh in-memory data
    EPISODE_DIRECTORS = await (await fetch('/api/episode-directors')).json();
    DIRECTORS = await (await fetch('/api/directors')).json();
    renderEpisodeDirectorBlock(episode);
    notify(director ? `Режиссёр серии ${episode}: ${director}` : `Режиссёр серии ${episode} убран`);
  } catch { notify('Ошибка сети', true); }
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
  const title=$('#clipTitleInput').value.trim(), episode=$('#episodeInput').value.trim(), arc=$('#arcSelect').value, tags=selectedTags.join(','), notes=$('#notesInput').value.trim();
  if(!selectedFile&&!selectedImages.length){notify('Загрузите видео или хотя бы одно фото',true);return}
  if(!title){notify('Введите название',true);return}
  if(!selectedAnimators.length){notify('Выберите аниматора',true);return}
  if(!episode){notify('Введите номер эпизода',true);return}

  const fd=new FormData();
  if(selectedFile)fd.append('video',selectedFile);
  if(selectedThumbnail)fd.append('thumbnail',selectedThumbnail);
  selectedImages.forEach(f=>fd.append('images',f));
  fd.append('title',title);fd.append('animators',selectedAnimators.join(', '));fd.append('episode',episode);fd.append('arc',arc);fd.append('tags',tags);fd.append('notes',notes);
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
    $('#uploadForm').reset();selectedAnimators=[];selectedTags=[];selectedImages=[];selectedFile=null;selectedThumbnail=null;renderAnimatorChips();renderTagChips();renderImagePreviews();$('#fileInfo').classList.remove('visible');removeThumbnail();
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
    const frac = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    const totalSeconds = mins * 60 + secs;

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
  $('#playerTitle').textContent=clip.title;
  $('#playerCurrentAnimator').textContent='';
  $('#playerDetails').innerHTML=`<span class="clip-meta" style="font-size:.75rem">Эп. ${esc(clip.episode)} · ${esc(clip.arc)}</span>${clip.animators.map(a=>`<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}${clip.tags.map(t=>`<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}`;
  $('#playerDetails').querySelectorAll('.clip-tag.animator').forEach(t=>t.addEventListener('click',()=>{closePlayer();navigateTo('animator-profile',t.dataset.animator)}));

  // Notes
  const notesEl = $('#playerNotes');
  if (clip.notes && clip.notes.trim()) {
    notesEl.innerHTML = `<div class="player-notes-label">Заметки</div><div class="player-notes-text">${esc(clip.notes).replace(/\n/g, '<br>')}</div>`;
    notesEl.style.display = '';
  } else {
    notesEl.innerHTML = '';
    notesEl.style.display = 'none';
  }

  // Attached images
  const imagesEl = $('#playerImages');
  if (clip.images && clip.images.length) {
    imagesEl.innerHTML = `<div class="player-notes-label">Фотографии</div><div class="player-images-grid">${clip.images.map((img, idx) => `<img class="player-image-thumb" src="${img.url}" data-idx="${idx}" alt="">`).join('')}</div>`;
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
        $('#playerVideo').currentTime = parseInt(el.dataset.time);
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
            video.currentTime = parseInt(m.dataset.time);
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
  list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">Загрузка...</span>';
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
    list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">Пока нет комментариев</span>';
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
  $('#imageViewerTitle').textContent=clip.title;
  $('#imageViewerDetails').innerHTML=`<span class="clip-meta" style="font-size:.75rem">Эп. ${esc(clip.episode)} · ${esc(clip.arc)}</span>${clip.animators.map(a=>`<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}`;
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
      if(d.valid){adminToken=savedToken;isAdmin=true;document.body.classList.add('admin-mode');}
      else{localStorage.removeItem('sp_admin_token');}
    }catch{localStorage.removeItem('sp_admin_token');}
  }
})();

$('#adminToggleBtn').addEventListener('click',async()=>{
  if(isAdmin){
    try{await fetch('/api/logout',{method:'POST',headers:{'X-Admin-Token':adminToken}})}catch{}
    isAdmin=false;adminToken=null;document.body.classList.remove('admin-mode');localStorage.removeItem('sp_admin_token');notify('Вышли из режима админа');renderFilterChips();if(currentPage==='animators')renderAnimatorGrid();
  }
  else{$('#adminLoginModal').classList.add('visible');document.body.style.overflow='hidden';$('#adminPasswordInput').value='';$('#adminLoginError').style.display='none';setTimeout(()=>$('#adminPasswordInput').focus(),100)}
});
$('#passwordToggleBtn').addEventListener('click', () => {
  const inp = $('#adminPasswordInput');
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  $('#eyeOpen').style.display = isHidden ? 'none' : 'block';
  $('#eyeClosed').style.display = isHidden ? 'block' : 'none';
});

$('#closeAdminLoginBtn').addEventListener('click',()=>{$('#adminLoginModal').classList.remove('visible');document.body.style.overflow=''});
$('#adminLoginModal').addEventListener('click',e=>{if(e.target===$('#adminLoginModal')){$('#adminLoginModal').classList.remove('visible');document.body.style.overflow=''}});
$('#adminLoginBtn').addEventListener('click',tryLogin);
$('#adminPasswordInput').addEventListener('keydown',e=>{if(e.key==='Enter')tryLogin()});

async function tryLogin(){
  const pwd=$('#adminPasswordInput').value;
  try{
    const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pwd})});
    const d=await r.json();
    if(d.success&&d.token){
      adminToken=d.token;isAdmin=true;document.body.classList.add('admin-mode');
      localStorage.setItem('sp_admin_token',d.token);
      $('#adminLoginModal').classList.remove('visible');document.body.style.overflow='';
      notify('Режим админа включён');renderFilterChips();if(currentPage==='animators')renderAnimatorGrid();
    }else{$('#adminLoginError').style.display='block';$('#adminPasswordInput').value='';$('#adminPasswordInput').focus()}
  }catch{$('#adminLoginError').style.display='block';$('#adminPasswordInput').value='';$('#adminPasswordInput').focus()}
}

// ===== EDIT CLIP =====
let editingClipId = null;

let editSelectedTags = [];

function openEditModal(id) {
  const clip = allClips.find(c => c.id === id);
  if (!clip) return;
  editingClipId = id;
  $('#editTitleInput').value = clip.title;
  $('#editAnimatorInput').value = clip.animators.join(', ');
  $('#editEpisodeInput').value = clip.episode;
  $('#editArcSelect').value = clip.arc;
  editSelectedTags = [...clip.tags];
  renderEditTagChips();
  $('#editTagsInput').value = '';
  $('#editNotesInput').value = clip.notes || '';
  $('#editTimecodesInput').value = clip.timecodes || '';
  $('#editClipOrderInput').value = clip.clipOrder || 0;
  $('#editDirectorOverrideInput').value = clip.directorOverride || '';
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
  const body = {
    title: $('#editTitleInput').value.trim(),
    animators: $('#editAnimatorInput').value.trim(),
    episode: $('#editEpisodeInput').value.trim(),
    arc: $('#editArcSelect').value,
    tags: editSelectedTags.join(','),
    notes: $('#editNotesInput').value.trim(),
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
      closeEditModal();
      await loadClips();
      // Director list may have grown if a new override was set
      try { DIRECTORS = await (await fetch('/api/directors')).json(); } catch {}
      if (currentPage === 'animator-profile' && currentAnimatorProfile) renderAnimatorProfile(currentAnimatorProfile);
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
  if(e.key==='Escape'){closeUploadModal();closePlayer();closeImageViewer();closeDeleteModal();closeEditModal();$('#adminLoginModal').classList.remove('visible');document.body.style.overflow=''}
  if(e.key==='/'&&!e.target.closest('input,textarea,select')){e.preventDefault();if(currentPage==='animators')$('#animatorSearchInput').focus();else $('#searchInput').focus()}
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
  }

  // Check if navigating to animator via query param
  const params = new URLSearchParams(window.location.search);
  if (params.get('animator')) {
    navigateTo('animator-profile', params.get('animator'));
    return;
  }

  // Hash-based routing
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('animator/')) {
    navigateTo('animator-profile', decodeURIComponent(hash.slice(9)));
  } else if (hash.startsWith('episode/')) {
    navigateTo('episode-profile', decodeURIComponent(hash.slice(8)));
  } else if (hash === 'episodes') {
    navigateTo('episodes');
  } else if (hash === 'animators') {
    navigateTo('animators');
  } else if (hash === 'about') {
    navigateTo('about');
  }
}

function renderFilterChips() {
  const container = document.querySelector('.filters');
  if (!container) return;

  const tagFilters = FILTERS.filter(f => f.type === 'tag');
  const arcFilters = FILTERS.filter(f => f.type === 'arc');

  container.innerHTML = `
    <button class="filter-chip type-chip${currentTypeFilter==='all'?' active':''}" data-type="all">Все</button>
    <button class="filter-chip type-chip${currentTypeFilter==='type:video'?' active':''}" data-type="type:video">Видео</button>
    <button class="filter-chip type-chip${currentTypeFilter==='type:images'?' active':''}" data-type="type:images">Фото</button>
    <span class="filter-separator"></span>
    <button class="filter-chip filter-tags-toggle${currentTagFilter?' active':''}" id="filterTagsToggle">${currentTagFilter ? (tagFilters.find(f=>f.id===currentTagFilter)?.label||currentTagFilter)+' ✕' : 'Разделы ▾'}</button>
    <span class="filter-separator"></span>
    ${arcFilters.map(f => `<button class="filter-chip arc-chip${currentArcFilter===f.id?' active':''}" data-arc="${esc(f.id)}">${esc(f.label)}</button>`).join('')}
    <span class="filter-separator"></span>
    <button class="filter-chip sort-chip${currentSort==='views'?' active':''}" data-sort="views">👁 Просмотры</button>
    ${isAdmin ? `<button class="filter-chip admin-manage-filters-btn" style="border-color:var(--gold);color:var(--gold)">+ Управление</button>` : ''}
    <span class="results-count" id="resultsCount"></span>
    <div class="filter-tags-dropdown" id="filterTagsDropdown">
      ${tagFilters.map(f => `<button class="filter-chip tag-filter-chip${currentTagFilter===f.id?' active':''}" data-tag="${esc(f.id)}">${esc(f.label)}</button>`).join('')}
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
    <div class="modal">
      <button class="modal-close" id="closeFilterMgr">&times;</button>
      <h2 class="modal-title">Управление вкладками</h2>
      <div id="filterMgrList"></div>
      <div class="form-row" style="margin-top:1rem">
        <input class="form-input" id="newFilterId" placeholder="ID (латиницей)" style="flex:1">
        <input class="form-input" id="newFilterLabel" placeholder="Название" style="flex:1">
        <select class="form-select" id="newFilterType" style="flex:.7"><option value="tag">Тег</option><option value="arc">Арка</option></select>
      </div>
      <button class="btn-submit" id="addFilterBtn" style="margin-top:.6rem">Добавить вкладку</button>
    </div>
  `;
  document.body.appendChild(overlay);

  function renderList() {
    const list = overlay.querySelector('#filterMgrList');
    list.innerHTML = FILTERS.map(f => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .6rem;border-bottom:1px solid var(--border)">
        <span><strong>${esc(f.label)}</strong> <span style="color:var(--text-muted);font-size:.7rem">(${f.id}, ${f.type})</span></span>
        <button class="filter-mgr-del" data-id="${esc(f.id)}" style="background:var(--accent);border:none;color:#fff;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:.8rem">×</button>
      </div>
    `).join('');
    list.querySelectorAll('.filter-mgr-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch('/api/filters', { method:'DELETE', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({id:btn.dataset.id}) });
        await loadAnimatorsAndFilters(); renderList(); renderFilterChips();
      });
    });
  }
  renderList();

  overlay.querySelector('#addFilterBtn').addEventListener('click', async () => {
    const id = overlay.querySelector('#newFilterId').value.trim();
    const label = overlay.querySelector('#newFilterLabel').value.trim();
    const type = overlay.querySelector('#newFilterType').value;
    if (!id || !label) { notify('Заполните ID и название', true); return; }
    const res = await fetch('/api/filters', { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':adminToken}, body:JSON.stringify({id,label,type}) });
    const data = await res.json();
    if (data.success) { await loadAnimatorsAndFilters(); renderList(); renderFilterChips(); overlay.querySelector('#newFilterId').value=''; overlay.querySelector('#newFilterLabel').value=''; notify('Вкладка добавлена'); }
    else notify(data.error, true);
  });

  overlay.querySelector('#closeFilterMgr').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function renderClipPage(clip) {
  // Hide all pages and header nav
  $$('.page').forEach(p => p.classList.remove('active'));

  // Create clip page
  const page = document.createElement('div');
  page.className = 'page active clip-page';
  page.innerHTML = `
    <div class="clip-page-container">
      <a href="/" class="back-btn clip-page-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        На главную
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
        <h1 class="clip-page-title">${esc(clip.title)}</h1>
        <div class="clip-page-current-animator" id="clipPageCurrentAnimator"></div>
        <div class="clip-page-meta">
          <span>Эпизод ${esc(clip.episode)}</span>
          <span class="clip-meta-divider">·</span>
          <span>${esc(clip.arc)}</span>
          ${clip.quality ? `<span class="clip-meta-divider">·</span><span>${clip.quality}</span>` : ''}
        </div>

        <div class="clip-page-tags">
          ${clip.animators.map(a => `<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
          ${clip.tags.map(t => `<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}
        </div>

        ${clip.notes ? `<div class="clip-page-notes">${esc(clip.notes).replace(/\n/g, '<br>')}</div>` : ''}

        <div class="clip-page-timecodes" id="clipPageTimecodes"></div>
      </div>
    </div>
  `;

  document.querySelector('.header').after(page);

  // Setup timecodes
  const timecodes = parseTimecodes(clip.timecodes);
  if (timecodes.length) {
    const tcContainer = page.querySelector('#clipPageTimecodes');
    tcContainer.innerHTML = `
      <h3 class="clip-page-section-title">Таймкоды аниматоров</h3>
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
        if (video) { video.currentTime = parseInt(el.dataset.time); video.play(); }
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
            m.addEventListener('click', () => { video.currentTime = parseInt(m.dataset.time); video.play(); });
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
      frameInfo.textContent = `Кадр ${frameNum} · ${formatFrameTime(t)}`;
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

  // Add comments section
  const commentsHtml = `<div class="clip-page-comments" style="max-width:960px;margin:0 auto;padding:0 1rem 3rem">
    <div class="player-notes-label">Комментарии</div>
    <div class="comments-list" id="clipPageCommentsList"></div>
    <div class="comment-form">
      <input class="comment-nick" id="clipPageCommentNick" type="text" placeholder="Ваш ник" maxlength="30" autocomplete="off">
      <textarea class="comment-text" id="clipPageCommentText" placeholder="Написать комментарий..." maxlength="1000"></textarea>
      <button class="comment-submit" id="clipPageCommentBtn">Отправить</button>
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
  if (!comments.length) { list.innerHTML = '<span style="color:var(--text-muted);font-size:.8rem">Пока нет комментариев</span>'; return; }
  list.innerHTML = comments.map(c => {
    const date = new Date(c.createdAt);
    const timeStr = date.toLocaleDateString('ru-RU',{day:'numeric',month:'short'}) + ' ' + date.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
    const edited = c.editedAt ? ' <span style="font-size:.6rem;color:var(--text-muted)">(ред.)</span>' : '';
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
      if (!confirm('Удалить комментарий?')) return;
      const headers = {}; if (isAdmin) headers['X-Admin-Token'] = adminToken; headers['X-User-Token'] = getUserToken();
      try { const r = await fetch(`/api/clips/${btn.dataset.clipId}/comments/${btn.dataset.commentId}`,{method:'DELETE',headers}); const d = await r.json(); if(d.success) loadClipPageComments(parseInt(btn.dataset.clipId)); else notify(d.error,true); } catch { notify('Ошибка сети',true); }
    });
  });
  list.querySelectorAll('.comment-edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newText = prompt('Редактировать:',btn.dataset.text); if(!newText||!newText.trim()) return;
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

init();
