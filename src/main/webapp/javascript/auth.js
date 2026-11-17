(() => {
  "use strict";

  const message = document.querySelector("#auth-message");

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

  function showPanel(mode, clear = true) {
    if (clear) clearMessage();
    const panels = {
      login: document.querySelector("#login-panel"),
      register: document.querySelector("#register-panel")
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

  function initAccess() {
    const initialMode = document.body.dataset.mode || "login";
    const requestedRole = document.body.dataset.role || "actor";
    const roleField = document.querySelector('#register-panel [name="role"]');
    if (roleField) roleField.value = requestedRole;
    showPanel(initialMode, false);

    document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
      tab.addEventListener("click", () => showPanel(tab.dataset.authMode));
    });

    const registerForm = document.querySelector("#register-panel");
    registerForm?.addEventListener("submit", (event) => {
      const password = registerForm.querySelector('[name="password"]')?.value;
      const passwordConfirm = registerForm.querySelector('[name="passwordConfirm"]')?.value;
      
      if (password && passwordConfirm && password !== passwordConfirm) {
        event.preventDefault();
        showMessage("Las contraseñas no coinciden.", "error");
      }
    });
  }

  function initReset() {
    const form = document.querySelector("#reset-password-form");

    form?.addEventListener("submit", (event) => {
      const password = form.querySelector('[name="password"]')?.value;
      const passwordConfirm = form.querySelector('[name="passwordConfirm"]')?.value;

      if (password && passwordConfirm && password !== passwordConfirm) {
        event.preventDefault();
        showMessage("Las contraseñas no coinciden.", "error");
      }
    });
  }

  const page = document.body.dataset.authPage;
  if (page === "access") initAccess();
  if (page === "reset") initReset();
})();