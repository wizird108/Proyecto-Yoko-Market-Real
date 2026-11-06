/* =========================================================
   resenas.ts — RESEÑAS QUE ESCRIBEN LOS USUARIOS
   Se guardan en localStorage, clave "yoko-resenas", separadas
   por producto. Es un objeto cuyas claves son los ids:

     {
       "1":     [ { autor: "@ana", estrellas: "★★★★☆", texto: "..." } ],
       "fan-17": [ ... ]
     }

   Así cada producto tiene su propia lista de reseñas.
   ========================================================= */

import type { Resena } from './productos'
import { guardarDatos, leerDatos } from '../utils/almacenamiento'

/* Record<string, Resena[]> (S6): objeto con claves de texto (id del
   producto) y, como valor, la lista de reseñas de ese producto. */
type ResenasGuardadas = Record<string, Resena[]>

const CLAVE = 'yoko-resenas'

/* Reseñas guardadas de UN producto. Si no tiene, un arreglo vacío.
   "??" significa: si lo de la izquierda no existe, usa lo de la derecha. */
export function leerResenas(productoId: number | string): Resena[] {
  return leerDatos<ResenasGuardadas>(CLAVE, {})[String(productoId)] ?? []
}

/* Agrega una reseña a un producto y guarda todo.
   Devuelve true si se guardó y false si falló. */
export function guardarResena(productoId: number | string, resena: Resena): boolean {
  const todas = leerDatos<ResenasGuardadas>(CLAVE, {})
  const id = String(productoId)
  todas[id] = [...(todas[id] ?? []), resena]
  return guardarDatos(CLAVE, todas)
}

/* Convierte un número (1 a 5) en estrellas: 4 → "★★★★☆".
   repeat() repite un texto las veces indicadas. */
export function textoEstrellas(cantidad: number): string {
  return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad)
}
