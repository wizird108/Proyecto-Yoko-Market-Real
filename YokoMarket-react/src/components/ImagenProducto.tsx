/* =========================================================
   ImagenProducto.tsx — FOTO DE UN PRODUCTO
   Igual que imagenProducto() de productos.js del original.
   Se usa en las tarjetas, el banner de peluches y, más
   adelante, en el detalle y el carrito.
   Si el producto no tiene foto, o la foto no carga, muestra
   la imagen "Imagen pendiente".
   ========================================================= */

import { useState } from 'react'

import type { Producto } from '../data/productos'
import fotoPendiente from '../assets/images/foto-pendiente.svg'

interface ImagenProductoProps {
  producto: Producto
}

function ImagenProducto({ producto }: ImagenProductoProps) {
  /* true cuando el navegador no pudo cargar la foto. */
  const [fallo, setFallo] = useState(false)

  /* Usamos la foto del producto solo si existe y no ha fallado. */
  const imagen = producto.imagen && !fallo ? producto.imagen : fotoPendiente

  return (
    <img
      className="imagen-producto"
      src={imagen}
      alt={producto.nombre}
      width={300}
      height={300}
      onError={() => setFallo(true)}
    />
  )
}

export default ImagenProducto
