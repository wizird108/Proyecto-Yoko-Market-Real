/* =========================================================
   almacenamiento.ts — LEER DATOS DE localStorage
   Igual que leerDatos() de almacenamiento.js del original (S4).
   localStorage solo guarda texto, así que:
     - JSON.parse convierte ese texto otra vez en arreglos/objetos.
     - try/catch evita que la página falle si el dato está dañado.
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
