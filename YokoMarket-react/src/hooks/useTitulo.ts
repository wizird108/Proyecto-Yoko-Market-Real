/* =========================================================
   useTitulo.ts — HOOK PERSONALIZADO (S9)
   Cambia el texto de la pestaña del navegador, como hacía
   "document.title = ..." en cada página del original.

   Un hook personalizado es una función que usa otros hooks
   (aquí useEffect) y su nombre empieza por "use". Así no
   repetimos el mismo useEffect en cada página.

   Uso:  useTitulo('YokoMarket | Inicio')
   ========================================================= */

import { useEffect } from 'react'

function useTitulo(titulo: string) {
  /* Se ejecuta después de dibujar la página, y otra vez si el
     título cambia (por eso [titulo] en las dependencias). */
  useEffect(() => {
    document.title = titulo
  }, [titulo])
}

export default useTitulo
