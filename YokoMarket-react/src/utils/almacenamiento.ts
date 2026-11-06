/* =========================================================
   almacenamiento.ts — LEER Y GUARDAR DATOS EN localStorage
   Igual que almacenamiento.js del original (S4).
   localStorage solo guarda texto, así que:
     - JSON.stringify convierte arreglos/objetos en texto (guardar).
     - JSON.parse convierte ese texto otra vez en arreglos/objetos (leer).
     - try/catch evita que la página falle si algo sale mal.

   Claves que usa el proyecto (las mismas del original):
     yoko-sesion         → usuario con sesión iniciada
     yoko-cuentas        → cuentas creadas en Registro
     yoko-publicaciones  → productos publicados por usuarios
     yoko-favoritos      → ids de los productos con corazón
     yoko-carrito        → filas de la bolsa { id, talla, cantidad }
   ========================================================= */

/* <T> es un "genérico" de TypeScript (S6): significa "el tipo que
   devuelva depende de lo que guardé". Ej.: leerDatos<string[]>(...)
   Si la clave no existe o falla, devolvemos el valor inicial. */
export function leerDatos<T>(clave: string, inicial: T): T {
  try {
    const texto = localStorage.getItem(clave)
    if (texto === null) {
      return inicial
    }
    return JSON.parse(texto)
  } catch {
    return inicial
  }
}

/* Devuelve true si se pudo guardar y false si falló (por ejemplo,
   si las fotos de una publicación llenaron el espacio disponible).
   Así no anunciamos "guardado" cuando no lo está. */
export function guardarDatos(clave: string, datos: unknown): boolean {
  try {
    localStorage.setItem(clave, JSON.stringify(datos))
    return true
  } catch {
    return false
  }
}
