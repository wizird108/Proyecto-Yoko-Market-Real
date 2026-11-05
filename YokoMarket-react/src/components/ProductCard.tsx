/* =========================================================
   ProductCard.tsx — TARJETA DE PRODUCTO
   Reemplaza a crearTarjeta() de productos.js y al botón de
   favorito de interacciones.js. Se usa en el inicio, el
   catálogo y la búsqueda. Mismas clases y mismo orden de
   etiquetas que el original (style.css).
   ========================================================= */

import { useState } from 'react'
import { Link } from 'react-router'

import type { Producto } from '../data/productos'
import { precioTexto } from '../utils/formato'
import fotoPendiente from '../assets/images/foto-pendiente.svg'

/* Props: la tarjeta recibe el producto que debe mostrar. */
interface ProductCardProps {
  producto: Producto
}

function ProductCard({ producto }: ProductCardProps) {
  /* ¿Está en favoritos? Por ahora el corazón solo recuerda su estado
     mientras la página está abierta. Guardarlo en localStorage y
     compartirlo entre tarjetas es parte de mi compañero (favoritos). */
  const [favorito, setFavorito] = useState(false)

  /* Si la foto no carga, mostramos la imagen "pendiente". */
  const [imagenFallida, setImagenFallida] = useState(false)
  const imagen = producto.imagen && !imagenFallida ? producto.imagen : fotoPendiente

  return (
    <article className="tarjeta-producto">
      {/* Toda la tarjeta lleva al detalle: /producto/3 */}
      <Link className="enlace-producto" to={`/producto/${producto.id}`}>
        <img
          className="imagen-producto"
          src={imagen}
          alt={producto.nombre}
          width={300}
          height={300}
          onError={() => setImagenFallida(true)}
        />

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

      {/* Botón de favorito: ♡ vacío / ♥ lleno. El CSS lo pinta de rojo
          cuando aria-pressed es "true". */}
      <button
        className="boton-favorito"
        type="button"
        aria-pressed={favorito}
        aria-label={favorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        onClick={() => setFavorito(!favorito)}
      >
        {favorito ? '♥' : '♡'}
      </button>
    </article>
  )
}

export default ProductCard
