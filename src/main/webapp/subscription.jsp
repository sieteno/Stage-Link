<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="stagelink.Web" %>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Suscripción · StageLink</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/producer.css">
  <script src="javascript/app.js" defer></script>
  <script src="javascript/producer-data.js" defer></script>
  <script src="javascript/subscription.js" defer></script>
</head>
<body data-page="subscription" <%= Web.shellAttributes(session) %>>
  <a class="skip-link" href="#main-content">Saltar al contenido</a>
  <div class="app-frame">
    <aside class="sidebar" id="sidebar"></aside>
    <div class="main-column">
      <header class="topbar" id="topbar"></header>
      <main class="content" id="main-content">
        <div class="page-heading">
          <div>
            <h1>Suscripción de Productora</h1>
            <p>Elige un plan y activa una suscripción de prueba.</p>
          </div>
        </div>
        <section class="card panel" id="subscription-role-guard" hidden>
          <p>La suscripción está disponible para cuentas de Productora.</p>
          <a class="button secondary" href="feed.jsp">Ver convocatorias</a>
        </section>
        <section class="card panel" id="subscription-active" hidden>
          <h2>Suscripción activa</h2>
          <p id="active-summary"></p>
          <a class="button" href="create-audition.jsp">Crear convocatoria</a>
        </section>
        <section id="subscription-flow" hidden>
          <ol class="stepper" aria-label="Progreso de suscripción">
            <li class="step"><span class="step-number">1</span> Plan</li>
            <li class="step"><span class="step-number">2</span> Confirmación</li>
            <li class="step"><span class="step-number">3</span> Recibo</li>
          </ol>
          <div class="form-step">
            <h2>Elige tu plan</h2>
            <div class="plan-grid" id="plan-grid"></div>
          </div>
          <div class="form-step" hidden>
            <section class="card panel">
              <h2>Confirma tu plan de prueba</h2>
              <dl>
                <dt>Plan</dt><dd id="summary-plan"></dd>
                <dt>Duración</dt><dd id="summary-period"></dd>
                <dt>Precio de referencia</dt><dd id="summary-price"></dd>
                <dt>Importe simulado</dt><dd id="summary-total"></dd>
              </dl>
              <p>El pago es simulado. Se usará una tarjeta de prueba.</p>
              <form id="payment-form" novalidate>
                <input id="card-name" type="hidden" value="StageLink Demo">
                <input id="card-number" type="hidden" value="4242 4242 4242 4242">
                <input id="card-expiry" type="hidden" value="12/99">
                <input id="card-cvc" type="hidden" value="123">
                <input id="card-email" type="hidden" value="demo@example.test">
                <div class="auth-message" id="pay-error" role="alert" data-type="error" hidden></div>
                <div class="form-actions">
                  <button type="button" class="button secondary" data-prev-step>Volver a los planes</button>
                  <button type="submit" class="button" id="pay-submit">Activar suscripción de prueba</button>
                </div>
              </form>
            </section>
          </div>
          <div class="form-step" hidden>
            <section class="card panel" id="pay-processing" role="status">
              <h2>Activando suscripción</h2>
              <p>Espera un momento.</p>
            </section>
            <section class="card panel" id="pay-success" hidden>
              <h2>Suscripción de prueba activa</h2>
              <dl>
                <dt>Plan</dt><dd id="receipt-plan"></dd>
                <dt>Importe simulado</dt><dd id="receipt-amount"></dd>
                <dt>Tarjeta de prueba</dt><dd id="receipt-card"></dd>
                <dt>Referencia</dt><dd id="receipt-ref"></dd>
                <dt>Renovación</dt><dd id="receipt-renews"></dd>
              </dl>
              <a class="button" href="create-audition.jsp">Crear convocatoria</a>
            </section>
          </div>
        </section>
      </main>
      <nav class="mobile-nav" id="mobile-nav"></nav>
    </div>
  </div>
</body>
</html>
