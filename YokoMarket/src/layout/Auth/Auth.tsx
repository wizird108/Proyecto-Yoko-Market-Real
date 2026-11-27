// Supabase verifica las credenciales. Nunca guardamos contraseñas en nuestras tablas.
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Outlet } from "react-router";
import type { User } from "@supabase/supabase-js";
import type { Sesion } from "../../data/usuarios";
import { api, exigirConexion, supabase } from "../../services/supabase";

type AuthContextType = {
  user: Sesion | null;
  cargando: boolean;
  isAuthenticated: boolean;
  login: (correo: string, contrasena: string) => Promise<string>;
  register: (
    nombre: string,
    correo: string,
    contrasena: string,
  ) => Promise<string>;
  logout: () => Promise<void>;
  editarPerfil: (nombre: string, bio: string) => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(Boolean(supabase));
  useEffect(() => {
    if (!supabase) {
      return;
    }
    let activo = true;
    let revision = 0;
    async function actualizar(usuario: User | null) {
      const actual = ++revision;
      if (!usuario) {
        if (activo) {
          setUser(null);
          setCargando(false);
        }
        return;
      }
      let perfil = {
        nombre: String(usuario.user_metadata.nombre || "Fan"),
        bio: "",
      };
      try {
        const { data } = await api.get<{ nombre: string; bio: string }[]>(
          `/perfiles?id=eq.${usuario.id}&select=nombre,bio`,
        );
        if (data[0]) perfil = data[0];
      } catch {
        /* La sesión sigue siendo válida si falla temporalmente el perfil. */
      }
      if (activo && actual === revision) {
        setUser({ id: usuario.id, correo: usuario.email || "", ...perfil });
        setCargando(false);
      }
    }
    void supabase.auth
      .getSession()
      .then(({ data }) => actualizar(data.session?.user || null))
      .catch(() => {
        if (activo) setCargando(false);
      });
    // El callback no espera llamadas al mismo cliente Auth (evita bloquearlo).
    const { data } = supabase.auth.onAuthStateChange((_evento, session) => {
      setTimeout(() => {
        if (activo) void actualizar(session?.user || null);
      }, 0);
    });
    return () => {
      activo = false;
      data.subscription.unsubscribe();
    };
  }, []);
  async function login(correo: string, contrasena: string) {
    try {
      const { data, error } = await exigirConexion().auth.signInWithPassword({
        email: correo.trim(),
        password: contrasena,
      });
      if (data.user)
        setUser({
          id: data.user.id,
          correo: data.user.email || "",
          nombre: String(data.user.user_metadata.nombre || "Fan"),
        });
      return error ? error.message : "";
    } catch (error) {
      return error instanceof Error ? error.message : "Unable to sign in.";
    }
  }
  async function register(nombre: string, correo: string, contrasena: string) {
    try {
      const { error } = await exigirConexion().auth.signUp({
        email: correo.trim(),
        password: contrasena,
        options: {
          data: { nombre: nombre.trim() },
          emailRedirectTo: window.location.origin + "/perfil",
        },
      });
      return error ? error.message : "";
    } catch (error) {
      return error instanceof Error ? error.message : "Unable to register.";
    }
  }
  async function logout() {
    const { error } = await exigirConexion().auth.signOut();
    if (error) throw error;
    setUser(null);
  }
  async function editarPerfil(nombre: string, bio: string) {
    if (!user || !nombre.trim()) throw new Error("Enter your name.");
    await api.patch(`/perfiles?id=eq.${user.id}`, {
      nombre: nombre.trim(),
      bio: bio.trim(),
    });
    setUser({ ...user, nombre: nombre.trim(), bio: bio.trim() });
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        cargando,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        editarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const valor = useContext(AuthContext);
  if (!valor) throw new Error("useAuth requires AuthProvider");
  return valor;
}
export default function Auth() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
