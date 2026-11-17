<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*"%>
<%@ page import="stagelink.Database,stagelink.Passwords,stagelink.Web" %>
<%
    String mensajeFeedback = "";
    String tipoMensaje = "";
    String panel = "register".equals(request.getParameter("mode")) ? "register" : "login";
    String selectedRole = "producer".equals(request.getParameter("role")) ? "producer" : "actor";

    if ("POST".equals(request.getMethod())) {
        String action = request.getParameter("accion");
        if ("logout".equals(action)) {
            session.invalidate();
            response.sendRedirect("index.jsp");
            return;
        }
        String email = Web.field(request, "email").toLowerCase(java.util.Locale.ROOT);
        String password = request.getParameter("password");
        try {
            if ("login".equals(action)) {
                panel = "login";
                String sql = "SELECT id, nombre, rol, hash_contrasena FROM usuario WHERE correo = ?";
                try (Connection conn = Database.open(); PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, email);
                    int id = 0;
                    String name = null;
                    String role = null;
                    String stored = null;
                    try (ResultSet user = stmt.executeQuery()) {
                        if (user.next()) {
                            id = user.getInt("id");
                            name = user.getString("nombre");
                            role = user.getString("rol");
                            stored = user.getString("hash_contrasena");
                        }
                    }
                    if (id > 0 && Passwords.matches(password, stored)) {
                        if (Passwords.isLegacy(stored)) {
                            try (PreparedStatement upgrade = conn.prepareStatement(
                                    "UPDATE usuario SET hash_contrasena = ? WHERE id = ? AND hash_contrasena = ?")) {
                                upgrade.setString(1, Passwords.hash(password));
                                upgrade.setInt(2, id);
                                upgrade.setString(3, stored);
                                upgrade.executeUpdate();
                            }
                        }
                        request.changeSessionId();
                        session.removeAttribute("csrf");
                        session.setAttribute("userId", id);
                        session.setAttribute("userRole", role);
                        session.setAttribute("userName", name);
                        response.sendRedirect("feed.jsp");
                        return;
                    }
                }
                mensajeFeedback = "El correo o la contraseña no son correctos.";
                tipoMensaje = "error";
            } else if ("register".equals(action)) {
                panel = "register";
                String name = Web.field(request, "displayName");
                String role = Web.field(request, "role");
                selectedRole = "producer".equals(role) ? "producer" : "actor";

                if (name.isEmpty() || name.length() > 80 || email.length() > 254
                        || !email.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")
                        || (!"actor".equals(role) && !"producer".equals(role))) {
                    mensajeFeedback = "Revisa el nombre, el correo y el tipo de cuenta.";
                    tipoMensaje = "error";
                } else if (!Passwords.validNewPassword(password)
                        || !password.equals(request.getParameter("passwordConfirm"))) {
                    mensajeFeedback = "Las contraseñas deben coincidir y tener entre 8 y 128 caracteres.";
                    tipoMensaje = "error";
                } else {
                    String sql = "INSERT INTO usuario (nombre, rol, correo, hash_contrasena) VALUES (?, ?, ?, ?)";
                    try (Connection conn = Database.open(); PreparedStatement stmt = conn.prepareStatement(sql)) {
                        stmt.setString(1, name);
                        stmt.setString(2, role);
                        stmt.setString(3, email);
                        stmt.setString(4, Passwords.hash(password));
                        stmt.executeUpdate();
                    }
                    panel = "login";
                    mensajeFeedback = "Cuenta creada con éxito. Ya puedes iniciar sesión.";
                    tipoMensaje = "success";
                }
            }
        } catch (SQLIntegrityConstraintViolationException error) {
            mensajeFeedback = "El correo ya está registrado.";
            tipoMensaje = "error";
        } catch (Exception error) {
            application.log("Error de autenticación en StageLink.", error);
            mensajeFeedback = "El servicio de cuentas no está disponible en este momento.";
            tipoMensaje = "error";
        }
    }
%>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description"
	content="Crea una cuenta o inicia sesión en StageLink Auditions.">
<title>Acceso · StageLink Auditions</title>

<!-- Icono de la aplicación en formato SVG -->
<link rel="icon" type="image/svg+xml"
	href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230a0a0a'/%3E%3Cpath d='M18 18h30v8H27v7h17v8H27v10h-9z' fill='white'/%3E%3C/svg%3E">

<!-- Hojas de estilos generales (ajustamos la ruta relativa '../css/styles.css') -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css">

<!-- Ya no usamos Supabase ni backend.js en la nube; solo tu JS local de interfaz si se requiere -->
<script src="${pageContext.request.contextPath}/javascript/auth.js" defer></script>
</head>
<body data-auth-page="access" data-mode="<%= panel %>" data-role="<%= selectedRole %>">
	<main class="welcome-page">
		<div class="welcome-shell">

			<!-- Sección izquierda: Identidad de marca y mensajes de bienvenida -->
			<section class="welcome-copy" aria-labelledby="access-copy-title">
				<a class="brand" href="index.jsp" aria-label="StageLink Auditions">
					<span class="brand-mark">SL</span> <span>StageLink<small>Auditions</small></span>
				</a>
				<h1 id="access-copy-title">
					Entra.<br>
					<span>Conecta.</span>
				</h1>
				<p>Tu perfil, convocatorias y postulaciones disponibles desde
					cualquier dispositivo.</p>
			</section>

			<!-- Sección derecha: Paneles de autenticación (Login, Registro y Recuperación) -->
			<section class="role-entry" aria-labelledby="auth-title">

				<!-- Pestañas de navegación visual gestionadas por JavaScript -->
				<div class="auth-tabs" role="tablist"
					aria-label="Acceso a StageLink">
					<button class="auth-tab" id="login-tab" type="button" role="tab"
						data-auth-mode="login" aria-controls="login-panel">Iniciar
						sesión</button>
					<button class="auth-tab" id="register-tab" type="button" role="tab"
						data-auth-mode="register" aria-controls="register-panel">Crear
						cuenta</button>
				</div>

				<!--
          Contenedor dinámico de mensajes.
          Si Java procesó un error o éxito, se muestra aquí automáticamente.
        -->
				<div class="auth-message" id="auth-message" role="status"
					aria-live="polite" <% if(mensajeFeedback.isEmpty()) { %> hidden
					<% } %> data-type="<%= tipoMensaje %>">
					<%= Web.html(mensajeFeedback) %>
				</div>

				<!-- 1. FORMULARIO DE INICIO DE SESIÓN -->
				<form class="auth-panel" id="login-panel" role="tabpanel"
					aria-labelledby="login-tab" action="auth.jsp" method="POST">
					<!-- Campo oculto para indicar al servidor que esta petición es un login -->
					<input type="hidden" name="accion" value="login">
					<%= Web.csrfInput(session) %>

					<h2 id="auth-title">Bienvenido de vuelta</h2>
					<p>Accede con el correo de tu cuenta.</p>
					<div class="auth-fields">
						<label class="field"><span class="field-label">Correo
								electrónico</span><input class="input" type="email" name="email"
							required autocomplete="email"></label> <label class="field"><span
							class="field-label">Contraseña</span><input class="input"
							type="password" name="password" required
							autocomplete="current-password"></label>
					</div>
					<button class="button" type="submit">Iniciar sesión</button>

				</form>

				<!-- 2. FORMULARIO DE CREACIÓN DE CUENTA (REGISTRO) -->
				<form class="auth-panel" id="register-panel" role="tabpanel"
					aria-labelledby="register-tab" action="auth.jsp" method="POST"
					hidden>
					<!-- Campo oculto para indicar al servidor que esta petición es un registro -->
					<input type="hidden" name="accion" value="register">
					<%= Web.csrfInput(session) %>

					<h2>Crear una cuenta</h2>
					<p>Elige el tipo de cuenta que utilizarás. No podrá cambiarse
						desde el perfil.</p>
					<div class="auth-fields">
						<label class="field"><span class="field-label">Nombre
								visible</span><input class="input" name="displayName" required
							autocomplete="name" maxlength="80"></label> <label class="field"><span
							class="field-label">Tipo de cuenta</span><select class="select"
							name="role" required><option value="actor">Artista</option>
								<option value="producer">Productora o compañía</option></select></label> <label
							class="field"><span class="field-label">Correo
								electrónico</span><input class="input" type="email" name="email"
							required autocomplete="email"></label> <label class="field"><span
							class="field-label">Contraseña</span><input class="input"
							type="password" name="password" required minlength="8"
							autocomplete="new-password"><span class="field-hint">Mínimo
								8 caracteres.</span></label> <label class="field"><span
							class="field-label">Confirmar contraseña</span><input
							class="input" type="password" name="passwordConfirm" required
							minlength="8" autocomplete="new-password"></label>
					</div>
					<button class="button" type="submit">Crear cuenta</button>
				</form>
			</section>
		</div>
	</main>
</body>
</html>
