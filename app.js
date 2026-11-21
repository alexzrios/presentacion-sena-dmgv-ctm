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
  const rapModal = document.getElementById('rapModal');
  const rapTitle = document.getElementById('rapTitle');
  const rapSubtitle = document.getElementById('rapSubtitle');
  const rapTechList = document.getElementById('rapTechList');
  const rapSocialList = document.getElementById('rapSocialList');
  const rapCountPill = document.getElementById('rapCountPill');
  const rapPrevBtn = document.getElementById('rapPrevBtn');
  const rapNextBtn = document.getElementById('rapNextBtn');
  const closeRapModal = document.getElementById('closeRapModal');
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

  // ==================== OFFICIAL TRIMESTER RAPs (GFPI-F-016 · DMGV 522309 V2) ====================
  const TRIMESTER_RAPS = {
    1: {
      title: 'Trimestre I · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 1: Analizar y Conceptualizar · Actividad 1: Caracterizar necesidades de comunicación gráfica',
      tech: [
        {
          code: '291301121',
          comp: 'Representar conceptos gráficos de acuerdo con metodologías de ilustración y tipo de producto',
          raps: [
            'Analizar información del proyecto mediante metodologías de diseño según requerimientos del brief.',
            'Aplicar fundamentos del diseño en composiciones gráficas según principios de percepción visual.',
            'Definir conceptos visuales mediante fundamentos de ilustración y técnicas análogas.'
          ]
        }
      ],
      social: [
        {
          code: '240201530',
          comp: 'Inducción Institucional',
          raps: ['Reconocer la dinámica organizacional del SENA y el rol de la Formación Profesional Integral de acuerdo con su proyecto de vida y desarrollo profesional.']
        },
        {
          code: '240201517',
          comp: 'Matemáticas I (Razonamiento Cuantitativo)',
          raps: [
            'Identificar modelos matemáticos de acuerdo con los requerimientos del problema planteado en contextos sociales y productivos.',
            'Plantear problemas matemáticos a partir de situaciones generadas en el contexto social y productivo.'
          ]
        },
        {
          code: '220501046',
          comp: 'Informática y TIC I',
          raps: [
            'Aplicar funcionalidades de herramientas y servicios TIC de acuerdo con manuales de uso y buenas prácticas.',
            'Optimizar los resultados de acuerdo con la verificación.'
          ]
        },
        {
          code: '240201064',
          comp: 'Investigación Formativa',
          raps: [
            'Argumentar aspectos teóricos del proyecto según referentes nacionales e internacionales.',
            'Analizar el contexto productivo según sus características y necesidades.',
            'Proponer soluciones a las necesidades del contexto según resultados de la investigación.',
            'Estructurar el proyecto de acuerdo con criterios de la investigación.'
          ]
        },
        {
          code: '240201526 / 230101507',
          comp: 'Ética y Cultura de Paz · Actividad Física',
          raps: [
            'Contribuir con el fortalecimiento de la cultura de paz a partir de la dignidad humana y la transformación de conflictos.',
            'Promover el uso racional de los recursos naturales a partir de criterios de sostenibilidad ética y normativa.',
            'Practicar hábitos saludables mediante la aplicación de fundamentos de nutrición e higiene.'
          ]
        }
      ]
    },
    2: {
      title: 'Trimestre II · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 1: Analizar y Conceptualizar · Actividad 2: Diseñar estrategias de comunicación gráfica',
      tech: [
        {
          code: '291301122',
          comp: 'Diagramar piezas gráficas de acuerdo con métodos de diseño y tipo de proyecto',
          raps: ['Identificar información recopilada en metodologías de diseño e investigación según brief.']
        },
        {
          code: '291301121',
          comp: 'Representar conceptos gráficos de acuerdo con metodologías de ilustración',
          raps: [
            'Desarrollar piezas ilustradas aplicando técnicas análogas según narrativa visual y tipología del proyecto.',
            'Digitalizar ilustraciones utilizando software especializado de acuerdo con requerimientos del cliente y fundamentos del diseño.',
            'Estructurar propuestas gráficas según requerimientos técnicos y necesidades del cliente.'
          ]
        }
      ],
      social: [
        {
          code: '240202501',
          comp: 'Bilingüismo · Inglés I',
          raps: ['Comprender información sobre situaciones cotidianas y laborales actuales a través de interacciones sociales de forma oral y escrita.']
        },
        {
          code: '240201517',
          comp: 'Matemáticas II',
          raps: [
            'Resolver problemas matemáticos a partir de situaciones generadas en el contexto social y productivo.',
            'Proponer acciones de mejora frente a los resultados de los procedimientos matemáticos.'
          ]
        },
        {
          code: '220501046',
          comp: 'Informática y TIC II',
          raps: [
            'Evaluar los resultados de acuerdo con los requerimientos.',
            'Alistar herramientas TIC de acuerdo con las necesidades de procesamiento de información y comunicación.'
          ]
        },
        {
          code: '240201526 / 230101507',
          comp: 'Ética y Cultura de Paz · Hábitos Saludables',
          raps: [
            'Establecer relaciones de crecimiento personal y comunitario a partir del bien común.',
            'Promover mi dignidad y la del otro a partir de los principios y valores éticos.',
            'Desarrollar habilidades psicomotrices e implementar un plan de ergonomía y pausas activas.'
          ]
        }
      ]
    },
    3: {
      title: 'Trimestre III · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 2: Planear Estrategias de Comunicación · Actividad 3: Desarrollar propuestas gráficas',
      tech: [
        {
          code: '291301122',
          comp: 'Diagramar piezas gráficas de acuerdo con métodos de diseño y tipo de proyecto',
          raps: [
            'Diagramar piezas gráficas aplicando elementos del diseño y estrategias de comunicación.',
            'Maquetar piezas gráficas mediante software especializado según requerimientos técnicos y conceptuales.'
          ]
        },
        {
          code: '291301080',
          comp: 'Registrar imágenes publicitarias de acuerdo con métodos de captura fotográfica y brief',
          raps: [
            'Operar la cámara fotográfica configurando parámetros técnicos según condiciones de iluminación y captura.',
            'Configurar esquemas de iluminación básica utilizando una fuente de luz según características del sujeto.'
          ]
        }
      ],
      social: [
        {
          code: '220201501',
          comp: 'Ciencias Naturales (Física / Química)',
          raps: [
            'Identificar principios y leyes de la física en la solución de problemas de acuerdo con el contexto productivo.',
            'Solucionar problemas asociados con el sector productivo con base en los principios y leyes de la física.',
            'Verificar las transformaciones físicas de la materia utilizando herramientas tecnológicas.',
            'Proponer acciones de mejora en los procesos productivos de acuerdo con los principios y leyes de la física.'
          ]
        },
        {
          code: '240202501',
          comp: 'Bilingüismo · Inglés II',
          raps: ['Explicar las funciones de su ocupación laboral usando expresiones de acuerdo con el nivel requerido por el programa de formación.']
        }
      ]
    },
    4: {
      title: 'Trimestre IV · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 3: Ejecutar y Producir Soluciones Gráficas · Actividad 4: Producir soluciones gráficas',
      tech: [
        {
          code: '291301122',
          comp: 'Diagramar piezas gráficas de acuerdo con métodos de diseño y tipo de proyecto',
          raps: ['Desarrollar maquetas físicas y digitales de productos gráficos según requerimientos técnicos y tipología de proyecto.']
        },
        {
          code: '291301083',
          comp: 'Editar imágenes de acuerdo con criterios de comunicación y técnicas de edición',
          raps: [
            'Identificar características técnicas de las imágenes digitales de acuerdo con los requerimientos del cliente y medio de salida.',
            'Realizar el arte conceptual del proyecto según el brief, tipo de publicación y parámetros técnicos.',
            'Gestionar archivos de imagen digital provenientes de diferentes fuentes según requerimientos de proyecto.',
            'Editar imágenes digitales en software especializado bajo criterios de comunicación y requerimientos técnicos.',
            'Verificar las condiciones técnicas y comunicativas de las imágenes según requerimientos y medios de salida.'
          ]
        }
      ],
      social: [
        {
          code: '240201524',
          comp: 'Comunicación Eficaz y Efectiva',
          raps: [
            'Argumentar en forma oral y escrita atendiendo las exigencias de las diversas situaciones comunicativas.',
            'Relacionar los procesos comunicativos teniendo en cuenta criterios de lógica y racionalidad.',
            'Establecer procesos de enriquecimiento lexical y acciones de mejoramiento comunicativo.',
            'Analizar los componentes de la comunicación según sus características, intencionalidad y contexto.'
          ]
        },
        {
          code: '220601501',
          comp: 'Protección Ambiental y SST I',
          raps: [
            'Analizar estrategias para la prevención y control de impactos ambientales y accidentes/enfermedades laborales (ATEL).',
            'Implementar estrategias para el control de impactos ambientales y ATEL según planes organizacionales.'
          ]
        },
        {
          code: '240202501',
          comp: 'Bilingüismo · Inglés III',
          raps: ['Intercambiar opiniones sobre situaciones cotidianas y laborales actuales y pasadas en contextos orales y escritos.']
        }
      ]
    },
    5: {
      title: 'Trimestre V · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 3: Ejecutar y Producir Soluciones Gráficas · Actividad 5: Materializar productos gráficos',
      tech: [
        {
          code: '291301122',
          comp: 'Diagramar piezas gráficas de acuerdo con métodos de diseño y tipo de proyecto',
          raps: ['Producir archivos finales impresos y digitales según procesos de producción.']
        },
        {
          code: '291301140',
          comp: 'Elaborar empaque de acuerdo con tipo de material y requerimiento técnico',
          raps: [
            'Interpretar requerimientos técnicos y características del sustrato según especificaciones de producción.',
            'Estructurar plano mecánico y/o sistema de acabados según parámetros técnicos.',
            'Elaborar prototipos 2D y 3D según especificaciones técnicas y procesos de producción.'
          ]
        }
      ],
      social: [
        {
          code: '220601501',
          comp: 'Protección Ambiental y SST II',
          raps: [
            'Realizar seguimiento y acompañamiento al desarrollo de los planes y programas ambientales y SST.',
            'Proponer acciones de mejora para el manejo ambiental y el control de la SST de forma colaborativa.'
          ]
        },
        {
          code: '240201524',
          comp: 'Comunicación Aplicada al Diseño',
          raps: ['Apropiar la composición visual en piezas gráficas según elementos del diseño y estrategias de comunicación.']
        },
        {
          code: '240202501',
          comp: 'Bilingüismo · Inglés IV',
          raps: ['Contrastar situaciones cotidianas y laborales, presentes y futuras, en contextos orales y escritos.']
        }
      ]
    },
    6: {
      title: 'Trimestre VI · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 3: Ejecutar y Producir Soluciones Gráficas · Actividad 6: Consolidar soluciones gráficas',
      tech: [
        {
          code: '291301139',
          comp: 'Elaborar contenido visual digital de acuerdo con parámetros de redes sociales',
          raps: [
            'Diseñar propuestas gráficas aplicando principios técnicos y de composición visual según objetivos de campaña.',
            'Producir recursos gráficos multiplataforma según tendencias digitales, objetivos comunicativos y formatos.',
            'Adaptar contenido visual a diferentes plataformas según especificaciones y comportamiento de consumo.'
          ]
        },
        {
          code: '291301088',
          comp: 'Diseñar sistema de empaque de acuerdo con requerimientos del cliente',
          raps: [
            'Analizar requerimientos de empaque según características del producto, funcionalidad y cliente.',
            'Desarrollar propuesta comunicativa y visual según parámetros técnicos y funcionales del proyecto.',
            'Integrar elementos gráficos y normativos en sistemas de empaque según características del producto.',
            'Elaborar prototipo y preparar artes finales según especificaciones técnicas y medios de producción.',
            'Validar prototipo impreso mediante pruebas funcionales y tipo de proyecto.'
          ]
        }
      ],
      social: [
        {
          code: '210201501',
          comp: 'Derechos Fundamentales del Trabajo I',
          raps: [
            'Reconocer el trabajo como factor de movilidad social y transformación vital con referencia a los derechos fundamentales.',
            'Valorar la importancia de la ciudadanía laboral con base en los derechos humanos y fundamentales.'
          ]
        },
        {
          code: '240201529',
          comp: 'Cultura Emprendedora y Empresarial I',
          raps: [
            'Integrar elementos de la cultura emprendedora teniendo en cuenta el perfil personal y el contexto social.',
            'Caracterizar la idea de negocio teniendo en cuenta las oportunidades y necesidades del sector productivo.'
          ]
        },
        {
          code: '240201524 / 240202501',
          comp: 'Comunicación Digital · Inglés V',
          raps: [
            'Analizar requerimientos comunicativos según campaña de medios digitales.',
            'Presentar un proceso para la realización de una actividad en su quehacer laboral en lengua inglesa.'
          ]
        }
      ]
    },
    7: {
      title: 'Trimestre VII · Resultados de Aprendizaje (RAPs)',
      subtitle: 'Fase 4: Concretar y Evaluar Soluciones · Actividad 7: Validar soluciones gráficas',
      tech: [
        {
          code: '291301119',
          comp: 'Diseñar interfaz gráfica de usuario (UI/UX) según metodologías y tipo de producto',
          raps: [
            'Determinar requerimientos funcionales y técnicos del proyecto según métodos HCD, UX y necesidades de usuario.',
            'Estructurar el mapa de navegación y la interacción UX/UI según tipo de proyecto y métodos de navegación.',
            'Prototipar interfaces gráficas funcionales mediante software especializado según experiencia del cliente.',
            'Validar la funcionalidad del proyecto mediante pruebas de usabilidad y criterios de experiencia de usuario.'
          ]
        },
        {
          code: '250201030',
          comp: 'Editar contenido audiovisual de acuerdo con parámetros técnicos',
          raps: [
            'Ensamblar secuencias narrativas en software según guion técnico y narrativa visual.',
            'Integrar transiciones, efectos y animaciones conforme a estándares de postproducción.',
            'Exportar productos audiovisuales según estándares de postproducción y formatos de salida.'
          ]
        }
      ],
      social: [
        {
          code: '240201524',
          comp: 'Comunicación Audiovisual',
          raps: [
            'Elaborar guion literario y storyboard de contenido audiovisual de acuerdo con requerimientos del cliente.',
            'Definir material audiovisual según guion, continuidad narrativa y especificaciones técnicas.'
          ]
        },
        {
          code: '240201529',
          comp: 'Cultura Emprendedora y Empresarial II',
          raps: [
            'Estructurar el plan de negocio de acuerdo con las características empresariales y tendencias de mercado.',
            'Valorar la propuesta de negocio conforme con su estructura y necesidades del sector productivo.'
          ]
        },
        {
          code: '210201501 / 240202501',
          comp: 'Derechos Fundamentales II · Inglés VI',
          raps: [
            'Practicar los derechos fundamentales en el trabajo y participar en acciones solidarias.',
            'Discutir sobre posibles soluciones a problemas dentro de contextos sociales y laborales en lengua inglesa.'
          ]
        }
      ]
    },
    8: {
      title: 'Trimestre VIII · Etapa Productiva (Meses 22 a 24)',
      subtitle: 'Aplicación de competencias en entorno productivo real · 1er Trimestre Productivo (432 h · 9 cr.)',
      tech: [
        {
          code: '999999999',
          comp: 'Resultado de Aprendizaje · Etapa Productiva (1/2)',
          raps: [
            'Aplicar en la resolución de problemas reales del sector productivo los conocimientos, habilidades y destrezas pertinentes a las competencias del programa Tecnología en Desarrollo de Medios Gráficos Visuales, asumiendo estrategias y metodologías de autogestión.',
            'Concertación de actividades en la empresa o proyecto productivo (Contrato de Aprendizaje, Vinculación Laboral, Pasantía, SENA-Empresa o Unidad Productiva).'
          ]
        }
      ],
      social: [
        {
          code: 'GFPI-F-023',
          comp: 'Seguimiento y Evaluación en Empresa',
          raps: [
            'Diligenciamiento y entrega de bitácoras quincenales de seguimiento técnico y actitudinal.',
            'Visita de concertación y seguimiento parcial con el instructor de seguimiento del CTM Itagüí y el jefe inmediato en la empresa.'
          ]
        }
      ]
    },
    9: {
      title: 'Trimestre IX · Etapa Productiva y Certificación (Meses 25 a 27)',
      subtitle: 'Cierre de etapa práctica y titulación como Tecnólogo · 2do Trimestre Productivo (432 h · 9 cr.)',
      tech: [
        {
          code: '999999999',
          comp: 'Resultado de Aprendizaje · Etapa Productiva (2/2)',
          raps: [
            'Demostrar en condiciones reales de trabajo el desempeño integral en producción gráfica impresa, digital, editorial, empaques, audiovisual o UI/UX cumpliendo parámetros de calidad y tiempos de entrega.',
            'Evaluación final de desempeño en entorno productivo (Formato GFPI-F-023) con concepto de aprobación.'
          ]
        }
      ],
      social: [
        {
          code: 'CERTIFICACIÓN',
          comp: 'Requisitos Finales de Titulación Tecnólogo DMGV',
          raps: [
            'Aprobación del 100 % de los RAPs de etapa lectiva (65 cr.) y productiva (18 cr.) = 83 créditos totales.',
            'Certificado de presentación de prueba Saber TyT (ICFES), inscripción en Agencia Pública de Empleo (APE) y paz y salvo institucional.'
          ]
        }
      ]
    }
  };

  let activeTrim = 1;
  function renderRapGroups(groups, isSocial) {
    return groups.map(g => `
      <div class="rap-group${isSocial ? ' social' : ''}">
        <div class="rap-group-head"><span class="rap-code">${g.code}</span><span>${g.comp}</span></div>
        <ul class="rap-list">${g.raps.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  function openTrimModal(num) {
    const data = TRIMESTER_RAPS[num];
    if (!data || !rapModal) return;
    activeTrim = num;
    rapTitle.textContent = data.title;
    rapSubtitle.textContent = data.subtitle;
    rapTechList.innerHTML = renderRapGroups(data.tech, false);
    rapSocialList.innerHTML = renderRapGroups(data.social, true);
    const totalRaps = data.tech.reduce((s, g) => s + g.raps.length, 0) + data.social.reduce((s, g) => s + g.raps.length, 0);
    rapCountPill.textContent = `Trimestre ${num} / 9 · ${totalRaps} RAPs clave`;
    if (rapPrevBtn) rapPrevBtn.disabled = num <= 1;
    if (rapNextBtn) rapNextBtn.disabled = num >= 9;
    rapModal.classList.add('open');
  }

  document.addEventListener('click', (e) => {
    const tCard = e.target.closest('.trim-card[data-trim]');
    if (!tCard) return;
    openTrimModal(parseInt(tCard.dataset.trim, 10));
  });
  if (rapPrevBtn) rapPrevBtn.addEventListener('click', () => { if (activeTrim > 1) openTrimModal(activeTrim - 1); });
  if (rapNextBtn) rapNextBtn.addEventListener('click', () => { if (activeTrim < 9) openTrimModal(activeTrim + 1); });
  if (closeRapModal && rapModal) {
    closeRapModal.addEventListener('click', () => rapModal.classList.remove('open'));
    rapModal.addEventListener('click', (e) => { if (e.target === rapModal) rapModal.classList.remove('open'); });
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
    if (rapModal && rapModal.classList.contains('open')) {
      if (e.key === 'Escape') rapModal.classList.remove('open');
      else if (e.key === 'ArrowLeft' && activeTrim > 1) openTrimModal(activeTrim - 1);
      else if (e.key === 'ArrowRight' && activeTrim < 9) openTrimModal(activeTrim + 1);
      return;
    }
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
