/* =========================================================
   RutaProtegida.tsx — PÁGINAS QUE PIDEN SESIÓN
   Igual que pedirSesion() del original y que la página
   protegida del ejemplo de S10: si no hay sesión, manda al
   login; si la hay, muestra la página.

   Uso en Router.tsx:
     element: <RutaProtegida><Perfil /></RutaProtegida>
   ========================================================= */

import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { useAuth } from '../layout/Auth/Auth'

function RutaProtegida({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  /* <Navigate> cambia de página apenas se dibuja.
     replace: el login reemplaza esta página en el historial, así el
     botón "atrás" no vuelve a una página que no se puede ver. */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaProtegida
