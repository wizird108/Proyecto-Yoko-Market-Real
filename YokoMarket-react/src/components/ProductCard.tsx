import { useState } from 'react'

/* TARJETA DE PRODUCTO DE YOKOMARKET
   Migrada de crearTarjeta() en productos.js + crearBotonFavorito() en
   interacciones.js + estilos de style.css y ajustes.css.
   Mismas clases, mismo orden de etiquetas y mismo formato de precio. */

/* Forma de un producto, igual que los objetos de datos.js. */
export interface Producto {
  id: number | string
  nombre: string
  precio: number
  imagen?: string
  oficial?: boolean
  preventa?: boolean
  oferta?: boolean
  precioAnterior?: number
}

interface ProductCardProps {
  producto: Producto
  /* Opcional: enlace al detalle. Por defecto replica producto.html?id=... */
  href?: string
}

/* Equivale a precioTexto(): "COP $45.000" */
function precioTexto(precio: number) {
  return 'COP $' + Number(precio).toLocaleString('es-CO')
}

/* Equivale a foto-pendiente.svg: cuadro gris cuando no hay foto o falla. */
const FOTO_PENDIENTE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#eee8df"/></svg>',
  )

function ProductCard({ producto, href }: ProductCardProps) {
  /* Reemplaza el localStorage "yoko-favoritos" del original por estado local.
     Más adelante se puede subir a un contexto compartido. */
  const [favorito, setFavorito] = useState(false)
  const [imagenFallida, setImagenFallida] = useState(false)

  const origen = !imagenFallida && producto.imagen ? producto.imagen : FOTO_PENDIENTE

  return (
    <article className="tarjeta-producto">
      <a className="enlace-producto" href={href ?? `/producto?id=${producto.id}`}>
        <img
          className="imagen-producto"
          src={origen}
          alt={producto.nombre}
          width={300}
          height={300}
          onError={() => setImagenFallida(true)}
        />
        <div className="info-producto">
          {producto.preventa && <span className="etiqueta-producto">PREVENTA</span>}
          <span className="etiqueta-producto">{producto.oficial ? 'OFICIAL' : 'USUARIO'}</span>
          <h3 className="nombre-producto">{producto.nombre}</h3>
          <p className="precio">{precioTexto(producto.precio)}</p>
          {producto.oferta && (
            <>
              {producto.precioAnterior !== undefined && (
                <del className="precio-anterior">{precioTexto(producto.precioAnterior)}</del>
              )}
              <span className="etiqueta-producto">SALE</span>
            </>
          )}
        </div>
      </a>

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
