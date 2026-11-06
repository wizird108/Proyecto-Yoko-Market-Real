/* =========================================================
   ProductCard.tsx — TARJETA DE PRODUCTO
   Reemplaza a crearTarjeta() de productos.js del original.
   Se usa en el inicio, el catálogo y la búsqueda. Mismas
   clases y mismo orden de etiquetas que el original (style.css).
   ========================================================= */

import { Link } from 'react-router'

import BotonFavorito from './BotonFavorito'
import ImagenProducto from './ImagenProducto'
import type { Producto } from '../data/productos'
import { precioTexto } from '../utils/formato'

/* Props: la tarjeta recibe el producto que debe mostrar. */
interface ProductCardProps {
  producto: Producto
}

function ProductCard({ producto }: ProductCardProps) {
  return (
    <article className="tarjeta-producto">
      {/* Toda la tarjeta lleva al detalle: /producto/3 */}
      <Link className="enlace-producto" to={`/producto/${producto.id}`}>
        <ImagenProducto producto={producto} />

        <div className="info-producto">
          {/* && = "si lo de la izquierda es verdadero, muestra lo de la derecha" */}
          {producto.preventa && <span className="etiqueta-producto">PREVENTA</span>}
          {/* operador ternario: condición ? si es verdad : si es falso */}
          <span className="etiqueta-producto">{producto.oficial ? 'OFICIAL' : 'USUARIO'}</span>
          <h3 className="nombre-producto">{producto.nombre}</h3>
          <p className="precio">{precioTexto(producto.precio)}</p>

          {/* Si está en oferta: precio anterior tachado (<del>) y etiqueta SALE */}
          {producto.oferta && producto.precioAnterior !== null && (
            <>
              <del className="precio-anterior">{precioTexto(producto.precioAnterior)}</del>
              <span className="etiqueta-producto">SALE</span>
            </>
          )}
        </div>
      </Link>

      {/* El corazón va fuera del enlace para que al pulsarlo no abra el detalle. */}
      <BotonFavorito productoId={producto.id} />
    </article>
  )
}

export default ProductCard
