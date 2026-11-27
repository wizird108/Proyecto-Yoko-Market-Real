import useListaPersistente from "../hooks/useListaPersistente";
// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { createContext, useContext, type ReactNode } from "react";

export interface ItemCarrito {
  id: number | string; // id del producto
  talla: string | null; // null si el producto no tiene tallas
  cantidad: number;
}

type CarritoContextType = {
  error: string;
  pendiente: boolean;
  items: ItemCarrito[];
  cantidadTotal: number; // suma de todas las cantidades
  agregar: (id: number | string, talla: string | null) => void;
  sumar: (indice: number) => void;
  restar: (indice: number) => void;
  eliminar: (indice: number) => void;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const {
    lista: items,
    guardar,
    error,
    pendiente,
  } = useListaPersistente<ItemCarrito>("carrito");
  const setItems = (lista: ItemCarrito[]) => {
    void guardar(lista);
  };

  function agregar(id: number | string, talla: string | null) {
    /* findIndex (S3): posición de la fila con el mismo producto y talla, o -1. */
    const indice = items.findIndex(
      (item) => String(item.id) === String(id) && item.talla === talla,
    );
    if (indice === -1) {
      setItems([...items, { id, talla, cantidad: 1 }]);
    } else {
      sumar(indice);
    }
  }

  /* .map() crea un arreglo nuevo cambiando solo la fila indicada. */
  function sumar(indice: number) {
    setItems(
      items.map((item, i) =>
        i === indice ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    );
  }

  /* No baja de 1 (para quitarlo está el botón Eliminar), igual que el original. */
  function restar(indice: number) {
    setItems(
      items.map((item, i) =>
        i === indice && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item,
      ),
    );
  }

  /* .filter() deja todas las filas menos la indicada. */
  function eliminar(indice: number) {
    setItems(items.filter((_item, i) => i !== indice));
  }

  /* .reduce() (S3) suma las cantidades de todas las filas. */
  const cantidadTotal = items.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        error,
        pendiente,
        items,
        cantidadTotal,
        agregar,
        sumar,
        restar,
        eliminar,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

/* Hook para usar la bolsa: const { items, agregar } = useCarrito() */
// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
}
