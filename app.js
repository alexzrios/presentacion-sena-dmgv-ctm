/* ==========================================================================
   Presentation Engine · SENA CTM Itagüí · Tecnología en DMGV
   100% Offline-capable Vanilla JS
   ========================================================================== */
(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;

  const stage = document.getElementById('deckStage');
  const stageWrapper = document.getElementById('stageWrapper');
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const activeCondPill = document.getElementById('activeCondPill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const notesDrawer = document.getElementById('notesDrawer');
  const notesText = document.getElementById('notesText');
  const notesBtn = document.getElementById('notesBtn');
  const overviewBtn = document.getElementById('overviewBtn');
  const overviewModal = document.getElementById('overviewModal');
  const overviewGrid = document.getElementById('overviewGrid');
  const closeOverview = document.getElementById('closeOverview');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const printBtn = document.getElementById('printBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCap');
  const refModal = document.getElementById('refModal');
  const refTitle = document.getElementById('refTitle');
  const refUrl = document.getElementById('refUrl');
  const refImg = document.getElementById('refImg');
  const refDesc = document.getElementById('refDesc');
  const closeRefModal = document.getElementById('closeRefModal');
  const sectionPills = Array.from(document.querySelectorAll('.section-pill'));

  // Responsive 16:9 scaling
  function scaleStage() {
    if (!stage || !stageWrapper) return;
    const padX = 28;
    const padY = 20;
    const availW = stageWrapper.clientWidth - padX;
    const availH = stageWrapper.clientHeight - padY;
    const scale = Math.min(availW / 1280, availH / 720, 1.45);
    stage.style.transform = `scale(${Math.max(scale, 0.25)})`;
  }
  window.addEventListener('resize', scaleStage);
  scaleStage();

  // Populate slide footers & slide numbers automatically
  slides.forEach((slide, idx) => {
    const numEl = slide.querySelector('.slide-num');
    if (numEl) numEl.textContent = `${idx + 1} / ${total}`;
  });

  // Build Overview Grid
  function buildOverview() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide, idx) => {
      const sec = slide.dataset.sectionLabel || 'Sección';
      const title = slide.dataset.title || `Diapositiva ${idx + 1}`;
      const card = document.createElement('div');
      card.className = 'ov-card' + (idx === current ? ' current' : '');
      card.innerHTML = `
        <div class="ov-num"><span>#${idx + 1}</span><span>${sec}</span></div>
        <div class="ov-title">${title}</div>
      `;
      card.addEventListener('click', () => {
        goTo(idx);
        overviewModal.classList.remove('open');
      });
      overviewGrid.appendChild(card);
    });
  }

  function updateSectionPills() {
    const secKey = slides[current].dataset.section;
    sectionPills.forEach(p => {
      p.classList.toggle('active', p.dataset.targetSection === secKey);
    });
  }

  function pauseVideos() {
    document.querySelectorAll('video').forEach(v => {
      if (!v.paused) v.pause();
    });
  }

  function goTo(index) {
    const nextIdx = Math.max(0, Math.min(total - 1, index));
    if (nextIdx !== current) pauseVideos();
    slides[current].classList.remove('active');
    current = nextIdx;
    slides[current].classList.add('active');

    slideCounter.textContent = `${current + 1} / ${total}`;
    progressFill.style.width = `${((current + 1) / total) * 100}%`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    // Update speaker notes
    const note = slides[current].dataset.notes || 'Sin notas adicionales para esta diapositiva.';
    notesText.textContent = note;

    updateSectionPills();
    if (activeCondPill) {
      const secMap = {
        inicio: 'Inicio · Portada y Agenda',
        contexto: 'Contexto Institucional · CTM Itagüí',
        c1: 'Condición 1 de 9 · Denominación',
        c2: 'Condición 2 de 9 · Justificación',
        c3: 'Condición 3 de 9 · Aspectos Curriculares',
        c4: 'Condición 4 de 9 · Org. Actividades Académicas',
        c5: 'Condición 5 de 9 · Investigación (CTM)',
        c6: 'Condición 6 de 9 · Sector Externo (CTM)',
        c7: 'Condición 7 de 9 · Profesores (CTM)',
        c8: 'Condición 8 de 9 · Medios Educativos (CTM)',
        c9: 'Condición 9 de 9 · Infraestructura (CTM)',
        video: 'Recorrido Audiovisual CTM y Cierre'
      };
      activeCondPill.textContent = slides[current].dataset.condBadge || secMap[slides[current].dataset.section] || slides[current].dataset.sectionLabel || '';
    }
    history.replaceState(null, '', `#slide-${current + 1}`);
  }

  // Expose jump helper for Agenda cards
  window.jumpToSlide = (oneBased) => goTo(oneBased - 1);
  window.jumpToSection = (secKey) => { const idx = slides.findIndex(s => s.dataset.section === secKey); if (idx >= 0) goTo(idx); };

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Section pill jumps
  sectionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetSec = pill.dataset.targetSection;
      const idx = slides.findIndex(s => s.dataset.section === targetSec);
      if (idx >= 0) goTo(idx);
    });
  });

  // Notes drawer toggle
  function toggleNotes() {
    notesDrawer.classList.toggle('open');
    notesBtn.classList.toggle('active', notesDrawer.classList.contains('open'));
  }
  notesBtn.addEventListener('click', toggleNotes);
  document.getElementById('closeNotes').addEventListener('click', toggleNotes);

  // Overview modal
  function toggleOverview() {
    const willOpen = !overviewModal.classList.contains('open');
    if (willOpen) buildOverview();
    overviewModal.classList.toggle('open', willOpen);
  }
  overviewBtn.addEventListener('click', toggleOverview);
  closeOverview.addEventListener('click', () => overviewModal.classList.remove('open'));

  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // Print / PDF
  printBtn.addEventListener('click', () => window.print());

  // Lightbox for real photos
  document.addEventListener('click', (e) => {
    const frame = e.target.closest('.photo-frame');
    if (!frame) return;
    const img = frame.querySelector('img');
    const cap = frame.dataset.caption || frame.querySelector('.photo-caption')?.textContent?.replace('Ampliar', '').trim() || '';
    if (img) {
      lightboxImg.src = img.src;
      lightboxCap.textContent = cap;
      lightbox.classList.add('open');
    }
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('open'));

  // Platform Reference Modal Card (Slide 39)
  document.addEventListener('click', (e) => {
    const pCard = e.target.closest('.platform-card');
    if (!pCard || !refModal) return;
    refTitle.textContent = pCard.dataset.refTitle || '';
    refUrl.textContent = pCard.dataset.refUrl || '';
    refImg.src = pCard.dataset.refImg || '';
    refImg.alt = pCard.dataset.refTitle || 'Referencia plataforma';
    refDesc.innerHTML = pCard.dataset.refDesc || '';
    refModal.classList.add('open');
  });
  if (closeRefModal && refModal) {
    closeRefModal.addEventListener('click', () => refModal.classList.remove('open'));
    refModal.addEventListener('click', (e) => {
      if (e.target === refModal) refModal.classList.remove('open');
    });
  }

  // Generic Interactive Tabs
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn[data-tab]');
    const panels = container.querySelectorAll('.tab-panel[data-panel]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.tab;
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === key));
      });
    });
  });

  // Instructor table filter
  document.querySelectorAll('.inst-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('.inst-filter').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('#instructorsTable tbody tr').forEach(row => {
        const tipo = row.dataset.tipo;
        row.style.display = (filter === 'all' || tipo === filter) ? '' : 'none';
      });
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (refModal && refModal.classList.contains('open')) {
      if (e.key === 'Escape') refModal.classList.remove('open');
      return;
    }
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') lightbox.classList.remove('open');
      return;
    }
    if (overviewModal.classList.contains('open')) {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'g') overviewModal.classList.remove('open');
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        if (document.activeElement?.tagName !== 'VIDEO') {
          e.preventDefault();
          goTo(current + 1);
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goTo(current - 1);
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(total - 1);
        break;
      case 'g':
      case 'G':
        toggleOverview();
        break;
      case 'n':
      case 'N':
        toggleNotes();
        break;
      case 'f':
      case 'F':
        fullscreenBtn.click();
        break;
    }
  });

  // Deep link support (#slide-X) & live hashchange navigation
  function syncFromHash() {
    const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
    if (hashMatch) {
      goTo(parseInt(hashMatch[1], 10) - 1);
    } else {
      goTo(0);
    }
  }
  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
})();
