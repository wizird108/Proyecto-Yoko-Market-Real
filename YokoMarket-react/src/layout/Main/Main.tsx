/* =========================================================
   Main.tsx — LAYOUT (MOLDE) DE TODAS LAS PÁGINAS
   Todas las páginas comparten la misma estructura:
       Header  →  contenido de la página  →  Footer
   Este componente dibuja el Header y el Footer una sola vez, y en
   medio pone <Outlet />, que es el "hueco" donde React Router
   coloca la página que corresponde a la URL (S10).

   Además reemplaza a main.js del original: decide qué hace cada
   botón del Header y del Footer, abre el panel de búsqueda y
   muestra los mensajes de aviso.
   ========================================================= */

import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PanelBusqueda from '../../components/PanelBusqueda'

/* Lo que el layout comparte con las páginas a través del <Outlet />.
   Una página lo lee con: const { mostrarMensaje } = useOutletContext<ContextoMain>() */
export interface ContextoMain {
  mostrarMensaje: (texto: string) => void
}

/* En el original, sistema.css solo se cargaba en estas páginas.
   Ver el comentario al inicio de src/styles/sistema.css. */
const paginasDeCuenta = ['/login', '/registro', '/perfil', '/publicar']

function Main() {
  const navigate = useNavigate() // sirve para cambiar de página desde código
  const location = useLocation() // dice en qué URL estamos (location.pathname)

  /* ---------- AVISOS ----------
     Texto del aviso de abajo. Vacío ('') = aviso oculto. */
  const [mensaje, setMensaje] = useState('')

  /* useEffect (S9): cada vez que aparece un mensaje, programamos
     que se oculte a los 5 segundos, como en el original.
     El return limpia el temporizador si el componente cambia antes. */
  useEffect(() => {
    if (mensaje === '') return
    const temporizador = setTimeout(() => setMensaje(''), 5000)
    return () => clearTimeout(temporizador)
  }, [mensaje])

  /* ---------- PANEL DE BÚSQUEDA ----------
     Guardamos en qué página se abrió el panel. Si el usuario cambia
     de página (por ejemplo, hace clic en un producto), la ruta ya no
     coincide y el panel se cierra solo.
     La ruta /busqueda abre el panel al entrar (como busqueda.html). */
  const [rutaPanel, setRutaPanel] = useState(location.pathname === '/busqueda' ? '/busqueda' : '')
  const busquedaAbierta = rutaPanel === location.pathname

  function abrirBusqueda() {
    setRutaPanel(location.pathname)
  }

  function cerrarBusqueda() {
    setRutaPanel('')
  }

  /* ---------- BOTONES DEL HEADER Y DEL FOOTER ----------
     Es la misma lista de casos que tenía main.js. */
  function manejarAccion(accion: string) {
    if (accion === 'buscar') {
      abrirBusqueda()
    } else if (accion === 'perfil' || accion === 'wishlist') {
      navigate('/perfil')
    } else if (accion === 'vender') {
      navigate('/publicar')
    } else if (accion === 'ayuda') {
      navigate('/ayuda')
    } else {
      // carrito: el panel de la bolsa es parte de mi compañero.
      setMensaje('Esta sección todavía no forma parte de la entrega.')
    }
  }

  /* ¿Estamos en una página de cuenta? Si sí, el div lleva la clase
     "pagina-cuenta" y se activan los estilos de sistema.css. */
  const esPaginaDeCuenta = paginasDeCuenta.includes(location.pathname)

  /* Lo que compartimos con las páginas (ver ContextoMain arriba). */
  const contexto: ContextoMain = { mostrarMensaje: setMensaje }

  return (
    <div className={esPaginaDeCuenta ? 'pagina-cuenta' : undefined}>
      <Header onAccion={manejarAccion} />

      <main id="contenido">
        {/* context: datos que cualquier página puede leer con useOutletContext */}
        <Outlet context={contexto} />
      </main>

      <Footer onAccion={manejarAccion} />

      {/* Aviso flotante (estilos en .mensaje-interaccion).
          hidden lo oculta cuando no hay mensaje. */}
      <p className="mensaje-interaccion" hidden={mensaje === ''} role="status">
        {mensaje}
      </p>

      <PanelBusqueda abierto={busquedaAbierta} onCerrar={cerrarBusqueda} />

      {/* Al cambiar de página, vuelve arriba (como al abrir un HTML nuevo). */}
      <ScrollRestoration />
    </div>
  )
}

export default Main
