// ---- SUPABASE CONFIG ------------------------------------------------------
// Values from Supabase Dashboard → Project Settings → API. The anon key is
// designed to be public: row level security only allows read access, so it
// is safe in client-side code. If these are ever cleared or wrong, the app
// falls back to the bundled seed data in seed.js.
const SUPABASE_URL = "https://jkbdthmuarecvnszifuy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmR0aG11YXJlY3Zuc3ppZnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MjcxMTcsImV4cCI6MjEwMjMwMzExN30.QOEuzdB3gywBMUaLxtNDy0Eh37_I-y-5Fl5K3nRtS6c";
