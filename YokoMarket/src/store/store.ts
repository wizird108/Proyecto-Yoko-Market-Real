// Redux mantiene una única lista de productos y comentarios para todas las vistas.
import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { Producto, Resena } from "../data/productos";

export interface Comentario extends Resena {
  id: string;
  producto_id: string;
}
const catalogo = createSlice({
  name: "catalogo",
  initialState: {
    cargado: false,
    publicaciones: [] as Producto[],
    comentarios: [] as Comentario[],
  },
  reducers: {
    recibirPublicaciones(state, action: PayloadAction<Producto[]>) {
      state.publicaciones = action.payload;
      state.cargado = true;
    },
    recibirComentarios(state, action: PayloadAction<Comentario[]>) {
      state.comentarios = action.payload;
    },
  },
});
export const { recibirPublicaciones, recibirComentarios } = catalogo.actions;
export const store = configureStore({
  reducer: { catalogo: catalogo.reducer },
});
export type RootState = ReturnType<typeof store.getState>;
export function useCatalogo() {
  return useSelector((state: RootState) => state.catalogo);
}
