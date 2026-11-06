/* =========================================================
   FavoritosContext.tsx — FAVORITOS (estado global)
   Mismo patrón que Auth.tsx (contexto + Provider + hook).
   Reemplaza a leerFavoritos() y crearBotonFavorito() de
   interacciones.js del original.

   Igual que el original, guardamos solo los IDs (no copias de
   los productos) en localStorage, clave "yoko-favoritos".
   Al ser global, todos los corazones y la Wishlist del perfil
   se actualizan juntos cuando cambia la lista.
   ========================================================= */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { guardarDatos, leerDatos } from '../utils/almacenamiento'

type FavoritosContextType = {
  favoritos: string[] // ids guardados como texto ("3", "fan-171...")
  esFavorito: (id: number | string) => boolean
  alternarFavorito: (id: number | string) => void // agrega o quita
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined)

export function FavoritosProvider({ children }: { children: ReactNode }) {
  /* Lista inicial: lo que había guardado en el navegador. */
  const [favoritos, setFavoritos] = useState<string[]>(() => leerDatos<string[]>('yoko-favoritos', []))

  /* useEffect (S9): cada vez que la lista cambia, la guardamos. */
  useEffect(() => {
    guardarDatos('yoko-favoritos', favoritos)
  }, [favoritos])

  function esFavorito(id: number | string) {
    return favoritos.includes(String(id))
  }

  /* Si ya está, lo quitamos con filter; si no, lo agregamos con spread.
     Siempre creamos un arreglo NUEVO (no se debe mutar el estado, S9). */
  function alternarFavorito(id: number | string) {
    const texto = String(id)
    if (favoritos.includes(texto)) {
      setFavoritos(favoritos.filter((favorito) => favorito !== texto))
    } else {
      setFavoritos([...favoritos, texto])
    }
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, alternarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  )
}

/* Hook para usar los favoritos: const { esFavorito } = useFavoritos() */
// eslint-disable-next-line react-refresh/only-export-components
export function useFavoritos() {
  const context = useContext(FavoritosContext)
  if (!context) throw new Error('useFavoritos debe usarse dentro de FavoritosProvider')
  return context
}
