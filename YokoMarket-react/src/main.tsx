/* =========================================================
   main.tsx — PUNTO DE ENTRADA DE LA APLICACIÓN
   Es el primer archivo que se ejecuta (lo llama index.html).
   Hace dos cosas:
     1. Carga los estilos de toda la página.
     2. Dibuja el router dentro del <div id="root">.
   ========================================================= */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

/* 1. ESTILOS
   Son los mismos archivos CSS del proyecto original y van en el
   mismo orden en que el HTML original los cargaba con <link>.
   El orden importa: si dos reglas pesan igual, gana la última. */
import './styles/style.css' // base: fuentes, header, tarjetas, home, catálogo...
import './styles/sistema.css' // formularios y páginas de cuenta
import './styles/ajustes.css' // correcciones finales: siempre de último

import router from './router/Router.tsx'

/* 2. DIBUJAR LA APP
   createRoot conecta React con el <div id="root"> de index.html.
   RouterProvider recibe la lista de rutas (Router.tsx) y muestra
   la página que corresponde a la URL actual (S10).
   StrictMode no cambia nada en pantalla: solo avisa en la consola
   si encuentra errores comunes mientras desarrollamos. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
