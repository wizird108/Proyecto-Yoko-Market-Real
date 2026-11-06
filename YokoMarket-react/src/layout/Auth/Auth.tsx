/* =========================================================
   Auth.tsx — SESIÓN DEL USUARIO (estado global, S10)
   Mismo formato que el ejemplo "Autenticación con React Router"
   del curso:
     1. AuthContext: el "lugar" donde vive la sesión.
     2. AuthProvider: guarda la sesión y las funciones login,
        register y logout, y se las da a todos sus hijos.
     3. useAuth(): hook para leer la sesión desde cualquier página.
     4. Auth (layout): envuelve todas las rutas con el Provider.

   Reemplaza a login.js, registro.js y a usuarioActual() /
   pedirSesion() de almacenamiento.js del original.
   ========================================================= */

import { createContext, useContext, useState, type ReactNode } from 'react'
import { Outlet } from 'react-router'

import { usuariosDemo, type Cuenta, type Sesion } from '../../data/usuarios'
import { guardarDatos, leerDatos } from '../../utils/almacenamiento'

/* Lo que comparte el contexto (los nombres siguen el ejemplo del curso). */
type AuthContextType = {
  user: Sesion | null // null = nadie ha iniciado sesión
  isAuthenticated: boolean
  login: (correo: string, contrasena: string) => boolean
  register: (nombre: string, correo: string, contrasena: string) => string
  logout: () => void
}

/* 1. El contexto empieza "vacío"; el Provider le pone el valor real. */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* 2. PROVIDER */
function AuthProvider({ children }: { children: ReactNode }) {
  /* La sesión se lee de localStorage al iniciar. Usamos una función
     dentro de useState para leerla solo la primera vez. (El ejemplo del
     curso lo hace con useEffect + isLoading; así es más corto y la
     sesión está lista desde el primer dibujo, sin pantalla de "Loading"). */
  const [user, setUser] = useState<Sesion | null>(() => leerDatos<Sesion | null>('yoko-sesion', null))

  /* Todas las cuentas: la de prueba + las creadas en Registro. */
  function todasLasCuentas(): Cuenta[] {
    return [...usuariosDemo, ...leerDatos<Cuenta[]>('yoko-cuentas', [])]
  }

  /* LOGIN: busca una cuenta con ese correo y contraseña.
     Devuelve true si la encontró (y guarda la sesión) o false si no. */
  function login(correo: string, contrasena: string): boolean {
    const cuenta = todasLasCuentas().find(
      (c) => c.correo === correo.trim().toLowerCase() && c.contrasena === contrasena,
    )
    if (!cuenta) return false

    // La sesión guarda id, nombre y correo; nunca la contraseña.
    const sesion: Sesion = { id: cuenta.id, nombre: cuenta.nombre, correo: cuenta.correo }
    setUser(sesion)
    guardarDatos('yoko-sesion', sesion)
    return true
  }

  /* REGISTER: crea una cuenta nueva en "yoko-cuentas".
     Devuelve '' si todo salió bien, o el texto del error. */
  function register(nombre: string, correo: string, contrasena: string): string {
    const correoLimpio = correo.trim().toLowerCase()
    if (todasLasCuentas().some((c) => c.correo === correoLimpio)) {
      return 'Ya existe una cuenta con este correo.'
    }
    const cuentas = leerDatos<Cuenta[]>('yoko-cuentas', [])
    cuentas.push({ id: 'cuenta-' + Date.now(), nombre: nombre.trim(), correo: correoLimpio, contrasena })
    if (!guardarDatos('yoko-cuentas', cuentas)) {
      return 'No fue posible guardar la cuenta en este navegador.'
    }
    return ''
  }

  /* LOGOUT: borra solo la sesión; las publicaciones se conservan. */
  function logout() {
    setUser(null)
    localStorage.removeItem('yoko-sesion')
  }

  const isAuthenticated = user !== null

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/* 3. HOOK: cualquier componente lo usa así: const { user } = useAuth()
   (La línea eslint-disable es porque este archivo exporta un componente
   y un hook juntos, igual que el ejemplo del curso; solo afecta la
   recarga rápida mientras programamos, no a la página.) */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

/* 4. LAYOUT: el router lo pone como ruta padre de todo (Router.tsx),
   así todas las páginas quedan dentro del AuthProvider. */
export default function Auth() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
