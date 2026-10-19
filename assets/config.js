/*
 * Conexión pública de StageLink con Supabase.
 *
 * 1. Crea un proyecto en https://supabase.com/dashboard
 * 2. Abre Connect y copia Project URL y Publishable key.
 * 3. Sustituye únicamente los dos valores siguientes.
 *
 * La publishable key se puede usar en el navegador. Nunca pegues aquí una
 * secret key ni la antigua service_role key.
 */
window.STAGELINK_CONFIG = Object.freeze({
  supabaseUrl: "YOUR_SUPABASE_URL",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY"
});
