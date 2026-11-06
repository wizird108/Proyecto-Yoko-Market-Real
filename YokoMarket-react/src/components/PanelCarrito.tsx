/* =========================================================
   PanelCarrito.tsx — BOLSA DE COMPRAS
   Se abre con el botón CARRITO del header y al añadir un
   producto desde su detalle. Aparece a la derecha, encima de
   la página. Reemplaza a actualizarPanelCarrito() de paneles.js.

   Lee y cambia la bolsa del contexto global (CarritoContext).
   ========================================================= */

import CapaPanel from './CapaPanel'
import ImagenProducto from './ImagenProducto'
import { useCarrito } from '../context/CarritoContext'
import { buscarProducto } from '../data/productos'
import { precioTexto } from '../utils/formato'
import carritoVacio from '../assets/images/carrito-vacio.jpg'

interface PanelCarritoProps {
  abierto: boolean
  onCerrar: () => void
}

function PanelCarrito({ abierto, onCerrar }: PanelCarritoProps) {
  const { items, sumar, restar, eliminar } = useCarrito()

  /* Cada fila de la bolsa solo tiene el id: buscamos el producto
     completo para mostrar su foto, nombre y precio. */
  const filas = items.map((item) => ({ item, producto: buscarProducto(item.id) }))

  /* Total = suma de (precio × cantidad) de cada fila. */
  const total = filas.reduce((suma, fila) => suma + (fila.producto ? fila.producto.precio * fila.item.cantidad : 0), 0)

  return (
    <CapaPanel abierto={abierto} onCerrar={onCerrar}>
      <aside
        className="panel-modal panel-bolsa"
        id="panel-bolsa"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-panel-bolsa"
      >
        <div className="cabecera-bolsa">
          <h2 id="titulo-panel-bolsa">BOLSA DE COMPRAS</h2>
          <button type="button" aria-label="Cerrar carrito" onClick={onCerrar}>
            ×
          </button>
        </div>

        <div id="items-panel-carrito">
          {filas.map(
            ({ item, producto }, indice) =>
              producto && (
                <article key={String(item.id) + item.talla} className="fila-bolsa">
                  <ImagenProducto producto={producto} />
                  <div className="datos-bolsa">
                    <h3>{producto.nombre}</h3>
                    <p>{item.talla ? 'Talla: ' + item.talla : 'Sin talla'}</p>
                    <p className="precio">{precioTexto(producto.precio * item.cantidad)}</p>
                    {/* Botones − cantidad + Eliminar */}
                    <div className="controles-bolsa">
                      <button type="button" aria-label={'− ' + producto.nombre} onClick={() => restar(indice)}>
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button type="button" aria-label={'+ ' + producto.nombre} onClick={() => sumar(indice)}>
                        +
                      </button>
                      <button
                        type="button"
                        aria-label={'Eliminar ' + producto.nombre}
                        onClick={() => eliminar(indice)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ),
          )}

          {/* Bolsa vacía: imagen y mensaje, igual que el original. */}
          {items.length === 0 && (
            <div className="bolsa-vacia">
              <img src={carritoVacio} alt="" />
              <p>Tu bolsa de compras está vacía</p>
            </div>
          )}
        </div>

        <div className="total-panel" id="resumen-panel-carrito">
          {items.length > 0 && <p>TOTAL: {precioTexto(total)}</p>}
        </div>
      </aside>
    </CapaPanel>
  )
}

export default PanelCarrito
