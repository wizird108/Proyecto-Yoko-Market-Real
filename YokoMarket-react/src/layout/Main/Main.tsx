/* =========================================================
   Main.tsx — LAYOUT (MOLDE) DE TODAS LAS PÁGINAS
   Todas las páginas comparten la misma estructura:
       Header  →  contenido de la página  →  Footer
   Este componente dibuja el Header y el Footer una sola vez, y en
   medio pone <Outlet />, que es el "hueco" donde React Router
   coloca la página que corresponde a la URL (S10).

   Además reemplaza a main.js del original: decide qué hace cada
   botón del Header y del Footer, abre los paneles de búsqueda y
   de la bolsa, y muestra los mensajes de aviso.

   También envuelve todo con los contextos de favoritos y carrito
   (estado global), así cualquier página o panel puede usarlos.
   ========================================================= */

import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PanelBusqueda from '../../components/PanelBusqueda'
import PanelCarrito from '../../components/PanelCarrito'
import { CarritoProvider } from '../../context/CarritoContext'
import { FavoritosProvider } from '../../context/FavoritosContext'

/* Lo que el layout comparte con las páginas a través del <Outlet />.
   Una página lo lee con: const { mostrarMensaje } = useOutletContext<ContextoMain>() */
export interface ContextoMain {
  mostrarMensaje: (texto: string) => void
  abrirBolsa: () => void
}

/* En el original, sistema.css solo se cargaba en estas páginas.
   Ver el comentario al inicio de src/styles/sistema.css. */
const paginasDeCuenta = ['/login', '/registro', '/perfil', '/publicar']

/* Qué panel está abierto y en qué página se abrió. */
type Panel = { tipo: 'buscar' | 'carrito'; ruta: string } | null

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

  /* ---------- PANELES (búsqueda y bolsa) ----------
     Guardamos qué panel se abrió y en qué página. Si el usuario cambia
     de página (por ejemplo, hace clic en un producto), la ruta ya no
     coincide y el panel se cierra solo.
     Las rutas /busqueda y /carrito abren su panel al entrar, como
     busqueda.html y carrito.html del original. */
  const [panel, setPanel] = useState<Panel>(() => {
    if (location.pathname === '/busqueda') return { tipo: 'buscar', ruta: '/busqueda' }
    if (location.pathname === '/carrito') return { tipo: 'carrito', ruta: '/carrito' }
    return null
  })
  const panelAbierto = panel !== null && panel.ruta === location.pathname ? panel.tipo : null

  function abrirPanel(tipo: 'buscar' | 'carrito') {
    setPanel({ tipo, ruta: location.pathname })
  }

  function cerrarPanel() {
    setPanel(null)
  }

  /* ---------- BOTONES DEL HEADER Y DEL FOOTER ----------
     Es la misma lista de casos que tenía main.js. */
  function manejarAccion(accion: string) {
    if (accion === 'buscar' || accion === 'carrito') {
      abrirPanel(accion)
    } else if (accion === 'perfil' || accion === 'wishlist') {
      navigate('/perfil') // si no hay sesión, RutaProtegida lleva al login
    } else if (accion === 'vender') {
      navigate('/publicar')
    } else if (accion === 'ayuda') {
      navigate('/ayuda')
    }
  }

  /* ¿Estamos en una página de cuenta? Si sí, el div lleva la clase
     "pagina-cuenta" y se activan los estilos de sistema.css. */
  const esPaginaDeCuenta = paginasDeCuenta.includes(location.pathname)

  /* Lo que compartimos con las páginas (ver ContextoMain arriba). */
  const contexto: ContextoMain = {
    mostrarMensaje: setMensaje,
    abrirBolsa: () => abrirPanel('carrito'),
  }

  return (
    <FavoritosProvider>
      <CarritoProvider>
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

          <PanelBusqueda abierto={panelAbierto === 'buscar'} onCerrar={cerrarPanel} />
          <PanelCarrito abierto={panelAbierto === 'carrito'} onCerrar={cerrarPanel} />

          {/* Al cambiar de página, vuelve arriba (como al abrir un HTML nuevo). */}
          <ScrollRestoration />
        </div>
      </CarritoProvider>
    </FavoritosProvider>
  )
}

export default Main
