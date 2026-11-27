// La clave pública puede ir en el frontend. Las políticas SQL protegen cada fila.
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configurado = Boolean(url && key);
export const supabase = configurado ? createClient(url, key) : null;

// Axios consulta las tablas REST; Supabase administra sesión, archivos y Realtime.
export const api = axios.create({
  baseURL: url ? `${url}/rest/v1` : undefined,
  timeout: 15000,
  headers: { apikey: key || "" },
});
api.interceptors.request.use(async (config) => {
  const session = await supabase?.auth.getSession();
  const token = session?.data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function exigirConexion() {
  if (!supabase) throw new Error("Connect Supabase using the .env file first.");
  return supabase;
}
