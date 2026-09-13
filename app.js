(() => {
  "use strict";

  const STORAGE = {
    role: "stagelink.role",
    profiles: "stagelink.profiles",
    portfolio: "stagelink.portfolio",
    createdAuditions: "stagelink.createdAuditions",
    savedAuditions: "stagelink.savedAuditions",
    applications: "stagelink.applications",
    notifications: "stagelink.notifications",
    candidates: "stagelink.candidates"
  };

  const DEFAULT_AUDITIONS = [
    {
      id: "los-miserables",
      title: "Los Miserables",
      company: "Full House Panamá",
      type: "Musical",
      compensationType: "paid",
      compensation: "B/. 350 por temporada",
      location: "Teatro Nacional, Casco Antiguo",
      district: "San Felipe",
      date: "2026-10-15",
      time: "16:00",
      deadline: "2026-10-05",
      description: "Una nueva producción del clásico musical busca intérpretes con presencia escénica, capacidad vocal y disponibilidad para ensayos intensivos.",
      requirements: ["Disponibilidad de lunes a viernes desde las 18:00", "Experiencia previa en teatro o formación equivalente", "Preparar 60 segundos de una canción de teatro musical"],
      materials: ["Headshot frontal", "CV artístico", "Video de canto"],
      roles: [
        {
          id: "jean-valjean",
          name: "Jean Valjean",
          profile: "Adulto · Voz tenor/barítono",
          ageRange: "30–55 años",
          gender: "Masculino",
          description: "Figura central de la obra. Se busca un intérprete con gran fuerza dramática y vocal que pueda mostrar la transformación del personaje.",
          requirement: "Video cantando “Bring Him Home” o una pieza equivalente."
        },
        {
          id: "cosette",
          name: "Cosette",
          profile: "Joven adulta · Voz soprano",
          ageRange: "18–30 años",
          gender: "Femenino",
          description: "Personaje luminoso y sensible. Se valora una interpretación natural, técnica vocal sólida y buena química en escena.",
          requirement: "Video de una balada de teatro musical y headshot actualizado."
        },
        {
          id: "fantine",
          name: "Fantine",
          profile: "Adulta · Voz mezzosoprano",
          ageRange: "24–42 años",
          gender: "Femenino",
          description: "Rol de alta exigencia emocional y musical. Se busca honestidad interpretativa y dominio de matices vocales.",
          requirement: "Monólogo dramático de máximo 90 segundos."
        }
      ]
    },
    {
      id: "mentirosas",
      title: "Mentirosas",
      company: "Stardust Entertainment",
      type: "Musical",
      compensationType: "paid",
      compensation: "B/. 280 por temporada",
      location: "Teatro La Estación, Vía España",
      district: "Bella Vista",
      date: "2026-11-06",
      time: "18:30",
      deadline: "2026-10-19",
      description: "Casting para comedia musical de ensamble. Buscamos intérpretes versátiles, con ritmo, energía y sensibilidad para la comedia.",
      requirements: ["Preparar una canción pop en español", "Disponibilidad nocturna", "Lectura dramatizada durante la audición"],
      materials: ["Headshot", "Reel musical"],
      roles: [
        {
          id: "daniela",
          name: "Daniela",
          profile: "Joven adulta · Principal",
          ageRange: "20–35 años",
          gender: "Femenino",
          description: "Carismática, impulsiva y con fuerte sentido de comedia. Requiere seguridad vocal y gran energía.",
          requirement: "Canción pop de 60 segundos."
        },
        {
          id: "dulce",
          name: "Dulce",
          profile: "Joven adulta · Ensamble",
          ageRange: "18–32 años",
          gender: "Femenino",
          description: "Personaje dulce, espontáneo y muy expresivo. Se valoran habilidades de movimiento.",
          requirement: "Video corto de canto y movimiento."
        }
      ]
    },
    {
      id: "la-casa-de-bernarda-alba",
      title: "La casa de Bernarda Alba",
      company: "Producciones Istmo",
      type: "Teatro",
      compensationType: "ad-honorem",
      compensation: "Proyecto ad honorem",
      location: "Ateneo de Ciudad del Saber",
      district: "Ancón",
      date: "2026-10-29",
      time: "17:30",
      deadline: "2026-10-12",
      description: "Montaje contemporáneo de la obra de Federico García Lorca. El proceso incluye laboratorio de cuerpo y voz.",
      requirements: ["Experiencia o formación en actuación", "Disponibilidad para ensayos de fin de semana", "Lectura de separata enviada por la producción"],
      materials: ["CV artístico", "Headshot"],
      owner: true,
      roles: [
        {
          id: "adela",
          name: "Adela",
          profile: "Joven adulta · Principal",
          ageRange: "18–30 años",
          gender: "Femenino",
          description: "La hija menor de Bernarda. Apasionada, rebelde y determinada a romper con el encierro.",
          requirement: "Monólogo dramático de máximo 90 segundos."
        },
        {
          id: "martirio",
          name: "Martirio",
          profile: "Adulta · Reparto",
          ageRange: "24–40 años",
          gender: "Femenino",
          description: "Personaje contenido, complejo y atravesado por el resentimiento. Requiere gran trabajo interior.",
          requirement: "Lectura de separata durante la audición."
        }
      ]
    },
    {
      id: "puente-de-sal",
      title: "Puente de sal",
      company: "Colectivo Umbral",
      type: "Cortometraje",
      compensationType: "experience",
      compensation: "Intercambio de experiencia y material",
      location: "Centro Cultural de España, Casco Antiguo",
      district: "San Felipe",
      date: "2026-11-14",
      time: "10:00",
      deadline: "2026-10-31",
      description: "Cortometraje universitario sobre memoria familiar y migración. Rodaje de dos jornadas en Ciudad de Panamá.",
      requirements: ["Naturalidad frente a cámara", "Disponibilidad completa durante el rodaje", "Residir en Ciudad de Panamá o alrededores"],
      materials: ["Foto reciente", "Video de presentación"],
      roles: [
        {
          id: "elena",
          name: "Elena",
          profile: "Adulta · Principal",
          ageRange: "35–50 años",
          gender: "Femenino",
          description: "Mujer reservada que vuelve al barrio de su infancia. Se busca actuación sutil y gran expresividad visual.",
          requirement: "Self-tape con escena incluida en la convocatoria."
        }
      ]
    }
  ];

  const DEFAULT_PROFILES = {
    actor: {
      displayName: "María Rivera",
      city: "Ciudad de Panamá",
      bio: "Actriz en formación con interés en teatro musical y drama contemporáneo.",
      phone: "+507 6000-1234",
      birthdate: "2003-05-18",
      height: "165 cm",
      ageRange: "18–28 años",
      skills: "Actuación, canto, danza contemporánea",
      languages: "Español, inglés intermedio",
      avatar: ""
    },
    producer: {
      displayName: "Producciones Istmo",
      city: "Ciudad de Panamá",
      bio: "Compañía independiente dedicada a nuevas lecturas del repertorio latinoamericano.",
      phone: "+507 390-8840",
      companyType: "Compañía independiente",
      website: "https://example.com",
      contactName: "Laura Méndez",
      avatar: ""
    }
  };

  const DEFAULT_PORTFOLIO = [
    { id: "mat-headshot", name: "Headshot profesional.jpg", type: "image", tags: ["Headshot", "Frontal"], size: "1.8 MB", demo: true, preview: "" },
    { id: "mat-monologue", name: "Monólogo dramático.mp4", type: "video", tags: ["Drama", "Monólogo"], size: "28.4 MB", demo: true, preview: "" },
    { id: "mat-cv", name: "CV artístico.pdf", type: "document", tags: ["CV"], size: "420 KB", demo: true, preview: "" }
  ];

  const DEFAULT_NOTIFICATIONS = [
    {
      id: "notice-nearby",
      type: "audition",
      title: "Nueva convocatoria cerca",
      message: "Producciones Istmo publicó una audición en Ancón.",
      date: "2026-09-12T14:20:00",
      read: false,
      link: "audition.html?id=la-casa-de-bernarda-alba"
    },
    {
      id: "notice-approved",
      type: "status",
      title: "Postulación recibida",
      message: "Tu inscripción para Mentirosas está en revisión.",
      date: "2026-09-10T09:40:00",
      read: false,
      link: "dashboard.html"
    },
    {
      id: "notice-deadline",
      type: "calendar",
      title: "Convocatoria próxima a cerrar",
      message: "Quedan pocos días para postularte a Los Miserables.",
      date: "2026-09-08T18:05:00",
      read: true,
      link: "audition.html?id=los-miserables"
    }
  ];

  const DEFAULT_APPLICATIONS = [
    {
      id: "application-demo",
      auditionId: "mentirosas",
      roleId: "daniela",
      roleName: "Daniela",
      title: "Mentirosas",
      company: "Stardust Entertainment",
      date: "2026-09-10T09:40:00",
      status: "En revisión",
      materials: ["mat-headshot", "mat-monologue"],
      note: ""
    }
  ];

  const DEFAULT_CANDIDATES = [
    { id: "cand-ana", auditionId: "la-casa-de-bernarda-alba", name: "Ana Torres", age: 24, role: "Adela", skills: ["Drama", "Danza"], status: "En espera", rating: 4, note: "Buena presencia escénica." },
    { id: "cand-sofia", auditionId: "la-casa-de-bernarda-alba", name: "Sofía Chen", age: 27, role: "Martirio", skills: ["Drama", "Voz"], status: "En consideración", rating: 5, note: "Revisar disponibilidad para ensayos." },
    { id: "cand-valentina", auditionId: "la-casa-de-bernarda-alba", name: "Valentina Cruz", age: 21, role: "Adela", skills: ["Improvisación"], status: "En espera", rating: 3, note: "" }
  ];

  const PAGE_META = {
    feed: ["Audiciones", "Oportunidades abiertas"],
    audition: ["Detalle", "Convocatoria"],
    portfolio: ["Portafolio", "Material artístico"],
    notifications: ["Notificaciones", "Actividad reciente"],
    profile: ["Mi perfil", "Información profesional"],
    create: ["Crear convocatoria", "Publicación guiada"],
    dashboard: ["Gestión", "Seguimiento"]
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.warn("No fue posible leer datos locales", error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("No fue posible guardar datos locales", error);
      showToast("Espacio local lleno", "El cambio no pudo guardarse en este navegador.");
      return false;
    }
  }

  function ensureSeedData() {
    if (!localStorage.getItem(STORAGE.profiles)) write(STORAGE.profiles, DEFAULT_PROFILES);
    if (!localStorage.getItem(STORAGE.portfolio)) write(STORAGE.portfolio, DEFAULT_PORTFOLIO);
    if (!localStorage.getItem(STORAGE.createdAuditions)) write(STORAGE.createdAuditions, []);
    if (!localStorage.getItem(STORAGE.savedAuditions)) write(STORAGE.savedAuditions, []);
    if (!localStorage.getItem(STORAGE.applications)) write(STORAGE.applications, DEFAULT_APPLICATIONS);
    if (!localStorage.getItem(STORAGE.notifications)) write(STORAGE.notifications, DEFAULT_NOTIFICATIONS);
    if (!localStorage.getItem(STORAGE.candidates)) write(STORAGE.candidates, DEFAULT_CANDIDATES);
  }

  function getRole() {
    return localStorage.getItem(STORAGE.role) || "";
  }

  function setRole(role) {
    if (role !== "actor" && role !== "producer") return;
    localStorage.setItem(STORAGE.role, role);
  }

  function getProfile(role = getRole() || "actor") {
    const profiles = read(STORAGE.profiles, DEFAULT_PROFILES);
    return { ...DEFAULT_PROFILES[role], ...(profiles[role] || {}) };
  }

  function saveProfile(role, profile) {
    const profiles = read(STORAGE.profiles, DEFAULT_PROFILES);
    profiles[role] = { ...profiles[role], ...profile };
    return write(STORAGE.profiles, profiles);
  }

  function getAuditions() {
    return [...DEFAULT_AUDITIONS, ...read(STORAGE.createdAuditions, [])];
  }

  function findAudition(id) {
    return getAuditions().find((item) => item.id === id) || null;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function slugify(value) {
    return String(value || "convocatoria")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "convocatoria";
  }

  function initials(name) {
    return String(name || "SL")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase();
  }

  function formatDate(value, options = {}) {
    if (!value) return "Fecha por confirmar";
    const normalized = value.includes("T") ? value : `${value}T12:00:00`;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-PA", {
      day: "numeric",
      month: "short",
      year: options.short ? undefined : "numeric",
      ...options
    }).format(date);
  }

  function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-PA", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  }

  function compensationLabel(audition) {
    if (audition.compensationType === "paid") return audition.compensation || "Remunerado";
    if (audition.compensationType === "ad-honorem") return "Ad honorem";
    return "Intercambio de experiencia";
  }

  function compensationBadgeClass(audition) {
    if (audition.compensationType === "paid") return "success";
    if (audition.compensationType === "ad-honorem") return "warning";
    return "";
  }

  function icon(name, extraClass = "") {
    const paths = {
      search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
      masks: '<path d="M5 4h6v5a5 5 0 0 1-10 0V4h4Z"></path><path d="M13 4h6v5a5 5 0 0 1-8 4"></path><path d="M4 7h.01M8 7h.01M15 7h.01M18 7h.01"></path><path d="M4 10c1 1 3 1 4 0M14 11c1-1 3-1 4 0"></path>',
      portfolio: '<rect x="3" y="5" width="18" height="15" rx="2"></rect><path d="M8 5V3h8v2M3 10h18M9 14h6"></path>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
      user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>',
      plus: '<path d="M12 5v14M5 12h14"></path>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path>',
      map: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
      clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
      bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"></path>',
      arrowRight: '<path d="m9 18 6-6-6-6"></path>',
      arrowLeft: '<path d="m15 18-6-6 6-6"></path>',
      upload: '<path d="M12 16V4M7 9l5-5 5 5"></path><path d="M5 15v5h14v-5"></path>',
      image: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-5-5L5 20"></path>',
      video: '<rect x="3" y="5" width="14" height="14" rx="2"></rect><path d="m17 10 4-3v10l-4-3"></path>',
      file: '<path d="M6 2h8l4 4v16H6V2Z"></path><path d="M14 2v5h5"></path>',
      check: '<path d="m5 12 4 4L19 6"></path>',
      close: '<path d="m6 6 12 12M18 6 6 18"></path>',
      home: '<path d="m3 11 9-8 9 8"></path><path d="M5 10v11h14V10M9 21v-7h6v7"></path>',
      inbox: '<path d="M4 4h16l2 12h-6l-2 3h-4l-2-3H2L4 4Z"></path>',
      building: '<path d="M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M18 13h.01M18 17h.01M2 21h20"></path>',
      settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1V21H9.6v-.09a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4H3V9.6h.09a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1V3h4v.09a1.7 1.7 0 0 0 1.1 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.4.3.6.6.6 1s.4.9 1 1h.09v4H21a1.7 1.7 0 0 0-1.6 0Z"></path>',
      trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"></path>',
      edit: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path>',
      info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v6M12 7h.01"></path>',
      star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"></path>'
    };
    return `<svg class="${escapeHtml(extraClass)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
  }

  function avatarMarkup(profile, className = "avatar") {
    const content = profile.avatar
      ? `<img src="${escapeHtml(profile.avatar)}" alt="" />`
      : escapeHtml(initials(profile.displayName));
    return `<span class="${className}" aria-hidden="true">${content}</span>`;
  }

  function navItems(role) {
    if (role === "producer") {
      return [
        ["feed", "feed.html", "Convocatorias", "masks"],
        ["create", "create-audition.html", "Crear", "plus"],
        ["dashboard", "dashboard.html", "Gestión", "users"],
        ["notifications", "notifications.html", "Notificaciones", "bell"],
        ["profile", "profile.html", "Perfil", "building"]
      ];
    }
    return [
      ["feed", "feed.html", "Audiciones", "masks"],
      ["portfolio", "portfolio.html", "Portafolio", "portfolio"],
      ["dashboard", "dashboard.html", "Postulaciones", "inbox"],
      ["notifications", "notifications.html", "Notificaciones", "bell"],
      ["profile", "profile.html", "Perfil", "user"]
    ];
  }

  function renderNavLinks(items, page, mobile = false) {
    const unread = read(STORAGE.notifications, []).filter((item) => !item.read).length;
    return items.map(([key, href, label, iconName]) => {
      const current = key === page || (page === "audition" && key === "feed");
      const badge = key === "notifications" && unread > 0 ? `<span class="count-badge" aria-label="${unread} sin leer">${unread}</span>` : "";
      return `<a class="nav-link" href="${href}" ${current ? 'aria-current="page"' : ""}>
        ${icon(iconName, "nav-icon")}
        <span class="nav-text">${escapeHtml(label)}</span>
        ${badge}
      </a>`;
    }).join("");
  }

  function initShell(page) {
    const role = getRole();
    if (!role) {
      window.location.replace("index.html");
      return false;
    }
    const profile = getProfile(role);
    const items = navItems(role);
    const sidebar = document.querySelector("#sidebar");
    const topbar = document.querySelector("#topbar");
    const mobileNav = document.querySelector("#mobile-nav");
    const pageMeta = PAGE_META[page] || ["StageLink", "Plataforma"];

    if (sidebar) {
      sidebar.innerHTML = `
        <a class="brand" href="feed.html" aria-label="StageLink Auditions, inicio">
          <span class="brand-mark">SL</span>
          <span>StageLink<small>Auditions</small></span>
        </a>
        <nav class="side-nav" aria-label="Navegación principal">${renderNavLinks(items, page)}</nav>
        <a class="side-profile" href="profile.html">
          ${avatarMarkup(profile)}
          <span class="side-profile-copy"><strong>${escapeHtml(profile.displayName)}</strong><span>${role === "producer" ? "Productora / compañía" : "Artista"}</span></span>
        </a>`;
    }

    if (topbar) {
      topbar.innerHTML = `
        <div class="topbar-copy">
          <p class="topbar-eyebrow">${escapeHtml(pageMeta[1])}</p>
          <h2 class="topbar-title">${escapeHtml(pageMeta[0])}</h2>
        </div>
        <a class="role-chip" href="profile.html#tipo-cuenta" aria-label="Cambiar tipo de cuenta">
          <span class="dot"></span><span>${role === "producer" ? "Productora" : "Artista"}</span>
        </a>`;
    }

    if (mobileNav) {
      mobileNav.setAttribute("aria-label", "Navegación principal");
      mobileNav.innerHTML = renderNavLinks(items, page, true);
    }
    return true;
  }

  function refreshShellCounts() {
    const page = document.body.dataset.page;
    if (page && page !== "welcome") initShell(page);
  }

  function showToast(title, message = "") {
    let region = document.querySelector("#toast-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "toast-region";
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "true");
      document.body.append(region);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `${icon("check")}<div><strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ""}</div>`;
    region.append(toast);
    window.setTimeout(() => toast.remove(), 4200);
  }

  function addNotification(notification) {
    const notifications = read(STORAGE.notifications, []);
    notifications.unshift({
      id: `notice-${Date.now()}`,
      type: "status",
      date: new Date().toISOString(),
      read: false,
      ...notification
    });
    write(STORAGE.notifications, notifications);
    refreshShellCounts();
  }

  function initWelcome() {
    const buttons = document.querySelectorAll("[data-enter-role]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const role = button.dataset.enterRole;
        setRole(role);
        window.location.href = "feed.html";
      });
    });

    const savedRole = getRole();
    const resume = document.querySelector("#resume-session");
    if (savedRole && resume) {
      const profile = getProfile(savedRole);
      resume.hidden = false;
      resume.innerHTML = `Continuar como ${escapeHtml(profile.displayName)} ${icon("arrowRight", "icon-inline")}`;
      resume.href = "feed.html";
    }
  }

  function auditionCardMarkup(audition, savedIds) {
    const saved = savedIds.includes(audition.id);
    return `<article class="audition-card card" data-audition-card="${escapeHtml(audition.id)}">
      <div class="card-topline">
        <div>
          <h2 class="card-title">${escapeHtml(audition.title)}</h2>
          <p class="card-company">${escapeHtml(audition.company)}</p>
        </div>
        <button class="save-button" type="button" data-save-audition="${escapeHtml(audition.id)}" data-saved="${saved}" aria-label="${saved ? "Quitar de guardadas" : "Guardar convocatoria"}">${icon("bookmark")}</button>
      </div>
      <div class="badge-row">
        <span class="badge">${escapeHtml(audition.type)}</span>
        <span class="badge ${compensationBadgeClass(audition)}">${escapeHtml(compensationLabel(audition))}</span>
        <span class="badge">${audition.roles.length} ${audition.roles.length === 1 ? "rol" : "roles"}</span>
      </div>
      <div class="audition-facts">
        <span class="fact">${icon("calendar")}<span>${escapeHtml(formatDate(audition.date))} · ${escapeHtml(audition.time)}</span></span>
        <span class="fact">${icon("map")}<span>${escapeHtml(audition.location)}</span></span>
        <span class="fact">${icon("clock")}<span>Cierra el ${escapeHtml(formatDate(audition.deadline))}</span></span>
      </div>
      <div class="card-actions">
        <a class="button" href="audition.html?id=${encodeURIComponent(audition.id)}">Ver detalles ${icon("arrowRight", "icon-inline")}</a>
      </div>
    </article>`;
  }

  function toggleSavedAudition(id) {
    const saved = read(STORAGE.savedAuditions, []);
    const index = saved.indexOf(id);
    if (index >= 0) {
      saved.splice(index, 1);
      write(STORAGE.savedAuditions, saved);
      showToast("Eliminada de guardadas");
      return false;
    }
    saved.push(id);
    write(STORAGE.savedAuditions, saved);
    showToast("Convocatoria guardada", "Puedes verla usando el filtro de guardadas.");
    return true;
  }

  function initFeed() {
    const form = document.querySelector("#filter-form");
    const results = document.querySelector("#audition-results");
    const count = document.querySelector("#results-count");
    const clearButton = document.querySelector("#clear-filters");
    const primaryAction = document.querySelector("#feed-primary-action");
    if (primaryAction) primaryAction.hidden = getRole() !== "producer";
    if (!form || !results || !count) return;

    const locationSelect = form.elements.location;
    const locations = [...new Set(getAuditions().map((item) => item.district))].sort((a, b) => a.localeCompare(b, "es"));
    locationSelect.insertAdjacentHTML("beforeend", locations.map((location) => `<option value="${escapeHtml(location)}">${escapeHtml(location)}</option>`).join(""));

    function render() {
      const data = new FormData(form);
      const query = String(data.get("query") || "").trim().toLocaleLowerCase("es");
      const type = String(data.get("type") || "");
      const compensation = String(data.get("compensation") || "");
      const location = String(data.get("location") || "");
      const onlySaved = data.get("saved") === "on";
      const saved = read(STORAGE.savedAuditions, []);

      const filtered = getAuditions().filter((audition) => {
        const haystack = [audition.title, audition.company, audition.location, audition.district, ...audition.roles.map((role) => role.name)].join(" ").toLocaleLowerCase("es");
        return (!query || haystack.includes(query))
          && (!type || audition.type === type)
          && (!compensation || audition.compensationType === compensation)
          && (!location || audition.district === location)
          && (!onlySaved || saved.includes(audition.id));
      });

      count.textContent = `${filtered.length} ${filtered.length === 1 ? "convocatoria encontrada" : "convocatorias encontradas"}`;
      if (!filtered.length) {
        results.innerHTML = `<div class="empty-state card" style="grid-column:1/-1"><div class="empty-state-inner"><span class="empty-icon">${icon("search")}</span><h2>No encontramos coincidencias</h2><p>Prueba con menos filtros o una ubicación distinta.</p><button class="button secondary" type="button" data-clear-inline>Limpiar filtros</button></div></div>`;
        results.querySelector("[data-clear-inline]")?.addEventListener("click", () => {
          form.reset();
          render();
        });
        return;
      }
      results.innerHTML = filtered.map((audition) => auditionCardMarkup(audition, saved)).join("");
      results.querySelectorAll("[data-save-audition]").forEach((button) => {
        button.addEventListener("click", () => {
          const state = toggleSavedAudition(button.dataset.saveAudition);
          button.dataset.saved = String(state);
          button.setAttribute("aria-label", state ? "Quitar de guardadas" : "Guardar convocatoria");
          if (form.elements.saved.checked && !state) render();
        });
      });
    }

    form.addEventListener("input", render);
    form.addEventListener("change", render);
    clearButton?.addEventListener("click", () => {
      form.reset();
      render();
    });
    render();
  }

  function detailMetaMarkup(audition) {
    return `<div class="meta-list">
      <div class="meta-item">${icon("calendar")}<div><small>Audición</small><strong>${escapeHtml(formatDate(audition.date))} · ${escapeHtml(audition.time)}</strong></div></div>
      <div class="meta-item">${icon("clock")}<div><small>Fecha límite</small><strong>${escapeHtml(formatDate(audition.deadline))}</strong></div></div>
      <div class="meta-item">${icon("map")}<div><small>Ubicación</small><strong>${escapeHtml(audition.location)}</strong></div></div>
      <div class="meta-item">${icon("building")}<div><small>Productora</small><strong>${escapeHtml(audition.company)}</strong></div></div>
    </div>`;
  }

  function roleDetailMarkup(role, audition) {
    const applications = read(STORAGE.applications, []);
    const existing = applications.find((item) => item.auditionId === audition.id && item.roleId === role.id);
    const currentRole = getRole();
    let action = "";
    if (currentRole === "actor") {
      action = existing
        ? `<a class="button secondary" href="dashboard.html">Postulación: ${escapeHtml(existing.status)}</a>`
        : `<button class="button" type="button" data-open-application>Inscribirme a este rol</button>`;
    } else if (audition.owner || read(STORAGE.createdAuditions, []).some((item) => item.id === audition.id)) {
      action = `<a class="button" href="dashboard.html?audition=${encodeURIComponent(audition.id)}">Ver postulantes</a>`;
    }
    return `<h3>${escapeHtml(role.name)}</h3>
      <div class="badge-row"><span class="badge">${escapeHtml(role.profile)}</span><span class="badge">${escapeHtml(role.ageRange || "Edad abierta")}</span></div>
      <p>${escapeHtml(role.description)}</p>
      <div class="detail-section"><h3>Material específico</h3><p>${escapeHtml(role.requirement || "No se requiere material adicional.")}</p></div>
      ${action}`;
  }

  function initAudition() {
    const root = document.querySelector("#audition-detail");
    if (!root) return;
    const id = new URLSearchParams(window.location.search).get("id") || DEFAULT_AUDITIONS[0].id;
    const audition = findAudition(id);
    if (!audition) {
      root.innerHTML = `<div class="empty-state card"><div class="empty-state-inner"><span class="empty-icon">${icon("masks")}</span><h1>Convocatoria no disponible</h1><p>Es posible que haya cerrado o que el enlace sea incorrecto.</p><a class="button" href="feed.html">Volver a audiciones</a></div></div>`;
      return;
    }

    document.title = `${audition.title} · StageLink Auditions`;
    const saved = read(STORAGE.savedAuditions, []).includes(audition.id);
    root.innerHTML = `
      <div class="page-heading">
        <div><a class="button ghost small" href="feed.html">${icon("arrowLeft", "icon-inline")} Volver</a><h1>${escapeHtml(audition.title)}</h1><p>${escapeHtml(audition.company)}</p></div>
        <div class="heading-actions">
          <button class="button secondary" type="button" data-calendar>${icon("calendar", "icon-inline")} Agregar al calendario</button>
          <button class="button secondary" type="button" data-detail-save data-saved="${saved}">${icon("bookmark", "icon-inline")} <span>${saved ? "Guardada" : "Guardar"}</span></button>
        </div>
      </div>
      <div class="detail-layout">
        <article class="card">
          <header class="surface-header"><div><div class="badge-row"><span class="badge">${escapeHtml(audition.type)}</span><span class="badge ${compensationBadgeClass(audition)}">${escapeHtml(compensationLabel(audition))}</span></div><h2>${escapeHtml(audition.title)}</h2></div></header>
          <div class="surface-body detail-copy">
            <section class="detail-section"><h2>Sinopsis del proyecto</h2><p>${escapeHtml(audition.description)}</p></section>
            <section class="detail-section"><h2>Requisitos generales</h2><ul class="detail-list">${audition.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
            <section class="detail-section"><h2>Material solicitado</h2><div class="badge-row">${audition.materials.map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join("")}</div></section>
            <section class="detail-section"><h2>Roles disponibles</h2><p>Selecciona un rol para revisar su descripción y material específico.</p><div class="roles-grid">${audition.roles.map((role, index) => `<button class="role-option" type="button" data-role-id="${escapeHtml(role.id)}" aria-pressed="${index === 0}"><span><strong>${escapeHtml(role.name)}</strong><span>${escapeHtml(role.profile)}</span></span>${icon("arrowRight", "icon-inline")}</button>`).join("")}</div><div class="role-detail" id="selected-role-detail"></div></section>
          </div>
        </article>
        <aside class="card panel sticky-card"><h2 class="section-title">Información</h2>${detailMetaMarkup(audition)}</aside>
      </div>`;

    let selectedRole = audition.roles[0];
    const detail = root.querySelector("#selected-role-detail");

    function renderRoleDetail() {
      detail.innerHTML = roleDetailMarkup(selectedRole, audition);
      detail.querySelector("[data-open-application]")?.addEventListener("click", openApplicationDialog);
    }

    root.querySelectorAll("[data-role-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedRole = audition.roles.find((role) => role.id === button.dataset.roleId) || audition.roles[0];
        root.querySelectorAll("[data-role-id]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        renderRoleDetail();
        detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    root.querySelector("[data-detail-save]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const state = toggleSavedAudition(audition.id);
      button.dataset.saved = String(state);
      button.querySelector("span").textContent = state ? "Guardada" : "Guardar";
    });

    root.querySelector("[data-calendar]")?.addEventListener("click", () => downloadCalendar(audition));

    const dialog = document.querySelector("#application-dialog");
    const dialogTitle = dialog?.querySelector("#application-title");
    const form = dialog?.querySelector("#application-form");
    const materialContainer = dialog?.querySelector("#application-materials");

    function openApplicationDialog() {
      if (!dialog || !form || !materialContainer) return;
      const portfolio = read(STORAGE.portfolio, []);
      dialogTitle.textContent = `${audition.title} · ${selectedRole.name}`;
      materialContainer.innerHTML = portfolio.length
        ? portfolio.map((item) => `<label class="check-card"><input type="checkbox" name="materials" value="${escapeHtml(item.id)}" ${item.type === "image" || item.type === "document" ? "checked" : ""}> <span>${escapeHtml(item.name)}</span></label>`).join("")
        : `<div class="empty-state card"><div class="empty-state-inner"><p>Tu portafolio está vacío.</p><a class="button secondary small" href="portfolio.html">Agregar material</a></div></div>`;
      dialog.showModal();
      document.body.classList.add("modal-open");
    }

    dialog?.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => dialog.close()));
    dialog?.addEventListener("close", () => document.body.classList.remove("modal-open"));
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const applications = read(STORAGE.applications, []);
      if (applications.some((item) => item.auditionId === audition.id && item.roleId === selectedRole.id)) {
        dialog.close();
        showToast("Ya te postulaste", "Consulta el estado en Postulaciones.");
        renderRoleDetail();
        return;
      }
      const data = new FormData(form);
      const application = {
        id: `application-${Date.now()}`,
        auditionId: audition.id,
        roleId: selectedRole.id,
        roleName: selectedRole.name,
        title: audition.title,
        company: audition.company,
        date: new Date().toISOString(),
        status: "En revisión",
        materials: data.getAll("materials"),
        note: String(data.get("note") || "").trim()
      };
      applications.unshift(application);
      write(STORAGE.applications, applications);
      addNotification({
        title: "Postulación enviada",
        message: `Recibimos tu postulación para ${audition.title} como ${selectedRole.name}.`,
        link: "dashboard.html",
        type: "status"
      });
      dialog.close();
      form.reset();
      showToast("Postulación enviada", "Puedes seguir su estado desde Postulaciones.");
      renderRoleDetail();
    });

    renderRoleDetail();
  }

  function downloadCalendar(audition) {
    const start = new Date(`${audition.date}T${audition.time || "12:00"}:00`);
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const toIcs = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const clean = (value) => String(value || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//StageLink Auditions//ES",
      "BEGIN:VEVENT",
      `UID:${audition.id}-${Date.now()}@stagelink.local`,
      `DTSTAMP:${toIcs(new Date())}`,
      `DTSTART:${toIcs(start)}`,
      `DTEND:${toIcs(end)}`,
      `SUMMARY:${clean(`Audición: ${audition.title}`)}`,
      `LOCATION:${clean(audition.location)}`,
      `DESCRIPTION:${clean(audition.description)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(audition.title)}-audicion.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Evento preparado", "Abre el archivo para agregarlo a tu calendario.");
  }

  function materialIcon(type) {
    return type === "image" ? "image" : type === "video" ? "video" : "file";
  }

  function initPortfolio() {
    if (getRole() !== "actor") {
      window.location.replace("dashboard.html");
      return;
    }
    const form = document.querySelector("#upload-form");
    const fileInput = document.querySelector("#material-file");
    const dropZone = document.querySelector("#drop-zone");
    const selectedFile = document.querySelector("#selected-file");
    const progress = document.querySelector("#upload-progress");
    const progressBar = document.querySelector("#upload-progress-bar");
    const grid = document.querySelector("#material-grid");
    const count = document.querySelector("#material-count");
    if (!form || !fileInput || !dropZone || !grid) return;

    let currentFile = null;

    function render() {
      const items = read(STORAGE.portfolio, []);
      count.textContent = `${items.length} ${items.length === 1 ? "elemento" : "elementos"}`;
      if (!items.length) {
        grid.innerHTML = `<div class="empty-state card" style="grid-column:1/-1"><div class="empty-state-inner"><span class="empty-icon">${icon("portfolio")}</span><h2>Tu portafolio está vacío</h2><p>Agrega al menos un headshot, un video y tu CV para postularte con mayor facilidad.</p></div></div>`;
        return;
      }
      grid.innerHTML = items.map((item, index) => `<article class="material-card card">
        <div class="material-preview">${item.preview ? `<img src="${escapeHtml(item.preview)}" alt="Vista previa de ${escapeHtml(item.name)}">` : icon(materialIcon(item.type))}</div>
        <div><h3>${escapeHtml(item.name)}</h3><p class="material-meta">${escapeHtml(item.size || "Archivo local")} ${item.demo ? "· Ejemplo" : ""}</p></div>
        <div class="badge-row">${(item.tags || []).map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="material-actions">
          <span>
            <button class="button ghost small" type="button" data-move="up" data-id="${escapeHtml(item.id)}" ${index === 0 ? "disabled" : ""} aria-label="Mover ${escapeHtml(item.name)} hacia arriba">↑</button>
            <button class="button ghost small" type="button" data-move="down" data-id="${escapeHtml(item.id)}" ${index === items.length - 1 ? "disabled" : ""} aria-label="Mover ${escapeHtml(item.name)} hacia abajo">↓</button>
          </span>
          <button class="button ghost small" type="button" data-delete-material="${escapeHtml(item.id)}" aria-label="Eliminar ${escapeHtml(item.name)}">${icon("trash", "icon-inline")}</button>
        </div>
      </article>`).join("");

      grid.querySelectorAll("[data-delete-material]").forEach((button) => {
        button.addEventListener("click", () => {
          const next = read(STORAGE.portfolio, []).filter((item) => item.id !== button.dataset.deleteMaterial);
          write(STORAGE.portfolio, next);
          render();
          showToast("Material eliminado");
        });
      });
      grid.querySelectorAll("[data-move]").forEach((button) => {
        button.addEventListener("click", () => {
          const current = read(STORAGE.portfolio, []);
          const from = current.findIndex((item) => item.id === button.dataset.id);
          const to = button.dataset.move === "up" ? from - 1 : from + 1;
          if (from < 0 || to < 0 || to >= current.length) return;
          [current[from], current[to]] = [current[to], current[from]];
          write(STORAGE.portfolio, current);
          render();
        });
      });
    }

    function setFile(file) {
      if (!file) return;
      currentFile = file;
      selectedFile.hidden = false;
      selectedFile.textContent = `${file.name} · ${formatFileSize(file.size)}`;
      if (!form.elements.name.value) form.elements.name.value = file.name.replace(/\.[^.]+$/, "");
      const inferred = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
      form.elements.type.value = inferred;
    }

    fileInput.addEventListener("change", () => setFile(fileInput.files?.[0]));
    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });
    ["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    }));
    ["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
    }));
    dropZone.addEventListener("drop", (event) => setFile(event.dataTransfer?.files?.[0]));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!currentFile) {
        fileInput.focus();
        showToast("Selecciona un archivo", "Puedes arrastrarlo o buscarlo en tu dispositivo.");
        return;
      }
      const data = new FormData(form);
      progress.hidden = false;
      progressBar.style.width = "12%";
      const submit = form.querySelector("button[type=submit]");
      submit.disabled = true;
      await pause(180);
      progressBar.style.width = "58%";
      let preview = "";
      if (currentFile.type.startsWith("image/") && currentFile.size <= 750000) {
        preview = await readFileAsDataUrl(currentFile);
      }
      await pause(220);
      progressBar.style.width = "100%";
      const items = read(STORAGE.portfolio, []);
      items.push({
        id: `material-${Date.now()}`,
        name: String(data.get("name") || currentFile.name).trim(),
        type: String(data.get("type") || "document"),
        tags: String(data.get("tags") || "").split(",").map((item) => item.trim()).filter(Boolean).slice(0, 6),
        size: formatFileSize(currentFile.size),
        preview,
        demo: false
      });
      write(STORAGE.portfolio, items);
      await pause(180);
      form.reset();
      currentFile = null;
      selectedFile.hidden = true;
      progress.hidden = true;
      progressBar.style.width = "0";
      submit.disabled = false;
      render();
      showToast("Material agregado", "Ya está disponible para tus postulaciones.");
    });

    render();
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result || "")), { once: true });
      reader.addEventListener("error", () => resolve(""), { once: true });
      reader.readAsDataURL(file);
    });
  }

  function pause(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function initNotifications() {
    const list = document.querySelector("#notification-list");
    const markAll = document.querySelector("#mark-all-read");
    if (!list) return;

    function render() {
      const notifications = read(STORAGE.notifications, []);
      if (!notifications.length) {
        list.innerHTML = `<div class="empty-state card"><div class="empty-state-inner"><span class="empty-icon">${icon("bell")}</span><h2>Todo al día</h2><p>Aquí aparecerán cambios en tus postulaciones y nuevas convocatorias relevantes.</p></div></div>`;
        return;
      }
      list.innerHTML = notifications.map((item) => `<article class="notification-item card" data-read="${item.read}">
        <span class="notification-icon">${icon(item.type === "calendar" ? "calendar" : item.type === "audition" ? "masks" : "bell")}</span>
        <div class="notification-copy"><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.message)}</p><time datetime="${escapeHtml(item.date)}">${escapeHtml(formatDateTime(item.date))}</time></div>
        <div>${item.link ? `<a class="button secondary small" href="${escapeHtml(item.link)}" data-read-notification="${escapeHtml(item.id)}">Ver</a>` : `<button class="button ghost small" type="button" data-read-notification="${escapeHtml(item.id)}">Marcar leída</button>`}</div>
      </article>`).join("");

      list.querySelectorAll("[data-read-notification]").forEach((control) => {
        control.addEventListener("click", () => {
          const next = read(STORAGE.notifications, []).map((item) => item.id === control.dataset.readNotification ? { ...item, read: true } : item);
          write(STORAGE.notifications, next);
          refreshShellCounts();
          if (control.tagName === "BUTTON") render();
        });
      });
    }

    markAll?.addEventListener("click", () => {
      write(STORAGE.notifications, read(STORAGE.notifications, []).map((item) => ({ ...item, read: true })));
      refreshShellCounts();
      render();
      showToast("Notificaciones marcadas como leídas");
    });
    render();
  }

  function initProfile() {
    const form = document.querySelector("#profile-form");
    if (!form) return;
    let selectedRole = getRole();
    let avatarData = getProfile(selectedRole).avatar || "";
    const actorFields = document.querySelector("#actor-fields");
    const producerFields = document.querySelector("#producer-fields");
    const preview = document.querySelector("#profile-avatar-preview");
    const avatarInput = document.querySelector("#profile-avatar-input");
    const roleButtons = document.querySelectorAll("[data-profile-role]");

    function populate(role) {
      selectedRole = role;
      const profile = getProfile(role);
      avatarData = profile.avatar || "";
      for (const [key, value] of Object.entries(profile)) {
        if (form.elements[key] && key !== "avatar") form.elements[key].value = value || "";
      }
      actorFields.hidden = role !== "actor";
      producerFields.hidden = role !== "producer";
      roleButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.profileRole === role)));
      preview.innerHTML = avatarData ? `<img src="${escapeHtml(avatarData)}" alt="Vista previa de foto de perfil">` : escapeHtml(initials(profile.displayName));
      document.querySelector("#profile-preview-name").textContent = profile.displayName;
      document.querySelector("#profile-preview-role").textContent = role === "actor" ? "Artista escénico" : "Productora / compañía";
    }

    roleButtons.forEach((button) => button.addEventListener("click", () => populate(button.dataset.profileRole)));
    form.elements.displayName.addEventListener("input", () => {
      document.querySelector("#profile-preview-name").textContent = form.elements.displayName.value || "Nombre de perfil";
      if (!avatarData) preview.textContent = initials(form.elements.displayName.value);
    });

    avatarInput?.addEventListener("change", async () => {
      const file = avatarInput.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Archivo no compatible", "Selecciona una imagen JPG, PNG o WebP.");
        return;
      }
      if (file.size > 1000000) {
        showToast("Imagen demasiado grande", "Para esta demo usa una imagen menor de 1 MB.");
        return;
      }
      avatarData = await readFileAsDataUrl(file);
      preview.innerHTML = `<img src="${escapeHtml(avatarData)}" alt="Vista previa de foto de perfil">`;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const allowed = selectedRole === "actor"
        ? ["displayName", "city", "bio", "phone", "birthdate", "height", "ageRange", "skills", "languages"]
        : ["displayName", "city", "bio", "phone", "companyType", "website", "contactName"];
      const profile = Object.fromEntries(allowed.map((name) => [name, String(data.get(name) || "").trim()]));
      profile.avatar = avatarData;
      saveProfile(selectedRole, profile);
      setRole(selectedRole);
      showToast("Perfil actualizado", "Tus cambios se guardaron correctamente.");
      window.setTimeout(() => window.location.replace("profile.html"), 450);
    });

    document.querySelector("#reset-demo")?.addEventListener("click", () => {
      const confirmed = window.confirm("¿Restablecer todos los datos de demostración de StageLink?");
      if (!confirmed) return;
      Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
      ensureSeedData();
      setRole("actor");
      window.location.replace("index.html");
    });

    populate(selectedRole);
  }

  function initCreateAudition() {
    const formContainer = document.querySelector("#create-form-container");
    const guard = document.querySelector("#create-role-guard");
    if (getRole() !== "producer") {
      formContainer.hidden = true;
      guard.hidden = false;
      guard.querySelectorAll("[data-switch-role]").forEach((button) => button.addEventListener("click", () => {
        setRole(button.dataset.switchRole);
        window.location.reload();
      }));
      return;
    }
    guard.hidden = true;
    formContainer.hidden = false;

    const form = document.querySelector("#create-audition-form");
    const steps = [...document.querySelectorAll(".form-step")];
    const stepIndicators = [...document.querySelectorAll(".step")];
    const roleList = document.querySelector("#draft-role-list");
    const review = document.querySelector("#audition-review");
    const compensationType = form.elements.compensationType;
    const compensationField = document.querySelector("#compensation-field");
    let currentStep = 0;
    let draftRoles = [];

    const today = new Date().toISOString().slice(0, 10);
    form.elements.deadline.min = today;
    form.elements.date.min = today;

    function validateDates() {
      const deadline = form.elements.deadline;
      const auditionDate = form.elements.date;
      deadline.setCustomValidity("");
      auditionDate.setCustomValidity("");
      if (deadline.value && auditionDate.value && deadline.value > auditionDate.value) {
        deadline.setCustomValidity("La fecha límite debe ser anterior o igual a la fecha de audición.");
      }
    }

    form.elements.deadline.addEventListener("change", validateDates);
    form.elements.date.addEventListener("change", validateDates);

    function showStep(index) {
      currentStep = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, position) => step.hidden = position !== currentStep);
      stepIndicators.forEach((step, position) => {
        step.classList.toggle("is-active", position === currentStep);
        step.classList.toggle("is-complete", position < currentStep);
        step.setAttribute("aria-current", position === currentStep ? "step" : "false");
      });
      if (currentStep === 3) renderReview();
      document.querySelector("#create-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function validateStep(index) {
      if (index === 2) {
        if (!draftRoles.length) {
          showToast("Agrega al menos un rol", "Incluye el personaje que deseas convocar.");
          document.querySelector("#role-name")?.focus();
          return false;
        }
        return true;
      }
      if (index === 1) validateDates();
      const fields = [...steps[index].querySelectorAll("input[required], select[required], textarea[required]")];
      const invalid = fields.find((field) => !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        invalid.focus();
        return false;
      }
      return true;
    }

    function renderDraftRoles() {
      roleList.innerHTML = draftRoles.length
        ? draftRoles.map((role) => `<article class="draft-role card"><div><h3>${escapeHtml(role.name)}</h3><p>${escapeHtml(role.profile)} · ${escapeHtml(role.ageRange)}</p></div><button class="button ghost small" type="button" data-remove-draft-role="${escapeHtml(role.id)}" aria-label="Eliminar rol ${escapeHtml(role.name)}">${icon("trash", "icon-inline")}</button></article>`).join("")
        : `<div class="empty-state card"><div class="empty-state-inner"><p>Aún no has agregado roles.</p></div></div>`;
      roleList.querySelectorAll("[data-remove-draft-role]").forEach((button) => button.addEventListener("click", () => {
        draftRoles = draftRoles.filter((role) => role.id !== button.dataset.removeDraftRole);
        renderDraftRoles();
      }));
    }

    function renderReview() {
      const data = new FormData(form);
      const labels = {
        paid: data.get("compensation") || "Remunerado",
        "ad-honorem": "Proyecto ad honorem",
        experience: "Intercambio de experiencia"
      };
      review.innerHTML = `
        <div class="review-grid">
          <div class="review-item"><small>Obra o proyecto</small><strong>${escapeHtml(data.get("title"))}</strong></div>
          <div class="review-item"><small>Tipo</small><strong>${escapeHtml(data.get("type"))}</strong></div>
          <div class="review-item"><small>Compensación</small><strong>${escapeHtml(labels[data.get("compensationType")] || "Por definir")}</strong></div>
          <div class="review-item"><small>Fecha y hora</small><strong>${escapeHtml(formatDate(data.get("date")))} · ${escapeHtml(data.get("time"))}</strong></div>
          <div class="review-item"><small>Ubicación</small><strong>${escapeHtml(data.get("location"))}</strong></div>
          <div class="review-item"><small>Cierre</small><strong>${escapeHtml(formatDate(data.get("deadline")))}</strong></div>
        </div>
        <section class="detail-section"><h3>Descripción</h3><p>${escapeHtml(data.get("description"))}</p></section>
        <section class="detail-section"><h3>Roles (${draftRoles.length})</h3><div class="badge-row">${draftRoles.map((role) => `<span class="badge">${escapeHtml(role.name)}</span>`).join("")}</div></section>`;
    }

    form.querySelectorAll("[data-next-step]").forEach((button) => button.addEventListener("click", () => {
      if (validateStep(currentStep)) showStep(currentStep + 1);
    }));
    form.querySelectorAll("[data-prev-step]").forEach((button) => button.addEventListener("click", () => showStep(currentStep - 1)));

    compensationType.addEventListener("change", () => {
      const paid = compensationType.value === "paid";
      compensationField.hidden = !paid;
      form.elements.compensation.required = paid;
    });

    document.querySelector("#add-role")?.addEventListener("click", () => {
      const fields = ["roleName", "roleProfile", "roleAge", "roleGender", "roleDescription", "roleRequirement"];
      const requiredRoleFields = ["roleName", "roleProfile", "roleAge", "roleDescription"];
      const invalid = requiredRoleFields.map((name) => form.elements[name]).find((field) => !field.value.trim());
      if (invalid) {
        showToast("Completa los datos del rol", "Nombre, perfil, rango de edad y descripción son necesarios.");
        invalid.focus();
        return;
      }
      const name = form.elements.roleName.value.trim();
      draftRoles.push({
        id: `${slugify(name)}-${Date.now()}`,
        name,
        profile: form.elements.roleProfile.value.trim(),
        ageRange: form.elements.roleAge.value.trim(),
        gender: form.elements.roleGender.value,
        description: form.elements.roleDescription.value.trim(),
        requirement: form.elements.roleRequirement.value.trim()
      });
      fields.forEach((fieldName) => form.elements[fieldName].value = "");
      renderDraftRoles();
      showToast("Rol agregado", "Puedes añadir otro o continuar a la revisión.");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateStep(2)) {
        showStep(2);
        return;
      }
      const data = new FormData(form);
      const profile = getProfile("producer");
      const materials = data.getAll("materials");
      const created = read(STORAGE.createdAuditions, []);
      const baseId = slugify(data.get("title"));
      const audition = {
        id: `${baseId}-${Date.now().toString().slice(-6)}`,
        title: String(data.get("title") || "").trim(),
        company: profile.displayName,
        type: String(data.get("type") || "Teatro"),
        compensationType: String(data.get("compensationType") || "experience"),
        compensation: String(data.get("compensation") || "").trim(),
        location: String(data.get("location") || "").trim(),
        district: String(data.get("district") || "").trim(),
        date: String(data.get("date") || ""),
        time: String(data.get("time") || ""),
        deadline: String(data.get("deadline") || ""),
        description: String(data.get("description") || "").trim(),
        requirements: String(data.get("requirements") || "").split("\n").map((item) => item.trim()).filter(Boolean),
        materials: materials.length ? materials : ["CV artístico"],
        roles: draftRoles,
        owner: true,
        createdAt: new Date().toISOString()
      };
      created.unshift(audition);
      if (!write(STORAGE.createdAuditions, created)) return;
      addNotification({ title: "Convocatoria publicada", message: `${audition.title} ya aparece en el feed de audiciones.`, link: `audition.html?id=${encodeURIComponent(audition.id)}`, type: "audition" });
      showToast("Convocatoria publicada", "Ya puede recibir postulaciones.");
      window.setTimeout(() => window.location.href = `audition.html?id=${encodeURIComponent(audition.id)}`, 550);
    });

    renderDraftRoles();
    showStep(0);
  }

  function statusClass(status) {
    if (["Seleccionado", "Aceptado"].includes(status)) return "success";
    if (["Rechazado", "No seleccionado"].includes(status)) return "danger";
    return "warning";
  }

  function initDashboard() {
    const role = getRole();
    const actorRoot = document.querySelector("#actor-dashboard");
    const producerRoot = document.querySelector("#producer-dashboard");
    if (role === "producer") {
      actorRoot.hidden = true;
      producerRoot.hidden = false;
      initProducerDashboard(producerRoot);
    } else {
      producerRoot.hidden = true;
      actorRoot.hidden = false;
      initActorDashboard(actorRoot);
    }
  }

  function initActorDashboard(root) {
    const list = root.querySelector("#application-list");
    const applications = read(STORAGE.applications, []);
    const stats = root.querySelector("#application-stats");
    const active = applications.filter((item) => !["Seleccionado", "No seleccionado", "Rechazado"].includes(item.status)).length;
    const selected = applications.filter((item) => ["Seleccionado", "Aceptado"].includes(item.status)).length;
    stats.innerHTML = `<div class="stat-card card"><strong>${applications.length}</strong><span>Postulaciones</span></div><div class="stat-card card"><strong>${active}</strong><span>En proceso</span></div><div class="stat-card card"><strong>${selected}</strong><span>Seleccionadas</span></div>`;
    if (!applications.length) {
      list.innerHTML = `<div class="empty-state card"><div class="empty-state-inner"><span class="empty-icon">${icon("inbox")}</span><h2>Aún no tienes postulaciones</h2><p>Explora convocatorias y elige el rol que mejor encaje con tu perfil.</p><a class="button" href="feed.html">Buscar audiciones</a></div></div>`;
      return;
    }
    list.innerHTML = applications.map((application) => `<article class="application-card card"><div><div class="badge-row"><span class="badge ${statusClass(application.status)}">${escapeHtml(application.status)}</span></div><h3>${escapeHtml(application.title)} · ${escapeHtml(application.roleName)}</h3><p>${escapeHtml(application.company)} · Enviada ${escapeHtml(formatDateTime(application.date))}</p></div><div class="card-actions"><a class="button secondary small" href="audition.html?id=${encodeURIComponent(application.auditionId)}">Ver convocatoria</a></div></article>`).join("");
  }

  function initProducerDashboard(root) {
    const auditions = getAuditions().filter((item) => item.owner);
    const createdIds = new Set(read(STORAGE.createdAuditions, []).map((item) => item.id));
    const selector = root.querySelector("#managed-audition");
    const list = root.querySelector("#candidate-list");
    const managementList = root.querySelector("#management-list");
    const requested = new URLSearchParams(window.location.search).get("audition");
    selector.innerHTML = auditions.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === requested ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("");
    managementList.innerHTML = auditions.map((item) => {
      const candidates = read(STORAGE.candidates, []).filter((candidate) => candidate.auditionId === item.id).length;
      return `<article class="management-card card"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(formatDate(item.date))} · ${candidates} postulantes${createdIds.has(item.id) ? " · Creada en esta demo" : ""}</p></div><a class="button secondary small" href="audition.html?id=${encodeURIComponent(item.id)}">Ver</a></article>`;
    }).join("");

    function renderCandidates() {
      const candidates = read(STORAGE.candidates, []).filter((candidate) => candidate.auditionId === selector.value);
      const stats = root.querySelector("#candidate-stats");
      const accepted = candidates.filter((candidate) => candidate.status === "Aceptado").length;
      const pending = candidates.filter((candidate) => ["En espera", "En consideración"].includes(candidate.status)).length;
      stats.innerHTML = `<div class="stat-card card"><strong>${candidates.length}</strong><span>Postulantes</span></div><div class="stat-card card"><strong>${pending}</strong><span>En evaluación</span></div><div class="stat-card card"><strong>${accepted}</strong><span>Aceptados</span></div>`;
      if (!candidates.length) {
        list.innerHTML = `<div class="empty-state card"><div class="empty-state-inner"><span class="empty-icon">${icon("users")}</span><h3>Aún no hay postulantes</h3><p>Los perfiles aparecerán aquí conforme lleguen postulaciones.</p></div></div>`;
        return;
      }
      list.innerHTML = candidates.map((candidate) => `<article class="candidate-card card" data-candidate="${escapeHtml(candidate.id)}">
        ${avatarMarkup({ displayName: candidate.name, avatar: "" })}
        <div><h3>${escapeHtml(candidate.name)}</h3><p>${escapeHtml(candidate.role)} · ${candidate.age} años</p><div class="badge-row">${candidate.skills.map((skill) => `<span class="badge">${escapeHtml(skill)}</span>`).join("")}</div><div class="rating" aria-label="Calificación de ${escapeHtml(candidate.name)}">${[1,2,3,4,5].map((value) => `<button class="star-button ${value <= candidate.rating ? "is-active" : ""}" type="button" data-rating="${value}" aria-label="${value} estrellas">★</button>`).join("")}</div><label class="field"><span class="field-label">Nota privada</span><textarea class="textarea" rows="2" data-candidate-note>${escapeHtml(candidate.note || "")}</textarea></label><button class="button ghost small" type="button" data-save-note>Guardar nota</button></div>
        <div class="candidate-actions"><label class="field"><span class="field-label">Estado</span><select class="select status-select" data-candidate-status>${["En espera", "En consideración", "Aceptado", "Rechazado"].map((status) => `<option ${status === candidate.status ? "selected" : ""}>${status}</option>`).join("")}</select></label><button class="button secondary small" type="button" data-view-candidate>Ver portafolio</button></div>
      </article>`).join("");

      list.querySelectorAll("[data-candidate]").forEach((card) => {
        const id = card.dataset.candidate;
        card.querySelectorAll("[data-rating]").forEach((button) => button.addEventListener("click", () => {
          updateCandidate(id, { rating: Number(button.dataset.rating) });
          renderCandidates();
        }));
        card.querySelector("[data-candidate-status]")?.addEventListener("change", (event) => {
          updateCandidate(id, { status: event.target.value });
          showToast("Estado actualizado", `${card.querySelector("h3").textContent}: ${event.target.value}`);
          renderCandidates();
        });
        card.querySelector("[data-save-note]")?.addEventListener("click", () => {
          updateCandidate(id, { note: card.querySelector("[data-candidate-note]").value.trim() });
          showToast("Nota privada guardada");
        });
        card.querySelector("[data-view-candidate]")?.addEventListener("click", () => {
          const candidate = read(STORAGE.candidates, []).find((item) => item.id === id);
          if (candidate) openCandidatePreview(candidate);
        });
      });
    }

    selector.addEventListener("change", renderCandidates);
    renderCandidates();
  }

  function updateCandidate(id, patch) {
    const candidates = read(STORAGE.candidates, []);
    const next = candidates.map((candidate) => candidate.id === id ? { ...candidate, ...patch } : candidate);
    write(STORAGE.candidates, next);
  }

  function openCandidatePreview(candidate) {
    const dialog = document.createElement("dialog");
    dialog.className = "dialog";
    dialog.setAttribute("aria-labelledby", "candidate-preview-title");
    dialog.innerHTML = `
      <header class="dialog-header">
        <div><h2 id="candidate-preview-title">${escapeHtml(candidate.name)}</h2><p>${escapeHtml(candidate.role)} · ${escapeHtml(candidate.age)} años</p></div>
        <button class="dialog-close" type="button" data-close-candidate aria-label="Cerrar">${icon("close", "icon-inline")}</button>
      </header>
      <div class="dialog-body detail-copy">
        <section class="detail-section"><h3>Habilidades</h3><div class="badge-row">${candidate.skills.map((skill) => `<span class="badge">${escapeHtml(skill)}</span>`).join("")}</div></section>
        <section class="detail-section"><h3>Material compartido</h3>
          <div class="material-grid">
            <div class="material-card card"><div class="material-preview">${icon("image")}</div><h3>Headshot profesional</h3><p class="material-meta">Imagen · Vista de demostración</p></div>
            <div class="material-card card"><div class="material-preview">${icon("video")}</div><h3>Reel de actuación</h3><p class="material-meta">Video · 01:24</p></div>
            <div class="material-card card"><div class="material-preview">${icon("file")}</div><h3>CV artístico</h3><p class="material-meta">Documento PDF</p></div>
          </div>
        </section>
      </div>
      <footer class="dialog-actions"><button class="button" type="button" data-close-candidate>Cerrar</button></footer>`;
    document.body.append(dialog);
    document.body.classList.add("modal-open");
    dialog.querySelectorAll("[data-close-candidate]").forEach((button) => button.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
      dialog.remove();
    }, { once: true });
    dialog.showModal();
  }

  function registerWebMcpTools() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch((error) => console.warn("WebMCP", error));
      } catch (error) {
        console.warn("WebMCP", error);
      }
    };

    register({
      name: "list_auditions",
      title: "Listar audiciones",
      description: "Busca convocatorias abiertas de StageLink por texto, tipo o ubicación sin modificar datos.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          type: { type: "string", enum: ["Teatro", "Musical", "Cortometraje"] },
          district: { type: "string" }
        },
        additionalProperties: false
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input = {}) {
        const query = String(input.query || "").toLocaleLowerCase("es");
        const matches = getAuditions().filter((item) => {
          const text = `${item.title} ${item.company} ${item.location}`.toLocaleLowerCase("es");
          return (!query || text.includes(query)) && (!input.type || item.type === input.type) && (!input.district || item.district === input.district);
        });
        return { count: matches.length, auditions: matches.map(({ id, title, company, type, district, date, deadline }) => ({ id, title, company, type, district, date, deadline })) };
      }
    });

    register({
      name: "save_audition",
      title: "Guardar convocatoria",
      description: "Guarda una convocatoria existente en la lista personal del usuario.",
      inputSchema: { type: "object", properties: { auditionId: { type: "string" } }, required: ["auditionId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const audition = findAudition(input.auditionId);
        if (!audition) throw new Error("La convocatoria no existe.");
        const saved = read(STORAGE.savedAuditions, []);
        if (!saved.includes(audition.id)) {
          saved.push(audition.id);
          write(STORAGE.savedAuditions, saved);
        }
        showToast("Convocatoria guardada");
        return { auditionId: audition.id, saved: true };
      }
    });

    register({
      name: "submit_application",
      title: "Enviar postulación",
      description: "Envía la postulación del perfil de artista actual a un rol específico y actualiza el seguimiento visible.",
      inputSchema: {
        type: "object",
        properties: { auditionId: { type: "string" }, roleId: { type: "string" }, note: { type: "string" } },
        required: ["auditionId", "roleId"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input) {
        if (getRole() !== "actor") throw new Error("Cambia al perfil de Artista para postularte.");
        const audition = findAudition(input.auditionId);
        const role = audition?.roles.find((item) => item.id === input.roleId);
        if (!audition || !role) throw new Error("La convocatoria o el rol no existen.");
        const applications = read(STORAGE.applications, []);
        const existing = applications.find((item) => item.auditionId === audition.id && item.roleId === role.id);
        if (existing) return { applicationId: existing.id, status: existing.status, duplicate: true };
        const application = {
          id: `application-${Date.now()}`,
          auditionId: audition.id,
          roleId: role.id,
          roleName: role.name,
          title: audition.title,
          company: audition.company,
          date: new Date().toISOString(),
          status: "En revisión",
          materials: read(STORAGE.portfolio, []).map((item) => item.id),
          note: String(input.note || "")
        };
        applications.unshift(application);
        write(STORAGE.applications, applications);
        addNotification({ title: "Postulación enviada", message: `${audition.title} · ${role.name}`, link: "dashboard.html", type: "status" });
        return { applicationId: application.id, status: application.status, duplicate: false };
      }
    });

    window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
  }

  function init() {
    ensureSeedData();
    const page = document.body.dataset.page || "";
    if (page !== "welcome" && !initShell(page)) return;
    const initializers = {
      welcome: initWelcome,
      feed: initFeed,
      audition: initAudition,
      portfolio: initPortfolio,
      notifications: initNotifications,
      profile: initProfile,
      create: initCreateAudition,
      dashboard: initDashboard
    };
    initializers[page]?.();
    registerWebMcpTools();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
