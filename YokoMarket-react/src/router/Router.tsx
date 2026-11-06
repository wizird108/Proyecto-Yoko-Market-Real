/* =========================================================
   Router.tsx — LISTA DE RUTAS (URL → página)
   Mismo formato que S10 del curso: createBrowserRouter con un
   arreglo de objetos. Cada objeto dice: "si la URL es esta,
   muestra este componente".

   En el original cada página era un HTML distinto
   (ropa.html, producto.html?id=3...). Aquí hay un solo
   index.html y React Router cambia el contenido según la URL.

   Estructura (rutas anidadas, cada padre usa <Outlet />):
     Auth  → da la sesión (useAuth) a todo lo de adentro
       Main  → header + página + footer, favoritos y bolsa
         Home, Catálogos, Producto, Login, Perfil...
   ========================================================= */

import { createBrowserRouter, Navigate } from 'react-router'

import Auth from '../layout/Auth/Auth'
import Main from '../layout/Main/Main'
import RutaProtegida from '../components/RutaProtegida'
import Home from '../pages/home/Home'
import Catalogo from '../pages/catalogo/Catalogo'
import Ayuda from '../pages/ayuda/Ayuda'
import Producto from '../pages/producto/Producto'
import Login from '../pages/login/Login'
import Registro from '../pages/registro/Registro'
import Perfil from '../pages/perfil/Perfil'
import Publicar from '../pages/publicar/Publicar'

const router = createBrowserRouter([
  {
    // Ruta padre: el layout Auth (sesión), igual que en el ejemplo de S10.
    path: '/',
    Component: Auth,
    children: [
      {
        // Layout Main (Header + Outlet + Footer). No tiene path propio:
        // solo envuelve a las páginas de abajo.
        Component: Main,
        children: [
          { index: true, Component: Home }, // index = la URL "/"

          // Catálogos: la misma página con distinta categoría.
          // "key" hace que React cree la página de nuevo al cambiar de
          // categoría; así los filtros vuelven a empezar (como al abrir
          // otro HTML en el original).
          { path: 'ropa', element: <Catalogo key="ropa" categoria="ropa" /> },
          { path: 'peluches', element: <Catalogo key="peluches" categoria="peluches" /> },
          { path: 'vinilos', element: <Catalogo key="vinilos" categoria="vinilos" /> },
          { path: 'accesorios', element: <Catalogo key="accesorios" categoria="accesorios" /> },
          { path: 'sale', element: <Catalogo key="sale" categoria="sale" /> },

          // catalogo.html del original, sin categoría, mostraba peluches.
          { path: 'catalogo', element: <Navigate to="/peluches" replace /> },

          // busqueda.html y carrito.html del original eran el inicio con el
          // panel abierto. Aquí también: el layout Main abre el panel.
          { path: 'busqueda', Component: Home },
          { path: 'carrito', Component: Home },

          // Ayuda (página nueva: en el original el botón solo mostraba un aviso)
          { path: 'ayuda', Component: Ayuda },

          // Detalle. ":id" es un parámetro: /producto/3 → id = "3"
          { path: 'producto/:id', Component: Producto },

          // Cuentas
          { path: 'login', Component: Login },
          { path: 'registro', Component: Registro },

          // Páginas que piden sesión: sin sesión, RutaProtegida lleva al login.
          {
            path: 'perfil',
            element: (
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            ),
          },
          {
            path: 'publicar',
            element: (
              <RutaProtegida>
                <Publicar />
              </RutaProtegida>
            ),
          },

          // Cualquier otra URL que no exista vuelve al inicio.
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
])

export default router
