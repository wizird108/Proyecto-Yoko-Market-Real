/* =========================================================
   Router.tsx — LISTA DE RUTAS (URL → página)
   Mismo formato que S10 del curso: createBrowserRouter con un
   arreglo de objetos. Cada objeto dice: "si la URL es esta,
   muestra este componente".

   En el original cada página era un HTML distinto
   (ropa.html, producto.html?id=3...). Aquí hay un solo
   index.html y React Router cambia el contenido según la URL.
   ========================================================= */

import { createBrowserRouter, Navigate } from 'react-router'

import Main from '../layout/Main/Main'
import Home from '../pages/home/Home'
import Catalogo from '../pages/catalogo/Catalogo'
import Ayuda from '../pages/ayuda/Ayuda'
import Pendiente from '../pages/pendiente/Pendiente'

const router = createBrowserRouter([
  {
    // Ruta padre: el layout Main (Header + Outlet + Footer).
    path: '/',
    Component: Main,

    // Rutas hijas: se dibujan dentro del <Outlet /> de Main.
    // Las que todavía no están hechas muestran la página temporal "Pendiente".
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

      // busqueda.html del original era el inicio con el panel de búsqueda
      // abierto. Aquí también: el layout Main abre el panel en esta ruta.
      { path: 'busqueda', Component: Home },

      // Ayuda (página nueva: en el original el botón solo mostraba un aviso)
      { path: 'ayuda', Component: Ayuda },

      // Detalle (commit 5). ":id" es un parámetro: /producto/3 → id = "3"
      { path: 'producto/:id', element: <Pendiente nombre="Producto" /> },

      // Cuentas e interacciones (parte de mi compañero)
      { path: 'login', element: <Pendiente nombre="Login" /> },
      { path: 'registro', element: <Pendiente nombre="Registro" /> },
      { path: 'perfil', element: <Pendiente nombre="Perfil" /> },
      { path: 'publicar', element: <Pendiente nombre="Publicar" /> },
      { path: 'carrito', element: <Pendiente nombre="Carrito" /> },

      // Cualquier otra URL que no exista vuelve al inicio.
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default router
