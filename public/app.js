// ===== ANIMATORS & FILTERS — loaded from server =====
let ANIMATORS = [];
let FILTERS = [];

async function loadAnimatorsAndFilters() {
  try { ANIMATORS = await (await fetch('/api/animators')).json(); } catch { ANIMATORS = []; }
  try { FILTERS = await (await fetch('/api/filters')).json(); } catch { FILTERS = []; }
}

// ===== STATE =====
let allClips = [];
let currentFilter = 'all';
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

const ADMIN_PASSWORD = 'jefp1ece2005';

// ===== HELPERS =====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const TAG_RU = {fighting:'бой',effects:'эффекты',character_acting:'эктинг',transformation:'трансформация',gear5:'gear 5',haki:'хаки'};
function tagLabel(t){return TAG_RU[t]||t}
function pluralRu(n){const m=n%10,h=n%100;if(m===1&&h!==11)return'';if(m>=2&&m<=4&&(h<12||h>14))return'а';return'ов'}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML}
function getInitials(n){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}

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
    $(`.nav-link[data-page="animators"]`).classList.add('active');
    renderAnimatorProfile(data);
  }
  if (page === 'animators') renderAnimatorGrid();
  window.scrollTo(0, 0);
}
$$('.nav-link[data-page]').forEach(b => b.addEventListener('click', () => navigateTo(b.dataset.page)));
$('#backToAnimatorsBtn').addEventListener('click', () => navigateTo('animators'));

// ===== LOAD CLIPS =====
async function loadClips() {
  try { allClips = await (await fetch('/api/clips')).json(); } catch { allClips = []; }
  applyFilters();
}

// ===== CLIP CARD =====
function renderClipCard(clip, i) {
  const hasVideo = !!clip.videoUrl;
  const hasImages = clip.images && clip.images.length > 0;
  const hasThumbnail = !!clip.thumbnailUrl;

  const thumbContent = hasThumbnail
    ? `<img src="${clip.thumbnailUrl}" alt="">`
    : hasVideo
      ? `<video src="${clip.videoUrl}" muted preload="metadata"></video>`
      : hasImages
        ? `<img src="${clip.images[0].url}" alt="">`
        : `<div class="clip-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>`;

  const badge = hasVideo ? (clip.quality || '1080p') : (hasImages ? 'ФОТО' : '');
  const imgCount = hasImages && clip.images.length > 1 ? `<span class="clip-img-count">${clip.images.length} фото</span>` : '';

  return `<div class="clip-card" data-id="${clip.id}" style="animation-delay:${i*0.04}s">
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
      <div class="clip-meta"><span>Эп. ${esc(clip.episode)}</span><span class="clip-meta-divider">·</span><span>${esc(clip.arc)}</span></div>
      <div class="clip-tags">
        ${clip.animators.map(a=>`<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}
        ${clip.tags.slice(0,2).map(t=>`<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}
      </div>
    </div>
  </div>`;
}

function attachClipEvents(container) {
  container.querySelectorAll('.clip-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.admin-delete-btn')) { e.stopPropagation(); confirmDeleteClip(parseInt(e.target.closest('.admin-delete-btn').dataset.deleteId)); return; }
      if (e.target.closest('.admin-edit-btn')) { e.stopPropagation(); openEditModal(parseInt(e.target.closest('.admin-edit-btn').dataset.editId)); return; }
      if (e.target.closest('.clip-tag.animator')) { e.stopPropagation(); navigateTo('animator-profile', e.target.closest('.clip-tag.animator').dataset.animator); return; }
      const clip = allClips.find(c => c.id === parseInt(card.dataset.id));
      if (!clip) return;
      if (clip.videoUrl) {
        // Video: open in overlay on same page
        openPlayer(clip.id);
      } else if (clip.images && clip.images.length >= 4) {
        // Many photos: open in new tab
        window.open(`/clip/${clip.id}`, '_blank');
      } else if (clip.images && clip.images.length > 0) {
        // Few photos: open lightbox
        openClipPageImageViewer(clip.images.map(i => i.url), 0);
      }
    });
  });
}

function renderClips(clips) {
  $('#resultsCount').textContent = `${clips.length} клип${pluralRu(clips.length)}`;
  if (!clips.length) { $('#clipGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted);font-size:1rem">Клипы не найдены</p><p style="color:var(--text-muted);font-size:.8rem;margin-top:.4rem">Попробуйте другой запрос или загрузите новый клип</p></div>`; return; }
  $('#clipGrid').innerHTML = clips.map((c,i) => renderClipCard(c,i)).join('');
  attachClipEvents($('#clipGrid'));
}

// ===== FILTERS =====
function applyFilters() {
  const q = ($('#searchInput')?.value||'').toLowerCase().trim();
  let clips = allClips;
  if (currentFilter === 'type:video') {
    clips = clips.filter(c => c.videoUrl);
  } else if (currentFilter === 'type:images') {
    clips = clips.filter(c => !c.videoUrl && c.images && c.images.length > 0);
  } else if (currentFilter !== 'all') {
    clips = clips.filter(c => c.tags.includes(currentFilter) || c.arc.toLowerCase() === currentFilter.toLowerCase());
  }
  if (q) clips = clips.filter(c => c.title.toLowerCase().includes(q) || c.animators.some(a=>a.toLowerCase().includes(q)) || c.tags.some(t=>t.toLowerCase().includes(q)) || c.arc.toLowerCase().includes(q) || c.episode.includes(q));
  renderClips(clips);
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
  const items=[];am.forEach((c,key)=>{const display=ANIMATORS.find(a=>a.toLowerCase()===key)||key;items.push({type:'animator',name:display,count:c})});tm.forEach((c,n)=>items.push({type:'tag',name:tagLabel(n),raw:n,count:c}));
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
  let list=ANIMATORS.map(n=>({name:n,count:counts.get(n.toLowerCase())||0}));
  if(q) list=list.filter(a=>a.name.toLowerCase().includes(q));
  list.sort((a,b)=>b.count!==a.count?b.count-a.count:a.name.localeCompare(b.name));

  let adminAddHtml = '';
  if (isAdmin) {
    adminAddHtml = `<div class="animator-card animator-add-card" id="addAnimatorCard" style="border-style:dashed;border-color:var(--gold);justify-content:center;gap:.5rem;cursor:pointer">
      <span style="color:var(--gold);font-size:1.5rem">+</span>
      <span style="color:var(--gold);font-family:'Space Mono',monospace;font-size:.75rem">Добавить аниматора</span>
    </div>`;
  }

  if(!list.length && !isAdmin){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">Аниматор не найден</p></div>`;return}

  grid.innerHTML = adminAddHtml + list.map((a,i)=>`<div class="animator-card" data-name="${esc(a.name)}" style="animation-delay:${i*0.025}s">
    <div class="animator-avatar">${getInitials(a.name)}</div>
    <div class="animator-card-info"><div class="animator-card-name">${esc(a.name)}</div><div class="animator-card-count">${a.count} клип${pluralRu(a.count)}</div></div>
    ${isAdmin ? `<button class="animator-card-edit" data-edit-name="${esc(a.name)}" title="Переименовать" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:.9rem;margin-right:.2rem">✎</button><button class="animator-card-delete" data-del-name="${esc(a.name)}" title="Удалить" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.2rem;margin-right:.3rem">×</button>` : ''}
    <svg class="animator-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
  </div>`).join('');

  grid.querySelectorAll('.animator-card[data-name]').forEach(c=>c.addEventListener('click', e => {
    if (e.target.closest('.animator-card-delete')) return;
    if (e.target.closest('.animator-card-edit')) return;
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

  // Admin: delete animator
  grid.querySelectorAll('.animator-card-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const name = btn.dataset.delName;
      if (!confirm(`Удалить аниматора «${name}»?`)) return;
      await fetch('/api/animators', { method:'DELETE', headers:{'Content-Type':'application/json','X-Admin-Password':ADMIN_PASSWORD}, body:JSON.stringify({name}) });
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
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': ADMIN_PASSWORD },
        body: JSON.stringify({ oldName, newName: newName.trim() })
      });
      const data = await res.json();
      if (data.success) { await loadAnimatorsAndFilters(); await loadClips(); renderAnimatorGrid(); notify(`«${oldName}» → «${newName.trim()}»`); }
      else notify(data.error, true);
    });
  });
}

async function addAnimator(name) {
  const res = await fetch('/api/animators', { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Password':ADMIN_PASSWORD}, body:JSON.stringify({name}) });
  const data = await res.json();
  if (data.success) { await loadAnimatorsAndFilters(); renderAnimatorGrid(); notify(`«${name}» добавлен`); }
  else notify(data.error, true);
}
$('#animatorSearchInput')?.addEventListener('input', renderAnimatorGrid);

// ===== ANIMATOR PROFILE =====
function renderAnimatorProfile(name) {
  $('#animatorProfileName').textContent=name;
  const clips=allClips.filter(c=>c.animators.some(a=>a.toLowerCase()===name.toLowerCase()));
  const arcs=[...new Set(clips.map(c=>c.arc))];
  let stats=`${clips.length} клип${pluralRu(clips.length)}`;
  if(arcs.length)stats+=` · ${arcs.join(', ')}`;
  $('#animatorProfileStats').textContent=stats;
  const grid=$('#animatorClipGrid');
  if(!clips.length){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0"><p style="color:var(--text-muted)">Пока нет загруженных клипов</p><p style="color:var(--text-muted);font-size:.8rem;margin-top:.4rem">Загрузите клип для этого аниматора!</p></div>`}
  else{grid.innerHTML=clips.map((c,i)=>renderClipCard(c,i)).join('');attachClipEvents(grid)}
}

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
  const matches=ANIMATORS.filter(a=>a.toLowerCase().includes(q));
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
  const title=$('#clipTitleInput').value.trim(), episode=$('#episodeInput').value.trim(), arc=$('#arcSelect').value, tags=$('#tagsInput').value.trim(), notes=$('#notesInput').value.trim();
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

  $('#submitBtn').disabled=true;$('#uploadProgress').classList.add('visible');

  try{
    const xhr=new XMLHttpRequest();
    xhr.upload.addEventListener('progress',e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);$('#progressBarFill').style.width=p+'%';$('#progressText').textContent=`Загрузка... ${p}%`}});
    await new Promise((ok,no)=>{
      xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300)ok(JSON.parse(xhr.responseText));else{try{no(new Error(JSON.parse(xhr.responseText).error))}catch{no(new Error('Ошибка'))}}};
      xhr.onerror=()=>no(new Error('Ошибка сети'));
      xhr.open('POST','/api/clips');xhr.setRequestHeader('X-Admin-Password',ADMIN_PASSWORD);xhr.send(fd);
    });
    $('#uploadForm').reset();selectedAnimators=[];selectedImages=[];selectedFile=null;selectedThumbnail=null;renderAnimatorChips();renderImagePreviews();$('#fileInfo').classList.remove('visible');removeThumbnail();
    const p=$('#uploadPreviewPlayer');if(p.src){p.pause();URL.revokeObjectURL(p.src);p.removeAttribute('src')}$('#uploadVideoPreview').style.display='none';
    closeUploadModal();notify(`«${title}» загружен!`);await loadClips();
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
  $('#playerTitle').textContent=clip.title;
  $('#playerCurrentAnimator').textContent='';
  $('#playerDetails').innerHTML=`<span class="clip-meta" style="font-size:.75rem">Эп. ${esc(clip.episode)} · ${esc(clip.arc)}</span>${clip.animators.map(a=>`<span class="clip-tag animator" data-animator="${esc(a)}">${esc(a)}</span>`).join('')}${clip.tags.map(t=>`<span class="clip-tag category">${esc(tagLabel(t))}</span>`).join('')}`;
  $('#playerDetails').querySelectorAll('.clip-tag.animator').forEach(t=>t.addEventListener('click',()=>{closePlayer();navigateTo('animator-profile',t.dataset.animator)}));

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
}
function closePlayer(){if(timecodeInterval){clearInterval(timecodeInterval);timecodeInterval=null}$('#playerVideo').pause();$('#playerVideo').removeAttribute('src');$('#playerOverlay').classList.remove('visible');document.body.style.overflow=''}
$('#playerCloseBtn').addEventListener('click',closePlayer);
$('#playerOverlay').addEventListener('click',e=>{if(e.target===$('#playerOverlay'))closePlayer()});

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
// Restore admin session
if (sessionStorage.getItem('sp_admin') === ADMIN_PASSWORD) {
  isAdmin = true;
  document.body.classList.add('admin-mode');
}

$('#adminToggleBtn').addEventListener('click',()=>{
  if(isAdmin){isAdmin=false;document.body.classList.remove('admin-mode');sessionStorage.removeItem('sp_admin');notify('Вышли из режима админа');renderFilterChips();if(currentPage==='animators')renderAnimatorGrid();}
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

function tryLogin(){
  if($('#adminPasswordInput').value===ADMIN_PASSWORD){isAdmin=true;document.body.classList.add('admin-mode');sessionStorage.setItem('sp_admin',ADMIN_PASSWORD);$('#adminLoginModal').classList.remove('visible');document.body.style.overflow='';notify('Режим админа включён');renderFilterChips();if(currentPage==='animators')renderAnimatorGrid();}
  else{$('#adminLoginError').style.display='block';$('#adminPasswordInput').value='';$('#adminPasswordInput').focus()}
}

// ===== EDIT CLIP =====
let editingClipId = null;

function openEditModal(id) {
  const clip = allClips.find(c => c.id === id);
  if (!clip) return;
  editingClipId = id;
  $('#editTitleInput').value = clip.title;
  $('#editAnimatorInput').value = clip.animators.join(', ');
  $('#editEpisodeInput').value = clip.episode;
  $('#editArcSelect').value = clip.arc;
  $('#editTagsInput').value = clip.tags.join(', ');
  $('#editNotesInput').value = clip.notes || '';
  $('#editTimecodesInput').value = clip.timecodes || '';
  // Thumbnail preview
  const tp = $('#editThumbnailPreview');
  const rb = $('#editThumbnailRemoveBtn');
  if (clip.thumbnailUrl) { tp.src = clip.thumbnailUrl; tp.style.display = 'block'; rb.style.display = ''; }
  else { tp.src = ''; tp.style.display = 'none'; rb.style.display = 'none'; }
  $('#editModal').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  $('#editModal').classList.remove('visible');
  document.body.style.overflow = '';
  editingClipId = null;
}

$('#closeEditBtn').addEventListener('click', closeEditModal);
$('#editModal').addEventListener('click', e => { if (e.target === $('#editModal')) closeEditModal(); });
$('#editCancelBtn').addEventListener('click', closeEditModal);

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
      headers: { 'X-Admin-Password': ADMIN_PASSWORD },
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

$('#editSaveBtn').addEventListener('click', async () => {
  if (!editingClipId) return;
  const body = {
    title: $('#editTitleInput').value.trim(),
    animators: $('#editAnimatorInput').value.trim(),
    episode: $('#editEpisodeInput').value.trim(),
    arc: $('#editArcSelect').value,
    tags: $('#editTagsInput').value.trim(),
    notes: $('#editNotesInput').value.trim(),
    timecodes: $('#editTimecodesInput').value.trim()
  };
  if (!body.title || !body.animators || !body.episode) {
    notify('Заполните название, аниматора и эпизод', true);
    return;
  }
  try {
    const res = await fetch(`/api/clips/${editingClipId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': ADMIN_PASSWORD },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      notify('Клип обновлён');
      closeEditModal();
      await loadClips();
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
  try{const r=await fetch(`/api/clips/${id}`,{method:'DELETE',headers:{'X-Admin-Password':ADMIN_PASSWORD}});const d=await r.json();
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

  // Check if navigating to animator
  const params = new URLSearchParams(window.location.search);
  if (params.get('animator')) {
    navigateTo('animator-profile', params.get('animator'));
  }
}

function renderFilterChips() {
  const container = document.querySelector('.filters');
  if (!container) return;

  const tagFilters = FILTERS.filter(f => f.type === 'tag');
  const arcFilters = FILTERS.filter(f => f.type === 'arc');

  container.innerHTML = `
    <button class="filter-chip active" data-filter="all">Все</button>
    <button class="filter-chip" data-filter="type:video">Видео</button>
    <button class="filter-chip" data-filter="type:images">Фото</button>
    <span class="filter-separator"></span>
    ${tagFilters.map(f => `<button class="filter-chip" data-filter="${esc(f.id)}">${esc(f.label)}</button>`).join('')}
    <span class="filter-separator"></span>
    ${arcFilters.map(f => `<button class="filter-chip" data-filter="${esc(f.id)}">${esc(f.label)}</button>`).join('')}
    ${isAdmin ? `<button class="filter-chip admin-manage-filters-btn" style="border-color:var(--gold);color:var(--gold)">+ Управление</button>` : ''}
    <span class="results-count" id="resultsCount"></span>
  `;

  container.querySelectorAll('.filter-chip[data-filter]').forEach(ch => {
    ch.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      ch.classList.add('active');
      currentFilter = ch.dataset.filter;
      applyFilters();
    });
  });

  const manageBtn = container.querySelector('.admin-manage-filters-btn');
  if (manageBtn) manageBtn.addEventListener('click', openFilterManager);
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
        await fetch('/api/filters', { method:'DELETE', headers:{'Content-Type':'application/json','X-Admin-Password':ADMIN_PASSWORD}, body:JSON.stringify({id:btn.dataset.id}) });
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
    const res = await fetch('/api/filters', { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Password':ADMIN_PASSWORD}, body:JSON.stringify({id,label,type}) });
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
