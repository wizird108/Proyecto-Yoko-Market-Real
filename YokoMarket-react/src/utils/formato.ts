/* =========================================================
   formato.ts — FORMATO DE PRECIOS
   Igual que precioTexto() de productos.js del original.
   Está en su propio archivo porque lo usan varias partes:
   tarjetas, detalle de producto y carrito.
   ========================================================= */

/* Convierte 45000 en "COP $45.000".
   toLocaleString('es-CO') pone los puntos de miles al estilo colombiano. */
export function precioTexto(precio: number) {
  return 'COP $' + precio.toLocaleString('es-CO')
}
