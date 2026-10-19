(() => {
  "use strict";

  const config = window.STAGELINK_CONFIG || {};
  const configured = Boolean(
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(config.supabaseUrl || ""))
    && String(config.supabasePublishableKey || "").length > 20
    && !String(config.supabasePublishableKey).includes("YOUR_")
  );

  let client = null;
  let session = null;
  let profile = null;

  function assertConfigured() {
    if (!configured) throw new Error("Supabase todavía no está configurado.");
    if (!client) throw new Error("No se pudo iniciar la conexión con Supabase.");
  }

  function cleanFileName(value) {
    return String(value || "archivo")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-100) || "archivo";
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

  function list(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function safeHttpUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const parsed = new URL(raw);
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
    } catch {
      return "";
    }
  }

  function ageFromBirthdate(value) {
    if (!value) return null;
    const birthdate = new Date(`${value}T12:00:00`);
    if (Number.isNaN(birthdate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const beforeBirthday = today.getMonth() < birthdate.getMonth()
      || (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate());
    if (beforeBirthday) age -= 1;
    return age;
  }

  function mapProfile(row = {}) {
    return {
      id: row.id || "",
      role: row.role || "actor",
      displayName: row.display_name || "",
      city: row.city || "",
      bio: row.bio || "",
      phone: row.phone || "",
      birthdate: row.birthdate || "",
      height: row.height || "",
      ageRange: row.age_range || "",
      gender: row.gender || "",
      skills: Array.isArray(row.skills) ? row.skills.join(", ") : (row.skills || ""),
      languages: Array.isArray(row.languages) ? row.languages.join(", ") : (row.languages || ""),
      companyType: row.company_type || "",
      companySize: row.company_size || "",
      website: row.website || "",
      contactName: row.contact_name || "",
      avatar: row.avatar_url || ""
    };
  }

  function profileToRow(value) {
    const row = {
      role: value.role === "producer" ? "producer" : "actor",
      display_name: String(value.displayName || "").trim(),
      city: String(value.city || "").trim(),
      bio: String(value.bio || "").trim(),
      phone: String(value.phone || "").trim(),
      avatar_url: String(value.avatar || "").trim()
    };
    if (row.role === "actor") {
      Object.assign(row, {
        birthdate: value.birthdate || null,
        height: String(value.height || "").trim(),
        age_range: String(value.ageRange || "").trim(),
        gender: String(value.gender || "").trim() || null,
        skills: list(value.skills),
        languages: list(value.languages)
      });
    } else {
      Object.assign(row, {
        company_type: String(value.companyType || "").trim(),
        company_size: String(value.companySize || "").trim() || null,
        website: String(value.website || "").trim(),
        contact_name: String(value.contactName || "").trim()
      });
    }
    return row;
  }

  function mapRole(row = {}) {
    return {
      id: row.id,
      name: row.name || "Rol",
      profile: row.profile || "Perfil abierto",
      ageRange: row.age_range || "Edad abierta",
      ageMin: row.age_min,
      ageMax: row.age_max,
      gender: row.gender || "Cualquier género",
      description: row.description || "",
      requirement: row.requirement || ""
    };
  }

  function mapAudition(row = {}, userId = "") {
    return {
      id: row.id,
      slug: row.slug || "",
      title: row.title || "Convocatoria",
      company: row.company || "Productora",
      companySize: row.company_size || "",
      type: row.type || "Teatro",
      compensationType: row.compensation_type || "experience",
      compensation: row.compensation || "",
      location: row.location || "",
      district: row.district || "",
      date: row.audition_date || "",
      time: String(row.audition_time || "").slice(0, 5),
      deadline: row.deadline || "",
      description: row.description || "",
      requirements: row.requirements || [],
      materials: row.materials || [],
      status: row.status || "published",
      ownerId: row.owner_id,
      owner: row.owner_id === userId,
      roles: (row.roles || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(mapRole),
      createdAt: row.created_at
    };
  }

  async function signedPortfolioUrl(item) {
    if (item.external_url) return safeHttpUrl(item.external_url);
    if (!item.storage_path) return "";
    const { data, error } = await client.storage.from("portfolio").createSignedUrl(item.storage_path, 3600);
    if (error) return "";
    return data?.signedUrl || "";
  }

  async function mapPortfolioItem(row = {}) {
    return {
      id: row.id,
      name: row.name || "Material",
      type: row.type || "document",
      tags: row.tags || [],
      size: formatFileSize(Number(row.size_bytes || 0)),
      sizeBytes: Number(row.size_bytes || 0),
      storagePath: row.storage_path || "",
      externalUrl: row.external_url || "",
      preview: await signedPortfolioUrl(row),
      demo: false,
      sortOrder: Number(row.sort_order || 0)
    };
  }

  function formatFileSize(bytes) {
    if (!bytes) return "Enlace externo";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function unwrap(result, fallbackMessage) {
    if (result.error) throw new Error(result.error.message || fallbackMessage);
    return result.data;
  }

  async function initialize() {
    if (!configured) return { configured: false, session: null };
    if (!window.supabase?.createClient) {
      throw new Error("No fue posible cargar la biblioteca de Supabase.");
    }
    if (!client) {
      client = window.supabase.createClient(config.supabaseUrl.replace(/\/$/, ""), config.supabasePublishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }
    const result = await client.auth.getSession();
    if (result.error) throw new Error(result.error.message);
    session = result.data.session;
    return { configured: true, session };
  }

  async function ensureProfile() {
    assertConfigured();
    if (!session?.user) return null;
    let result = await client.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
    if (result.error) throw new Error(result.error.message);
    if (!result.data) {
      const metadata = session.user.user_metadata || {};
      result = await client.from("profiles").upsert({
        id: session.user.id,
        role: metadata.role === "producer" ? "producer" : "actor",
        display_name: metadata.display_name || session.user.email?.split("@")[0] || "Usuario"
      }).select("*").single();
      if (result.error) throw new Error(result.error.message);
    }
    profile = result.data;
    return mapProfile(profile);
  }

  async function signUp({ email, password, displayName, role }) {
    assertConfigured();
    const redirect = new URL("feed.html", window.location.href).href;
    const result = await client.auth.signUp({
      email: String(email || "").trim(),
      password,
      options: {
        emailRedirectTo: redirect,
        data: {
          display_name: String(displayName || "").trim(),
          role: role === "producer" ? "producer" : "actor"
        }
      }
    });
    if (result.error) throw new Error(result.error.message);
    session = result.data.session;
    if (session) await ensureProfile();
    return result.data;
  }

  async function signIn({ email, password }) {
    assertConfigured();
    const result = await client.auth.signInWithPassword({ email: String(email || "").trim(), password });
    if (result.error) throw new Error(result.error.message);
    session = result.data.session;
    await ensureProfile();
    return result.data;
  }

  async function signOut() {
    assertConfigured();
    const result = await client.auth.signOut();
    if (result.error) throw new Error(result.error.message);
    session = null;
    profile = null;
  }

  async function requestPasswordReset(email) {
    assertConfigured();
    const redirectTo = new URL("reset-password.html", window.location.href).href;
    const result = await client.auth.resetPasswordForEmail(String(email || "").trim(), { redirectTo });
    if (result.error) throw new Error(result.error.message);
  }

  async function updatePassword(password) {
    assertConfigured();
    const result = await client.auth.updateUser({ password });
    if (result.error) throw new Error(result.error.message);
  }

  async function fetchState() {
    assertConfigured();
    if (!session?.user) throw new Error("Debes iniciar sesión.");
    const currentProfile = await ensureProfile();
    const userId = session.user.id;

    const auditionPromise = client.from("auditions")
      .select("*, roles:audition_roles(*)")
      .order("created_at", { ascending: false });
    const portfolioPromise = client.from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true });
    const historyPromise = client.from("work_history")
      .select("*")
      .eq("user_id", userId)
      .order("production_year", { ascending: false, nullsFirst: false });
    const savedPromise = client.from("saved_auditions")
      .select("audition_id")
      .eq("user_id", userId);
    const noticesPromise = client.from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const applicationsPromise = client.from("applications")
      .select("*, audition:auditions!applications_audition_id_fkey(id,title,company,audition_date,audition_time,location,owner_id), role:audition_roles!applications_role_id_fkey(id,name), actor:profiles!applications_actor_id_fkey(id,display_name,birthdate,city,bio,skills,avatar_url,history:work_history(id,production,company,role_name,production_year,description)), shared:application_materials(portfolio_item:portfolio_items!application_materials_portfolio_item_id_fkey(*))")
      .order("created_at", { ascending: false });

    const [auditionResult, portfolioResult, historyResult, savedResult, noticesResult, applicationsResult] = await Promise.all([
      auditionPromise, portfolioPromise, historyPromise, savedPromise, noticesPromise, applicationsPromise
    ]);
    const auditionRows = unwrap(auditionResult, "No fue posible cargar las convocatorias.") || [];
    const portfolioRows = unwrap(portfolioResult, "No fue posible cargar el portafolio.") || [];
    const historyRows = unwrap(historyResult, "No fue posible cargar la experiencia artística.") || [];
    const savedRows = unwrap(savedResult, "No fue posible cargar las convocatorias guardadas.") || [];
    const noticeRows = unwrap(noticesResult, "No fue posible cargar las notificaciones.") || [];
    const applicationRows = unwrap(applicationsResult, "No fue posible cargar las postulaciones.") || [];

    const auditions = auditionRows.map((row) => mapAudition(row, userId));
    const portfolio = await Promise.all(portfolioRows.map(mapPortfolioItem));
    const mappedApplications = [];
    const candidates = [];

    for (const row of applicationRows) {
      const sharedRows = (row.shared || []).map((item) => item.portfolio_item).filter(Boolean);
      const materials = await Promise.all(sharedRows.map(mapPortfolioItem));
      if (row.actor_id === userId) {
        mappedApplications.push({
          id: row.id,
          auditionId: row.audition_id,
          roleId: row.role_id,
          roleName: row.role?.name || "Rol",
          title: row.audition?.title || "Convocatoria",
          company: row.audition?.company || "Productora",
          date: row.created_at,
          status: row.status,
          materials: materials.map((item) => item.id),
          sharedMaterials: materials,
          note: row.note || "",
          auditionTime: row.appointment_at || ""
        });
      }
      if (row.audition?.owner_id === userId) {
        candidates.push({
          id: row.id,
          auditionId: row.audition_id,
          actorId: row.actor_id,
          name: row.actor?.display_name || "Artista",
          age: ageFromBirthdate(row.actor?.birthdate),
          role: row.role?.name || "Rol",
          skills: row.actor?.skills || [],
          status: row.status,
          rating: Number(row.rating || 0),
          note: row.private_note || "",
          applicationNote: row.note || "",
          avatar: row.actor?.avatar_url || "",
          city: row.actor?.city || "",
          bio: row.actor?.bio || "",
          materials,
          workHistory: (row.actor?.history || []).map((item) => ({
            id: item.id,
            production: item.production,
            company: item.company || "",
            roleName: item.role_name || "",
            year: item.production_year || "",
            description: item.description || ""
          })),
          auditionTime: row.appointment_at || ""
        });
      }
    }

    return {
      role: currentProfile.role,
      profile: currentProfile,
      auditions,
      portfolio,
      workHistory: historyRows.map((row) => ({
        id: row.id,
        production: row.production,
        company: row.company || "",
        roleName: row.role_name || "",
        year: row.production_year || "",
        description: row.description || ""
      })),
      savedAuditions: savedRows.map((row) => row.audition_id),
      applications: mappedApplications,
      candidates,
      notifications: noticeRows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        message: row.message,
        date: row.created_at,
        read: row.read,
        link: row.link || ""
      }))
    };
  }

  async function uploadAvatar(file) {
    if (!file) return profile?.avatar_url || "";
    const extension = cleanFileName(file.name).split(".").pop() || "jpg";
    const path = `${session.user.id}/avatar.${extension}`;
    const uploaded = await client.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: true
    });
    if (uploaded.error) throw new Error(uploaded.error.message);
    const publicResult = client.storage.from("avatars").getPublicUrl(path);
    return `${publicResult.data.publicUrl}?v=${Date.now()}`;
  }

  async function updateProfile(value, avatarFile = null) {
    assertConfigured();
    const currentRole = profile?.role === "producer" ? "producer" : "actor";
    const row = profileToRow({ ...value, role: currentRole });
    delete row.role;
    if (avatarFile) row.avatar_url = await uploadAvatar(avatarFile);
    const result = await client.from("profiles").update(row).eq("id", session.user.id).select("*").single();
    if (result.error) throw new Error(result.error.message);
    profile = result.data;
    return mapProfile(result.data);
  }

  async function uploadPortfolioItem({ file, externalUrl, name, type, tags, sortOrder }) {
    assertConfigured();
    if (!file && !externalUrl) throw new Error("Selecciona un archivo o agrega un enlace externo.");
    const normalizedExternalUrl = safeHttpUrl(externalUrl);
    if (externalUrl && !normalizedExternalUrl) throw new Error("El enlace debe comenzar con http:// o https://.");
    let storagePath = null;
    if (file) {
      storagePath = `${session.user.id}/${crypto.randomUUID()}-${cleanFileName(file.name)}`;
      const uploaded = await client.storage.from("portfolio").upload(storagePath, file, {
        cacheControl: "3600",
        contentType: file.type || "application/octet-stream",
        upsert: false
      });
      if (uploaded.error) throw new Error(uploaded.error.message);
    }
    const row = {
      user_id: session.user.id,
      name: String(name || file?.name || "Material").trim(),
      type: ["image", "video", "document"].includes(type) ? type : "document",
      tags: list(tags).slice(0, 8),
      size_bytes: file?.size || 0,
      storage_path: storagePath,
      external_url: normalizedExternalUrl || null,
      sort_order: Number(sortOrder || 0)
    };
    const result = await client.from("portfolio_items").insert(row).select("*").single();
    if (result.error) {
      if (storagePath) await client.storage.from("portfolio").remove([storagePath]);
      throw new Error(result.error.message);
    }
    return mapPortfolioItem(result.data);
  }

  async function deletePortfolioItem(item) {
    assertConfigured();
    const result = await client.from("portfolio_items").delete().eq("id", item.id);
    if (result.error) throw new Error(result.error.message);
    if (item.storagePath) {
      const removed = await client.storage.from("portfolio").remove([item.storagePath]);
      if (removed.error) console.warn("No fue posible limpiar el archivo eliminado", removed.error);
    }
  }

  async function reorderPortfolio(items) {
    assertConfigured();
    const updates = items.map((item, index) => client.from("portfolio_items")
      .update({ sort_order: index }).eq("id", item.id).eq("user_id", session.user.id));
    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    if (failed) throw new Error(failed.error.message);
  }

  async function addWorkHistory(value) {
    assertConfigured();
    const result = await client.from("work_history").insert({
      user_id: session.user.id,
      production: String(value.production || "").trim(),
      company: String(value.company || "").trim(),
      role_name: String(value.roleName || "").trim(),
      production_year: Number(value.year) || null,
      description: String(value.description || "").trim()
    }).select("*").single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  }

  async function deleteWorkHistory(id) {
    assertConfigured();
    const result = await client.from("work_history").delete().eq("id", id).eq("user_id", session.user.id);
    if (result.error) throw new Error(result.error.message);
  }

  async function setSavedAudition(auditionId, shouldSave) {
    assertConfigured();
    const result = shouldSave
      ? await client.from("saved_auditions").upsert({ user_id: session.user.id, audition_id: auditionId })
      : await client.from("saved_auditions").delete().eq("user_id", session.user.id).eq("audition_id", auditionId);
    if (result.error) throw new Error(result.error.message);
  }

  async function createApplication({ auditionId, roleId, note, materials }) {
    assertConfigured();
    const result = await client.from("applications").insert({
      audition_id: auditionId,
      role_id: roleId,
      actor_id: session.user.id,
      note: String(note || "").trim()
    }).select("id").single();
    if (result.error) throw new Error(result.error.message);
    const materialIds = [...new Set(materials || [])];
    if (materialIds.length) {
      const linked = await client.from("application_materials").insert(materialIds.map((portfolioItemId) => ({
        application_id: result.data.id,
        portfolio_item_id: portfolioItemId
      })));
      if (linked.error) {
        await client.from("applications").delete().eq("id", result.data.id);
        throw new Error(linked.error.message);
      }
    }
    return result.data.id;
  }

  async function cancelApplication(applicationId) {
    assertConfigured();
    const result = await client.from("applications").update({ status: "Retirada" })
      .eq("id", applicationId).eq("actor_id", session.user.id);
    if (result.error) throw new Error(result.error.message);
  }

  async function createAudition(value) {
    assertConfigured();
    const row = {
      owner_id: session.user.id,
      slug: `${slugify(value.title)}-${Date.now().toString(36)}`,
      title: value.title,
      company: value.company,
      company_size: value.companySize || null,
      type: value.type,
      compensation_type: value.compensationType,
      compensation: value.compensation || "",
      location: value.location,
      district: value.district,
      audition_date: value.date,
      audition_time: value.time,
      deadline: value.deadline,
      description: value.description,
      requirements: value.requirements || [],
      materials: value.materials || [],
      status: "published"
    };
    const inserted = await client.from("auditions").insert(row).select("*").single();
    if (inserted.error) throw new Error(inserted.error.message);
    const roleRows = (value.roles || []).map((role, index) => ({
      audition_id: inserted.data.id,
      name: role.name,
      profile: role.profile,
      age_range: role.ageRange || "",
      age_min: Number(role.ageMin) || null,
      age_max: Number(role.ageMax) || null,
      gender: role.gender || "Cualquier género",
      description: role.description,
      requirement: role.requirement || "",
      sort_order: index
    }));
    const rolesResult = await client.from("audition_roles").insert(roleRows).select("*");
    if (rolesResult.error) {
      await client.from("auditions").delete().eq("id", inserted.data.id);
      throw new Error(rolesResult.error.message);
    }
    inserted.data.roles = rolesResult.data;
    return mapAudition(inserted.data, session.user.id);
  }

  async function updateAuditionStatus(auditionId, status) {
    assertConfigured();
    if (!["published", "closed"].includes(status)) throw new Error("Estado de convocatoria no válido.");
    const result = await client.from("auditions").update({ status }).eq("id", auditionId).eq("owner_id", session.user.id);
    if (result.error) throw new Error(result.error.message);
  }

  async function deleteAudition(auditionId) {
    assertConfigured();
    const result = await client.from("auditions").delete().eq("id", auditionId).eq("owner_id", session.user.id);
    if (result.error) throw new Error(result.error.message);
  }

  async function updateCandidate(applicationId, patch) {
    assertConfigured();
    const row = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.rating !== undefined) row.rating = Number(patch.rating);
    if (patch.note !== undefined) row.private_note = String(patch.note || "").trim();
    if (patch.auditionTime !== undefined) row.appointment_at = patch.auditionTime || null;
    const result = await client.from("applications").update(row).eq("id", applicationId);
    if (result.error) throw new Error(result.error.message);
  }

  async function markNotification(id, read = true) {
    assertConfigured();
    const result = await client.from("notifications").update({ read }).eq("id", id).eq("user_id", session.user.id);
    if (result.error) throw new Error(result.error.message);
  }

  async function markAllNotifications() {
    assertConfigured();
    const result = await client.from("notifications").update({ read: true }).eq("user_id", session.user.id).eq("read", false);
    if (result.error) throw new Error(result.error.message);
  }

  window.StageLinkBackend = Object.freeze({
    configured,
    initialize,
    ensureProfile,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    updatePassword,
    fetchState,
    updateProfile,
    uploadPortfolioItem,
    deletePortfolioItem,
    reorderPortfolio,
    addWorkHistory,
    deleteWorkHistory,
    setSavedAudition,
    createApplication,
    cancelApplication,
    createAudition,
    updateAuditionStatus,
    deleteAudition,
    updateCandidate,
    markNotification,
    markAllNotifications,
    get session() { return session; },
    get user() { return session?.user || null; }
  });
})();
