import useListaPersistente from "../hooks/useListaPersistente";
// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { createContext, useContext, type ReactNode } from "react";

type FavoritosContextType = {
  error: string;
  pendiente: boolean;
  favoritos: string[]; // ids guardados como texto ("3", "fan-171...")
  esFavorito: (id: number | string) => boolean;
  alternarFavorito: (id: number | string) => void; // agrega o quita
};

const FavoritosContext = createContext<FavoritosContextType | undefined>(
  undefined,
);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const {
    lista: favoritos,
    guardar,
    error,
    pendiente,
  } = useListaPersistente<string>("favoritos");
  const setFavoritos = (lista: string[]) => {
    void guardar(lista);
  };

  function esFavorito(id: number | string) {
    return favoritos.includes(String(id));
  }

  /* Si ya está, lo quitamos con filter; si no, lo agregamos con spread.
     Siempre creamos un arreglo NUEVO (no se debe mutar el estado, S9). */
  function alternarFavorito(id: number | string) {
    const texto = String(id);
    if (favoritos.includes(texto)) {
      setFavoritos(favoritos.filter((favorito) => favorito !== texto));
    } else {
      setFavoritos([...favoritos, texto]);
    }
  }

  return (
    <FavoritosContext.Provider
      value={{ error, pendiente, favoritos, esFavorito, alternarFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

/* Hook para usar los favoritos: const { esFavorito } = useFavoritos() */
// eslint-disable-next-line react-refresh/only-export-components
export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context)
    throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
  return context;
}
