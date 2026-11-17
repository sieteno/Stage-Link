<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*"%>
<%@ page import="stagelink.Database,stagelink.Passwords,stagelink.Web" %>
<%
    String mensajeFeedback = "";
    String tipoMensaje = "";
    if ("POST".equals(request.getMethod())) {
        String actual = request.getParameter("currentPassword");
        String nueva = request.getParameter("password");
        if (!Passwords.validNewPassword(nueva) || !nueva.equals(request.getParameter("passwordConfirm"))) {
            mensajeFeedback = "Las contraseñas deben coincidir y tener entre 8 y 128 caracteres.";
            tipoMensaje = "error";
        } else {
            try (Connection conn = Database.open(); PreparedStatement query = conn.prepareStatement(
                    "SELECT hash_contrasena FROM usuario WHERE id = ?")) {
                int id = Web.userId(session);
                query.setInt(1, id);
                String guardada;
                try (ResultSet usuario = query.executeQuery()) {
                    guardada = usuario.next() ? usuario.getString("hash_contrasena") : null;
                }
                if (Passwords.matches(actual, guardada)) {
                    try (PreparedStatement update = conn.prepareStatement(
                            "UPDATE usuario SET hash_contrasena = ? WHERE id = ? AND hash_contrasena = ?")) {
                        update.setString(1, Passwords.hash(nueva));
                        update.setInt(2, id);
                        update.setString(3, guardada);
                        if (update.executeUpdate() == 1) {
                            request.changeSessionId();
                            session.removeAttribute("csrf");
                            mensajeFeedback = "Contraseña actualizada.";
                            tipoMensaje = "success";
                        } else {
                            mensajeFeedback = "Vuelve a ingresar tu contraseña actual.";
                            tipoMensaje = "error";
                        }
                    }
                } else {
                    mensajeFeedback = "La contraseña actual no es correcta.";
                    tipoMensaje = "error";
                }
            } catch (Exception error) {
                application.log("No se pudo cambiar la contraseña.", error);
                mensajeFeedback = "No se pudo guardar la contraseña en este momento.";
                tipoMensaje = "error";
            }
        }
    }
%>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description"
	content="Crea una contraseña nueva para StageLink Auditions.">
<title>Nueva contraseña · StageLink Auditions</title>

<!-- Icono vectorial SVG de la plataforma -->
<link rel="icon" type="image/svg+xml"
	href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230a0a0a'/%3E%3Cpath d='M18 18h30v8H27v7h17v8H27v10h-9z' fill='white'/%3E%3C/svg%3E">

<!-- Hoja de estilos principal (ajustada con ruta relativa '../css/styles.css') -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css">

<!-- Script local de autenticación y validaciones visuales -->
<script src="${pageContext.request.contextPath}/javascript/auth.js" defer></script>
</head>
<body data-auth-page="reset">
	<main class="welcome-page">
		<div class="welcome-shell">

			<!-- Sección izquierda: Identidad de marca y mensajes informativos -->
			<section class="welcome-copy">
				<a class="brand" href="index.jsp" aria-label="StageLink Auditions">
					<span class="brand-mark">SL</span> <span>StageLink<small>Auditions</small></span>
				</a>
				<h1>
					Nueva.<br>
					<span>Contraseña.</span>
				</h1>
				<p>Protege tu cuenta con una contraseña que no utilices en otros
					servicios.</p>
			</section>

			<!-- Sección derecha: Panel de restablecimiento de credenciales -->
			<section class="role-entry">

				<!-- Contenedor dinámico de mensajes si Java procesó un error o éxito -->
				<div class="auth-message" id="auth-message" role="status"
					aria-live="polite" <% if(mensajeFeedback.isEmpty()) { %> hidden
					<% } %> data-type="<%= tipoMensaje %>">
					<%= Web.html(mensajeFeedback) %>
				</div>

				<!-- Formulario que envía los datos mediante POST a este mismo archivo JSP -->
				<form class="auth-panel" id="reset-password-form"
					action="reset-password.jsp" method="POST">
					<h2>Crear contraseña nueva</h2>
					<%= Web.csrfInput(session) %>

					<div class="auth-fields">
						<label class="field"><span class="field-label">Contraseña actual</span>
							<input class="input" type="password" name="currentPassword" required autocomplete="current-password"></label>
						<label class="field"> <span class="field-label">Nueva
								contraseña</span> <input class="input" type="password" name="password"
							required minlength="8" autocomplete="new-password">
						</label> <label class="field"> <span class="field-label">Confirmar
								contraseña</span> <input class="input" type="password"
							name="passwordConfirm" required minlength="8"
							autocomplete="new-password">
						</label>
					</div>
					<button class="button" type="submit">Guardar contraseña</button>
				</form>
				<a class="text-button" href="profile.jsp">Volver a mi perfil</a>
			</section>
		</div>
	</main>
</body>
</html>
