/* =========================================================
   PanelBusqueda.tsx — PANEL DE BÚSQUEDA
   Se abre con el botón BUSCAR del header, encima de la página.
   Reemplaza a la parte de búsqueda de paneles.js del original.

   Igual que el original:
     - Busca mientras escribes (por nombre del producto).
     - Botones de búsquedas sugeridas.
     - Se cierra con ×, con Escape o haciendo clic afuera.
     - Mientras está abierto, Tab no sale del panel y el fondo
       no se desplaza; al cerrar, el foco vuelve al botón BUSCAR.
     - Si haces clic en un producto, el panel se cierra solo
       (el layout Main lo cierra al cambiar de página).
   ========================================================= */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import ProductCard from './ProductCard'
import { todosLosProductos } from '../data/productos'

const sugerencias = ['Omakase', 'Coco', 'Hoodie']

interface PanelBusquedaProps {
  abierto: boolean // lo decide el layout Main
  onCerrar: () => void // función del layout para cerrarlo
}

function PanelBusqueda({ abierto, onCerrar }: PanelBusquedaProps) {
  /* Texto escrito en el buscador. Como el panel solo se oculta
     (no se borra), el texto se conserva al volver a abrirlo. */
  const [consulta, setConsulta] = useState('')

  /* useRef guarda una referencia a un elemento del HTML, para
     poder hacer cosas como darle el foco (poner el cursor ahí). */
  const refPanel = useRef<HTMLElement>(null)
  const refInput = useRef<HTMLInputElement>(null)

  /* Filtrar por nombre, sin importar mayúsculas (toLowerCase). */
  const texto = consulta.trim().toLowerCase()
  const resultados = todosLosProductos().filter((producto) =>
    producto.nombre.toLowerCase().includes(texto),
  )

  /* useEffect (S9): cuando el panel se abre preparamos todo,
     y la función del return lo deshace cuando se cierra. */
  useEffect(() => {
    if (!abierto) return

    // 1. Recordar qué botón tenía el foco (BUSCAR) y pasarlo al input.
    const focoAnterior = document.activeElement as HTMLElement | null
    refInput.current?.focus()

    // 2. Evitar que la página de fondo se desplace (clase de ajustes.css).
    document.body.classList.add('panel-abierto')

    // Limpieza: al cerrar, quitamos la clase y devolvemos el foco.
    return () => {
      document.body.classList.remove('panel-abierto')
      focoAnterior?.focus()
    }
  }, [abierto])

  /* Teclado dentro del panel: Escape cierra; Tab da vueltas
     solo entre los controles del panel (no se va a la página de atrás). */
  function manejarTecla(evento: KeyboardEvent) {
    if (evento.key === 'Escape') onCerrar()
    if (evento.key === 'Tab' && refPanel.current) {
      const controles = refPanel.current.querySelectorAll<HTMLElement>('button, input, a[href]')
      const primero = controles[0]
      const ultimo = controles[controles.length - 1]
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }
  }

  return (
    /* Capa oscura que cubre la página. Si el clic cae en la capa
       (y no dentro del panel), se cierra. */
    <div
      className="capa-panel modo-busqueda"
      hidden={!abierto}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
    >
      <section
        ref={refPanel}
        className="panel-modal panel-busqueda"
        id="panel-busqueda"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-panel-busqueda"
        onKeyDown={manejarTecla}
      >
        <div className="barra-busqueda">
          <h2 className="solo-lectores" id="titulo-panel-busqueda">
            Buscar productos
          </h2>
          <label className="solo-lectores" htmlFor="consulta-panel">
            Nombre del producto
          </label>
          {/* Input "controlado": cada letra actualiza el estado y la lista. */}
          <input
            ref={refInput}
            id="consulta-panel"
            type="search"
            placeholder="Busca entre productos oficiales y reventa…"
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
          />
          <button type="button" aria-label="Cerrar búsqueda" onClick={onCerrar}>
            ×
          </button>
        </div>

        <div className="contenido-busqueda">
          <section className="resultados-panel">
            <h3>PRODUCTOS</h3>
            <p id="estado-busqueda" role="status">
              {resultados.length} resultados
            </p>
            <div className="grilla-productos" id="resultados-busqueda">
              {resultados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </section>

          <aside className="sugerencias-panel">
            <h3>BÚSQUEDAS SUGERIDAS</h3>
            {sugerencias.map((sugerencia) => (
              <button key={sugerencia} type="button" onClick={() => setConsulta(sugerencia)}>
                {sugerencia}
              </button>
            ))}
          </aside>
        </div>
      </section>
    </div>
  )
}

export default PanelBusqueda
