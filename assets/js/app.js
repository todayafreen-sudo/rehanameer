/**
 * MovixWires - Client-Side Orchestration Engine
 * Handles dynamic JSON database ingestion, real-time universal search,
 * reactive filtering, modal overlays, and seamless DOM rendering.
 */

const MovixWires = (function () {
  const state = {
    movies: [],
    tvshows: [],
    people: [],
    awards: [],
    news: [],
    earnGuides: [],
    activeFilter: 'all',
    searchQuery: '',
    selectedItem: null,
    itemsPerPage: 12,
    currentPage: 1,
    loaded: false
  };

  async function loadData() {
    try {
      const [moviesRes, tvRes, peopleRes, awardsRes, newsRes, earnRes] = await Promise.all([
        fetch('data/movies.json').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('data/tvshows.json').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('data/people.json').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('data/awards.json').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('data/news.json').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('data/earn_guides.json').then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      state.movies = moviesRes;
      state.tvshows = tvRes;
      state.people = peopleRes;
      state.awards = awardsRes;
      state.news = newsRes;
      state.earnGuides = earnRes;
      state.loaded = true;

      document.dispatchEvent(new CustomEvent('movixwires:data-loaded', { detail: state }));
      document.dispatchEvent(new CustomEvent('mediadb:data-loaded', { detail: state }));
      initUI();
    } catch (err) {
      console.error('[MovixWires] Error loading catalog datasets:', err);
    }
  }

  function renderSpotlight() {
    const spotlightContainer = document.getElementById('cinematic-spotlight-container');
    if (!spotlightContainer || state.movies.length === 0) return;

    const featured = state.movies[0];
    spotlightContainer.innerHTML = `
      <div class="cinematic-spotlight relative">
        <img src="${featured.backdrop || featured.poster}" alt="${featured.title}" class="cinematic-backdrop">
        <div class="cinematic-overlay"></div>
        <div class="cinematic-content">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">Spotlight of the Week</span>
            <span class="text-amber-400 font-bold text-sm">★ ${featured.rating}</span>
            <span class="text-slate-300 text-xs">• ${featured.release_year} • ${featured.runtime}</span>
          </div>
          <h1 class="font-serif text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
            ${featured.title}
          </h1>
          <p class="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">
            ${featured.overview}
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <button onclick="MovixWires.openModal('movie', '${featured.id}')" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center gap-2">
              <span>View Film Overview & Reviews</span> →
            </button>
            <span class="text-xs text-slate-300 bg-white/10 backdrop-blur px-3 py-2 rounded-lg border border-white/20">
              Streaming: ${featured.streaming ? featured.streaming.join(', ') : 'Theatrical Premiere'}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  function renderCards(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 font-medium">
          No records found matching your selected criteria.
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      const title = item.title || item.name;
      const subtitle = item.release_year || item.first_air_date ? (item.release_year || item.first_air_date.split('-')[0]) : (item.role || '');
      const rating = item.rating ? `★ ${item.rating}` : (item.awards_won ? `🏆 ${item.awards_won} Awards` : '');
      const image = item.poster || item.photo || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80';

      return `
        <article class="media-card cursor-pointer group" onclick="MovixWires.openModal('${type}', '${item.id}')">
          <div class="media-poster-wrapper">
            <img src="${image}" alt="${title}" loading="lazy">
            ${rating ? `<span class="badge-score">${rating}</span>` : ''}
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                ${subtitle} ${item.genres ? '• ' + item.genres.slice(0, 2).join(', ') : ''}
              </div>
              <h3 class="font-serif text-base font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-1">
                ${title}
              </h3>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>${item.director ? 'Dir: ' + item.director : (item.network || item.known_for_department || 'Read Dossier')}</span>
              <span class="text-amber-600 font-semibold group-hover:translate-x-1 transition">Details →</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function openModal(type, id) {
    let item = null;
    if (type === 'movie') item = state.movies.find(m => m.id === id);
    else if (type === 'tv') item = state.tvshows.find(t => t.id === id);
    else if (type === 'person') item = state.people.find(p => p.id === id);

    if (!item) return;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'mediadb-modal-backdrop';
    modalBackdrop.id = 'active-modal-overlay';
    modalBackdrop.onclick = (e) => {
      if (e.target === modalBackdrop) closeModal();
    };

    const title = item.title || item.name;
    const image = item.backdrop || item.poster || item.photo;

    modalBackdrop.innerHTML = `
      <div class="mediadb-modal-content">
        <div class="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img src="${image}" alt="${title}" class="w-full h-full object-cover opacity-60">
          <button onclick="MovixWires.closeModal()" class="absolute top-4 right-4 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center font-bold text-lg hover:bg-black transition">
            ✕
          </button>
          <div class="absolute bottom-4 left-6 right-6 text-white">
            <span class="px-2.5 py-0.5 bg-amber-500 text-white rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              ${type.toUpperCase()} DOSSIER
            </span>
            <h2 class="font-serif text-2xl sm:text-4xl font-bold leading-tight drop-shadow-md">${title}</h2>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex flex-wrap gap-4 text-xs font-medium text-slate-600 pb-3 border-b border-slate-100">
            ${item.rating ? `<span class="text-amber-600 font-bold text-sm">★ Score: ${item.rating}/10 (${item.votes || 'Guild Verified'})</span>` : ''}
            ${item.release_year ? `<span>Released: ${item.release_year}</span>` : ''}
            ${item.runtime ? `<span>Runtime: ${item.runtime}</span>` : ''}
            ${item.certification ? `<span class="border border-slate-300 px-1.5 py-0.5 rounded">${item.certification}</span>` : ''}
            ${item.status ? `<span class="bg-slate-100 px-2 py-0.5 rounded text-slate-700">${item.status}</span>` : ''}
          </div>

          <p class="text-slate-700 leading-relaxed font-serif text-base sm:text-lg">
            ${item.overview || item.biography || 'Comprehensive archive entry cataloged in MovixWires registries.'}
          </p>

          ${item.cast ? `
            <div class="pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Cast & Credits</h4>
              <div class="flex flex-wrap gap-1.5">
                ${item.cast.map(c => `<span class="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-800">${c}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${item.streaming ? `
            <div class="pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Where to Stream / View</h4>
              <div class="flex flex-wrap gap-2">
                ${item.streaming.map(s => `<span class="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold">✓ ${s}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${item.notable_works ? `
            <div class="pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Notable Filmography & Credits</h4>
              <div class="flex flex-wrap gap-1.5">
                ${item.notable_works.map(w => `<span class="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-800">${w}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);
  }

  function closeModal() {
    const modal = document.getElementById('active-modal-overlay');
    if (modal) modal.remove();
  }

  function setupUniversalSearch() {
    const searchInputs = document.querySelectorAll('.universal-search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        state.searchQuery = query;

        const filteredMovies = state.movies.filter(m => 
          m.title.toLowerCase().includes(query) ||
          (m.director && m.director.toLowerCase().includes(query)) ||
          (m.overview && m.overview.toLowerCase().includes(query))
        );

        const filteredTV = state.tvshows.filter(t => 
          t.name.toLowerCase().includes(query) ||
          (t.overview && t.overview.toLowerCase().includes(query))
        );

        const filteredPeople = state.people.filter(p => 
          p.name.toLowerCase().includes(query) ||
          (p.biography && p.biography.toLowerCase().includes(query))
        );

        renderCards('movies-grid-container', filteredMovies, 'movie');
        renderCards('tv-grid-container', filteredTV, 'tv');
        renderCards('people-grid-container', filteredPeople, 'person');
      });
    });
  }

  function initUI() {
    renderSpotlight();
    renderCards('movies-grid-container', state.movies, 'movie');
    renderCards('tv-grid-container', state.tvshows, 'tv');
    renderCards('people-grid-container', state.people, 'person');
    setupUniversalSearch();
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }

  return {
    state,
    loadData,
    renderCards,
    openModal,
    closeModal
  };
})();

if (typeof window !== 'undefined') {
  window.MovixWires = MovixWires;
  window.MediaDB = MovixWires;
}
