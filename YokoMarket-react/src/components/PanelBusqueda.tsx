/* =========================================================
   PanelBusqueda.tsx — PANEL DE BÚSQUEDA
   Se abre con el botón BUSCAR del header, encima de la página.
   Reemplaza a la parte de búsqueda de paneles.js del original.

   Igual que el original:
     - Busca mientras escribes (por nombre del producto).
     - Botones de búsquedas sugeridas.
     - Cerrar con ×, Escape o clic afuera (lo maneja CapaPanel).
     - Si haces clic en un producto, el panel se cierra solo
       (el layout Main lo cierra al cambiar de página).
   ========================================================= */

import { useState } from 'react'

import CapaPanel from './CapaPanel'
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

  /* Filtrar por nombre, sin importar mayúsculas (toLowerCase). */
  const texto = consulta.trim().toLowerCase()
  const resultados = todosLosProductos().filter((producto) =>
    producto.nombre.toLowerCase().includes(texto),
  )

  return (
    <CapaPanel abierto={abierto} onCerrar={onCerrar} clase="modo-busqueda">
      <section
        className="panel-modal panel-busqueda"
        id="panel-busqueda"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-panel-busqueda"
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
    </CapaPanel>
  )
}

export default PanelBusqueda
