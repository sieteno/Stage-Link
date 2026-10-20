(() => {
  "use strict";

  const backend = window.StageLinkBackend;
  const message = document.querySelector("#auth-message");
  const connectionNote = document.querySelector("#connection-note");

  function showMessage(text, type = "info") {
    if (!message) return;
    message.hidden = false;
    message.dataset.type = type;
    message.textContent = text;
  }

  function clearMessage() {
    if (!message) return;
    message.hidden = true;
    message.textContent = "";
    delete message.dataset.type;
  }

  function friendlyError(error) {
    const value = String(error?.message || error || "Ocurrió un error.");
    const translations = [
      [/invalid login credentials/i, "El correo o la contraseña no son correctos."],
      [/email not confirmed/i, "Confirma tu correo antes de iniciar sesión."],
      [/user already registered/i, "Ya existe una cuenta con ese correo."],
      [/password should be at least/i, "La contraseña no cumple la longitud mínima."],
      [/email rate limit exceeded/i, "Se enviaron demasiados correos. Espera unos minutos."],
      [/failed to fetch|network/i, "No fue posible conectar. Revisa tu internet e inténtalo nuevamente."]
    ];
    return translations.find(([pattern]) => pattern.test(value))?.[1] || value;
  }

  function setBusy(form, busy, label = "Procesando…") {
    const button = form?.querySelector('button[type="submit"]');
    if (!button) return;
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.disabled = busy;
    button.textContent = busy ? label : button.dataset.label;
  }

  function showPanel(mode) {
    clearMessage();
    const panels = {
      login: document.querySelector("#login-panel"),
      register: document.querySelector("#register-panel"),
      recovery: document.querySelector("#recovery-panel")
    };
    Object.entries(panels).forEach(([key, panel]) => {
      if (panel) panel.hidden = key !== mode;
    });
    document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
      const selected = tab.dataset.authMode === mode;
      tab.setAttribute("aria-selected", String(selected));
      tab.classList.toggle("is-active", selected);
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  async function initAccess() {
    if (!backend?.configured) {
      connectionNote.textContent = "Falta conectar Supabase en assets/config.js. Mientras tanto puedes volver al modo demostración.";
      showMessage("La base de datos todavía no está configurada.", "error");
      document.querySelectorAll("form button[type=submit]").forEach((button) => button.disabled = true);
      return;
    }

    try {
      const state = await backend.initialize();
      if (state.session) {
        window.location.replace("feed.html");
        return;
      }
      connectionNote.textContent = "Conexión segura activa. Tus datos se guardarán en tu cuenta.";
    } catch (error) {
      showMessage(friendlyError(error), "error");
      connectionNote.textContent = "No se pudo establecer la conexión.";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialMode = params.get("mode") === "register" ? "register" : "login";
    const requestedRole = params.get("role") === "producer" ? "producer" : "actor";
    const roleField = document.querySelector('#register-panel [name="role"]');
    if (roleField) roleField.value = requestedRole;
    showPanel(initialMode);

    document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
      tab.addEventListener("click", () => showPanel(tab.dataset.authMode));
    });
    document.querySelector("#forgot-password")?.addEventListener("click", () => showPanel("recovery"));
    document.querySelector("[data-back-login]")?.addEventListener("click", () => showPanel("login"));

    const loginForm = document.querySelector("#login-panel");
    loginForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!loginForm.reportValidity()) return;
      clearMessage();
      setBusy(loginForm, true, "Entrando…");
      try {
        const data = new FormData(loginForm);
        await backend.signIn({ email: data.get("email"), password: data.get("password") });
        window.location.replace("feed.html");
      } catch (error) {
        showMessage(friendlyError(error), "error");
        setBusy(loginForm, false);
      }
    });

    const registerForm = document.querySelector("#register-panel");
    registerForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!registerForm.reportValidity()) return;
      clearMessage();
      const data = new FormData(registerForm);
      if (data.get("password") !== data.get("passwordConfirm")) {
        showMessage("Las contraseñas no coinciden.", "error");
        return;
      }
      setBusy(registerForm, true, "Creando cuenta…");
      try {
        const result = await backend.signUp({
          displayName: data.get("displayName"),
          role: data.get("role"),
          email: data.get("email"),
          password: data.get("password")
        });
        if (result.session) {
          window.location.replace("profile.html");
          return;
        }
        registerForm.reset();
        showMessage("Cuenta creada. Revisa tu correo y abre el enlace de confirmación para entrar.", "success");
        setBusy(registerForm, false);
      } catch (error) {
        showMessage(friendlyError(error), "error");
        setBusy(registerForm, false);
      }
    });

    const recoveryForm = document.querySelector("#recovery-panel");
    recoveryForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!recoveryForm.reportValidity()) return;
      clearMessage();
      setBusy(recoveryForm, true, "Enviando…");
      try {
        const data = new FormData(recoveryForm);
        await backend.requestPasswordReset(data.get("email"));
        recoveryForm.reset();
        showMessage("Si el correo está registrado, recibirás un enlace para cambiar tu contraseña.", "success");
      } catch (error) {
        showMessage(friendlyError(error), "error");
      } finally {
        setBusy(recoveryForm, false);
      }
    });
  }

  async function initReset() {
    const form = document.querySelector("#reset-password-form");
    if (!backend?.configured) {
      showMessage("Supabase todavía no está configurado.", "error");
      form?.querySelector('button[type="submit"]')?.setAttribute("disabled", "");
      return;
    }
    try {
      const state = await backend.initialize();
      if (!state.session) {
        showMessage("El enlace no es válido o ya venció. Solicita uno nuevo.", "error");
        connectionNote.innerHTML = '<a href="auth.html">Volver al acceso</a>';
        form.hidden = true;
        return;
      }
      connectionNote.textContent = "Enlace validado correctamente.";
    } catch (error) {
      showMessage(friendlyError(error), "error");
      return;
    }

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get("password") !== data.get("passwordConfirm")) {
        showMessage("Las contraseñas no coinciden.", "error");
        return;
      }
      clearMessage();
      setBusy(form, true, "Guardando…");
      try {
        await backend.updatePassword(data.get("password"));
        showMessage("Contraseña actualizada. Ya puedes continuar a StageLink.", "success");
        connectionNote.innerHTML = '<a href="feed.html">Continuar a la plataforma</a>';
        form.hidden = true;
      } catch (error) {
        showMessage(friendlyError(error), "error");
        setBusy(form, false);
      }
    });
  }

  const page = document.body.dataset.authPage;
  if (page === "access") initAccess();
  if (page === "reset") initReset();
})();
