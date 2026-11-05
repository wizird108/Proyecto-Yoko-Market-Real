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
import Pendiente from '../pages/pendiente/Pendiente'

const router = createBrowserRouter([
  {
    // Ruta padre: el layout Main (Header + Outlet + Footer).
    path: '/',
    Component: Main,

    // Rutas hijas: se dibujan dentro del <Outlet /> de Main.
    // Por ahora todas muestran la página temporal "Pendiente".
    children: [
      { index: true, element: <Pendiente nombre="Inicio" /> }, // index = la URL "/"

      // Catálogo (commit 4)
      { path: 'ropa', element: <Pendiente nombre="Ropa" /> },
      { path: 'peluches', element: <Pendiente nombre="Peluches" /> },
      { path: 'vinilos', element: <Pendiente nombre="Vinilos" /> },
      { path: 'accesorios', element: <Pendiente nombre="Accesorios" /> },
      { path: 'sale', element: <Pendiente nombre="Sale" /> },
      { path: 'busqueda', element: <Pendiente nombre="Búsqueda" /> },

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
